(function(jasmine) {
    var $q
    var promises = []
        //Initialize posts with a default post inside
    var posts = {
        posts: [{
            id: 1,
            author: "gl22",
            body: "test",
            comments: [
                { 'author': 'gl22', 'body': 'test', 'commentId': 1 }
            ]
        }]
    }

    /**
     * @param  {Object} a promise which will be resolved later
     */
    function init(_$q_) {
        $q = _$q_
    }

    /**
     * @param  {Object} mocking response sent to user on success
     * @return {[Object]} returns a promise Object
     */
    function makePromise(response) {
        var p = $q.defer()
        promises.push({ promise: p, response: response })
        return { $promise: p.promise }
    }

    /**
     * mockApiService: substitute the original api resource for test purpose
     * @type {Object}
     */
    var mockApiService = {
        /**
         * @param  {Object} a user object containing username and password
         * @return {Object} returns a promise
         */
        login: function(user) {
            if (user.username=='user'&&user.password=='1234') {
                return makePromise({ username: user.username, result: "success" })
            }
            return makePromise({reject:"rejected"})
        },
        /**
         * @return {Object} returns a promise containing status information
         */
        getStatus: function() {
            return makePromise({ statuses: [{ username: "gl22", status: "Happy" }] })
        },
        /**
         * @return {Object} returns a promise containing followers
         */
        getFollower: function() {
            return makePromise({ statuses: [{ username: "gl22", status: "Happy" }] })
        },
        /**
         * @return {Object} returns a promise containing user profile picture
         */
        getAvatar: function() {
            return makePromise({ "pictures": [{ "username": "gl22", "picture": "pic.com" }] })
        },

        /**
         * @param {Object} returns a promise containing user-added post
         */
        addPost: function(post) {
            var post2add = {};
            post2add.id = posts.posts.length + 1;
            post2add.author = "gl22";
            post2add.body = post.body
            post2add.comments = []
            posts.posts.push(post2add)
            return makePromise(posts)
        },
        /**
         * @return {Object} returns a promise containing all posts
         */
        getPosts: function() {
            return makePromise(posts)
        },
        /**
         * @param  {Object} determine what to update
         * 					commentId == -1: add new comment
         * 					commentId defined & != -1: edit comment
         * 					commentId undefined: edit post
         * @return {Object} returns a promise containing edited post
         */
        updatePost: function(post) {
            if (post.commentId == -1) {
                var editPost = findPost(post.id);
                var comment = {};
                comment.commentId = editPost.comments.length + 1;
                comment.author = "gl22";
                comment.body = post.body;
                editPost.comments.push(comment);
                return makePromise({ posts: [editPost] })
            } else if (post.commentId == undefined) {
                var editPost = findPost(post.id);
                editPost.body = post.body;
                return makePromise({ posts: [editPost] })
            } else {
                var editPost = findPost(post.id);
                var comment = findComment(post.commentId, editPost);
                comment.body = post.body;
                return makePromise({ posts: [editPost] })
            }
        },
        /**
         * @param  {Object} an Object containing status to be updated
         * @return {Object} a promise containing updated status
         */
        updateStatus: function(status) {
            return makePromise({ username: "gl22", status: status.status })
        },
        /**
         * @return {Object} a promise containing a logout acknowledgement
         */
        logout: function() {
            return makePromise({ result: "OK" })
        }
    }

    /**
     * @param  {integer} find post with a specific id 
     * @return {Object} returns the post if found
     */
    function findPost(id) {
        var temp = posts.posts.findIndex(function(post) {
            return post.id === id
        })
        if (temp >= 0) {
            return posts.posts[temp]
        }
    }

    /**
     * @param  {integer} find comment with a specific commentId
     * @param  {Object} post where wanted comment are to be found
     * @return {Object} returns the comment if found
     */
    function findComment(id, post) {
        var temp = post.comments.findIndex(function(comment) {
            return comment.commentId === id
        })
        if (temp >= 0) {
            return post.comments[temp]
        }
    }

    /**
     * @param  {Object} scope to be resolved
     */
    var resolveTestPromises = function(rootScope) {
        promises.forEach(function(p) {
            if(p.response.reject) {
                p.promise.reject('illegal login');
            }
            p.promise.resolve(p.response)
        })
        promises.length = 0
        rootScope.$apply()
    }

    jasmine.helper = {
        init: init,
        mockApiService: mockApiService,
        resolveTestPromises: resolveTestPromises
    }

})(window.jasmine)
