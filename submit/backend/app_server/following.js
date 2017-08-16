exports.setup = function(app) {
    app.get('/following', isLoggedIn, getFollowers)
    app.put('/following/:user*?', isLoggedIn, addFollower)
    app.delete('/following/:user*?', isLoggedIn, rmFollower)
}

// Fetch middleware from other modules through exports and require pair
var isLoggedIn = require('./auth.js').isLoggedIn
var Profile = require('./model.js').Profile

/**
 * Get the followers of a user and send to client
 * @param  {Object}   req  [request]
 * @param  {Object}   res  [response]
 */
function getFollowers(req, res) {
    var userObj = req.username;
    if (!userObj) {
        return res.sendStatus(401);
    }
    var username = userObj.username;
    Profile.findOne({ username: username })
        .select('-_id username following').exec(function(err, items) {
            res.send(items);
        })
}

/**
 * Add a new follower
 * @param  {Object}   req  [request]
 * @param  {Object}   res  [response]
 */
function addFollower(req, res) {
    var userObj = req.username;
    if (!userObj) {
        return res.sendStatus(401);
    }
    //If that user isn't in the database, then we should just return the current followers
    var user = req.params.user;
    var username = userObj.username;
    Profile.findOne({ username: username }).exec(function(err, items) {
        Profile.find({ username: user }).count().exec(function(err, count) {
            //If user in database then add the follower
            if (count) {
                items.following.push(user);
            }
            items.save(function() {
                Profile.findOne({ username: username })
                    .select('-_id username following').exec(function(err, items) {
                        return res.send(items);
                    });
            });
        })
    })
}

/**
 * Remove a follower from the following list
 * @param  {Object}   req  [request]
 * @param  {Object}   res  [response]
 */
function rmFollower(req, res) {
    var userObj = req.username;
    if (!userObj) {
        return res.sendStatus(401);
    }
    var delFollower = req.params.user;
    var username = userObj.username;
    Profile.findOne({ username: username }).exec(function(err, items) {
        //Check whehter the follower to be deleted is in the following list
        var index = items.following.indexOf(delFollower);
        if (index != -1) {
            items.following.splice(index, 1);
        }
        items.save(function() {
            Profile.findOne({ username: username })
                .select('-_id username following').exec(function(err, items) {
                    return res.send(items);
                });
        })

    });

}
