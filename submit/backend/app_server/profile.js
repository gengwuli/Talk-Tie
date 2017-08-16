// this is profile.js which contains all user profile 
// information except passwords which is in auth.js
exports.setup = function(app) {
    app.get('/statuses/:users*?', isLoggedIn, getStatuses)
    app.get('/status/', isLoggedIn, getStatus)
    app.put('/status/', isLoggedIn, updateStatus)
    app.get('/email/:user*?', isLoggedIn, getEmail)
    app.put('/email/', isLoggedIn, updateEmail)
    app.get('/zipcode/:user*?', isLoggedIn, getZipcode)
    app.put('/zipcode/', isLoggedIn, updateZipcode)
    app.get('/pictures/:users*?', isLoggedIn, getPictures)
    app.put('/picture/', isLoggedIn, uploadImage, updatePicture)
}

var isLoggedIn = require('./auth.js').isLoggedIn
var Profile = require('./model.js').Profile
var uploadImage = require('./cloudinary.js').uploadImage
var putImage = require('./cloudinary.js').putImage

/**
 * Get statuses for requested users or the loggedin user
 * @param  {Object}   req  request
 * @param  {Object}   res  response
 */
function getStatuses(req, res) {
    var userObj = req.username;
    if (!userObj) {
        return res.send(401);
    }
    var users;
    users = req.params.users ? req.params.users.split(',') : userObj.username;
    Profile.find({ username: { $in: users } })
        .select('-_id username status').exec(function(err, items) {
            res.send({ statuses: items })
        })
}

/**
 * Return the status of loggedin user
 * @param  {Object}   req  request
 * @param  {Object}   res  response
 */
function getStatus(req, res) {
    var userObj = req.username;
    if (!userObj) {
        return res.send(401);
    }
    Profile.find({ username: userObj.username })
        .select('-_id username status').exec(function(err, items) {
            res.send({ statuses: items })
        })
}

/**
 * Update the status of loggedin user
 * @param  {Object}   req  request
 * @param  {Object}   res  response
 */
function updateStatus(req, res) {
    var userObj = req.username;
    if (!userObj) {
        return res.send(401);
    }
    var status = req.body.status;
    Profile.findOne({ username: userObj.username }).exec(function(err, items) {
        items.status = status || items.status;
        items.save(function(err) {
            Profile.findOne({ username: userObj.username })
                .select('-_id username status').exec(function(err, items) {
                    res.send(items)
                })
        })
    })
}

/**
 * Get the email of requested user or the loggedin user
 * @param  {Object}   req  request
 * @param  {Object}   res  response
 */
function getEmail(req, res) {
    var userObj = req.username;
    if (!userObj) {
        return res.send(401);
    }
    var username;
    username = req.params.user ? req.params.user : userObj.username;
    //different from dummy server, when no user found or have multiple users, gl22, sep1, returns 500
    Profile.findOne({ username: username })
        .select('-_id username email').exec(function(err, items) {
            res.send(items)
        })
}

/**
 * Update the email of loggedin user
 * @param  {Object}   req  request
 * @param  {Object}   res  response
 */
function updateEmail(req, res) {
    var userObj = req.username;
    if (!userObj) {
        return res.send(401);
    }
    var email = req.body.email;
    Profile.findOne({ username: userObj.username }).exec(function(err, items) {
        items.email = email || items.email;
        items.save(function(err) {
            Profile.findOne({ username: userObj.username })
                .select('-_id username email').exec(function(err, items) {
                    res.send(items)
                })
        })
    })
}

/**
 * Get the zipcode of requested user or the loggedin user
 * @param  {Object}   req  request
 * @param  {Object}   res  response
 */
function getZipcode(req, res) {
    var userObj = req.username;
    if (!userObj) {
        return res.send(401);
    }
    var username;
    username = req.params.user ? req.params.user : userObj.username;
    Profile.findOne({ username: username })
        .select('-_id username zipcode').exec(function(err, items) {
            res.send(items)
        })
}

/**
 * Update the zipcode of loggedin user
 * @param  {Object}   req  request
 * @param  {Object}   res  response
 */
function updateZipcode(req, res) {
    var userObj = req.username;
    if (!userObj) {
        return res.send(401);
    }
    var zipcode = req.body.zipcode;
    Profile.findOne({ username: userObj.username }).exec(function(err, items) {
        items.zipcode = zipcode || items.zipcode;
        items.save(function(err) {
            Profile.findOne({ username: userObj.username })
                .select('-_id username zipcode').exec(function(err, items) {
                    res.send(items)
                })
        })
    })
}

/**
 * Get the pictures of requested users or the loggedin user
 * @param  {Object}   req  request
 * @param  {Object}   res  response
 */
function getPictures(req, res) {
    var userObj = req.username;
    if (!userObj) {
        return res.send(401);
    }
    var users;
    users = req.params.users ? req.params.users.split(',') : userObj.username;
    Profile.find({ username: { $in: users } })
        .select('-_id username picture').exec(function(err, items) {
            res.send({ pictures: items })
        })
}

/**
 * Update user picture
 * @param  {Object}   req  request
 * @param  {Object}   res  response
 */
function updatePicture(req, res) {
    var userObj = req.username;
    if (!userObj) {
        return res.send(401);
    }
    putImage(req, res, callback);
    function callback(imgUrl) {
        Profile.findOne({ username: userObj.username }).exec(function(err, profile) {
            profile.picture = imgUrl;
            profile.save(function(err) {
                res.send({ username: userObj.username, picture: imgUrl })
            });
        })
    }
}
