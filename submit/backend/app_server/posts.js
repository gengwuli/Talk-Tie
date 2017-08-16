var isLoggedIn = require('./auth.js').isLoggedIn

exports.setup = function(app) {
    app.get('/posts/:id*?', isLoggedIn, getPosts)
    app.put('/posts/:id*?', isLoggedIn, updatePost)
    app.post('/post', uploadImage, isLoggedIn, addPost)
}

var Profile = require('./model.js').Profile
var Post = require('./model.js').Post
var uploadImage = require('./cloudinary.js').uploadImage
var putImage = require('./cloudinary.js').putImage

/**
 * Get the posts by id, author or returns the posts
 * of loggedin user and his/her followers
 * @param  {Object}   req  request
 * @param  {Object}   res  response
 */
function getPosts(req, res) {
    //Determine which page to return, one page contains 10 docs maximum
    var whichPage = parseInt(req.query.whichPage || '1')
    var userObj = req.username;
    if (!userObj) {
        return res.sendStatus(401);
    }
    //Get the id, if it exists then it might be a post id or author
    //if id is not present, then return the posts by loggedin user and 
    //his/her followers
    var id = req.params.id;
    if (id) {
        //First find by id
        Post.find({ _id: id }).exec(function(err, postsById) {
            //If we get nothing, then maybe it's a author, so continue find by author
            if (!postsById || !postsById.length) {
                Post.find({ author: id }).exec(function(err, postsByAuthor) {
                    //If we get nothing, then we cannot find neither by item nor author
                    //so return empty posts. If we get something, return that.
                    var posts = postWithId(postsByAuthor, false);
                    res.send({ posts: posts })
                })
            } else {
                //If we get something by finding by id, then return that
                var posts = postWithId(postsById, false);
                res.send({ posts: posts });
            }
        })
    } else {
        // Return the posts by the loggedin author and his/her followers
        Profile.findOne({ username: userObj.username }).exec(function(err, userProfile) {
            if(!userProfile) {
                return res.sendStatus(404)
            }
            userProfile.following.push(userObj.username)
            Post
                .find({})
                .where('author')
                .in(userProfile.following)
                .limit(10)
                .skip(10*(whichPage-1)) // the whichPage page, skip the first whichPage-1 records, one page 10 docs
                .sort('-date')
                .exec(function(err, posts) {
                    return res.send({ posts: postWithId(posts, false) });
                })
        })
    }
}

/**
 * Get posts from all followers of the loggedin user
 * NOTE: The followers was added beforehand the loggedin user 
 *       so this function actually returns the posts of the loggedin
 *       user and his/her followers
 * @param  {String} followers List of followers and the loggedin user
 * @param  {Array} posts     empty array to hold the posts
 * @param  {Object} res       response Object
 * @return {Array}           return the posts by the loggedin user and followers
 */
function postsFromFollowers(followers, posts, res) {
    //Pop the followers until its empty, so we get all the posts
    var follower = followers.pop();
    if (!follower) {
        return res.send({ posts: posts })
    }
    Post.find({ author: follower }).exec(function(err, items) {
        if (items.length != 0) {
            postWithId(items, false).forEach(function(post) {
                posts.push(post);
            })
        }
        postsFromFollowers(followers, posts, res);
    })
}

/**
 * Prepare the post Object to be sent to client
 * NOTE: We need to replace the _id with id so the user will 
 *       see the id instead of _id which is returned inherently
 *       from the database.
 *       Also since the document might have additional fields, 
 *       we create a empty object and populate it with the fields
 *       only we need
 * @param  {Array}  items     contains all the posts or comments returned from database
 * @param  {Boolean} isComment Since we have also a commentSchema which also has a _id field
 * @return {Array}            replaced Posts or comments
 */
function postWithId(items, isComment) {

    if (!items || !items.length) {
        return [];
    }
    if (isComment) {
        var comments = []
        items.forEach(function(item) {
            var comment = {}
            comment.commentId = item._id;
            comment.author = item.author;
            comment.date = item.date;
            comment.body = item.body;
            comments.push(comment)
        })
        return comments;
    }
    var posts = []
    items.forEach(function(item) {
        var post = {}
        post.id = item._id;
        post.body = item.body;
        post.date = item.date;
        post.img = item.img;
        post.comments = postWithId(item.comments, true);
        post.author = item.author;
        posts.push(post)
    })
    return posts;
}

/**
 * Add a new post
 * @param  {Object}   req  request
 * @param  {Object}   res  response
 */
function addPost(req, res) {
    var userObj = req.username;
    if (!userObj) {
        return res.send(401);
    }
    var post = {};
    post.author = userObj.username;
    post.date = new Date();
    post.body = req.body.body; 

    putImage(req, res, callback)

    function callback(imgUrl) {
        post.img = imgUrl;
        new Post(post).save(function(result) {
            Post.find({})
                .where('author').equals(userObj.username)
                .where('body').equals(req.body.body)
                .exec(function(err, items) {
                    return res.send({ posts: postWithId(items, false) })
                })
        })
    }
}

/**
 * Update a post, this is the most tricky one cause we might end up with
 * editing a post or a comment or adding a comment
 * @param  {Object}   req  request
 * @param  {Object}   res  response
 */
function updatePost(req, res) {
    var userObj = req.username;
    if (!userObj) {
        return res.send(401);
    }
    //id is the post id
    var id = req.params.id;
    var post = req.body;
    //If id not present, send not found
    if (!id) {
        return res.send(404)
    }
    // Find the post with the post id
    Post.findOne({ _id: id }).exec(function(err, items) {
        if (!items) {
            return res.send(404)
        }
        if (!post.commentId) {
            //If the commentId is not present, edit the post
            if (items.author != userObj.username) {
                return res.send(401)
            }
            items.body = req.body.body || items.body;
            items.save(function(err) {
                Post.find({ _id: id }).exec(function(err, updatePosts) {
                    return res.send({ posts: postWithId(updatePosts, false) })
                })
            });
        } else if (post.commentId == -1) {
            // If we have a commentId and it's -1 then add a new comment
            var comment = {}
            comment.author = userObj.username;
            comment.date = new Date();
            comment.body = req.body.body;
            items.comments.push(comment);
            items.save(function(err) {
                Post.find({ _id: id }).exec(function(err, updatePosts) {
                    res.send({ posts: postWithId(updatePosts, false) })
                })
            });
        } else {
            // If we have a commentId and it's not -1 then find the comment with the commentId
            // if we find one comment, update it or else we return a not found
            var commentId = req.body.commentId;
            var index = items.comments.findIndex(function(comment) {
                return comment._id == commentId
            })
            if (index >= 0) {
                items.comments[index].body = req.body.body;
                items.save(function(err) {
                    Post.find({ _id: id }).exec(function(err, updatePosts) {
                        return res.send({ posts: postWithId(updatePosts, false) })
                    })
                });
            } else {
                return res.sendStatus(404);
            }
        }
    });
}
