require('dot-env')
var md5 = require('md5')
var passport = require('passport')
var session = require('express-session')
var cookieParser = require('cookie-parser')
var Post = require('./model.js').Post
var User = require('./model.js').User
var Profile = require('./model.js').Profile
var TwitterStrategy = require('passport-twitter').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

console.log(process.env.REDIS_URL)
var redis = require('redis').createClient(process.env.REDIS_URL)

exports.isLoggedIn = isLoggedIn
exports.setup = function(app) {
    app.post('/login', login)
    app.post('/register', register)
    app.put('/merge', isLoggedIn, merge)
    app.put('/logout', isLoggedIn, logout)
    app.put('/demerge', isLoggedIn, demerge)
    app.put('/password', isLoggedIn, password)
        //Facebook authentication
    app.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email', 'user_birthday'] }))
    app.get('/auth/facebook/callback', passport.authenticate('facebook', {
            successRedirect: '/profile',
            failureRedirect: '/fail'
        }))
        //Google authentication
    app.get('/auth/google',
        passport.authenticate('google', { scope: ['profile', 'email'] }));
    app.get('/auth/google/callback',
        passport.authenticate('google', { failureRedirect: '/fail' }),
        function(req, res) {
            res.redirect('/profile');
        });
    //Twitter authenticatoin
    app.get('/auth/twitter', passport.authenticate('twitter', { scope: ['email'] }));
    app.get('/auth/twitter/callback',
        passport.authenticate('twitter', {
            successRedirect: '/profile',
            failureRedirect: '/fail'
        }));
    app.get('/fail', fail)
    app.get('/profile', profile)
}

var users = {};
var _following = [];
var _cookieKey = 'sid'
var _status = 'Becoming a Web Developer';
var _picture = 'https://upload.wikimedia.org/wikipedia/en/thumb/4/4e/DWLeebron.jpg/220px-DWLeebron.jpg'
var frontRedirectUrl = "https://gengwufront.herokuapp.com"
var authCallbackUrl = "https://gengwuback.herokuapp.com/auth"

passport.serializeUser(function(user, done) {
    users[user.id] = user
    done(null, user.id)
})

passport.deserializeUser(function(id, done) {
    var user = users[id]
    done(null, user)
})

//Third party authentication
passport.use(new FacebookStrategy({
    'clientSecret': '*************************',
    'clientID': '***************************',
    'callbackURL': authCallbackUrl+'/facebook/callback',
    profileFields: ['id', 'email', 'name'],
}, function(token, refreshToken, profile, done) {
    process.nextTick(function() {
        return done(null, profile)
    })
}))

passport.use(new GoogleStrategy({
        clientID: '*******************************************',
        clientSecret: '***************************************',
        callbackURL: authCallbackUrl+'/google/callback'
    },
    function(accessToken, refreshToken, profile, done) {
        process.nextTick(function() {
            return done(null, profile)
        })
    }
));

passport.use(new TwitterStrategy({
        consumerKey: '***********************************',
        consumerSecret: '*************************************',
        callbackURL: authCallbackUrl+'/twitter/callback'
    },
    function(token, tokenSecret, profile, done) {
        process.nextTick(function() {
            return done(null, profile)
        })
    }
));

/**
 * Where user should be when sucessfully authenticated through third party
 * @param  {Object}   req  request
 * @param  {Object}   res  response
 */
function profile(req, res) {
    thirdPartyLogin(req.user, req, res)
}

/**
 * Log in with third party
 * @param  {Object} user user information returned from third party
 * @param  {Object}   req  request
 * @param  {Object}   res  response
 */
function thirdPartyLogin(user, req, res) {
    //Remember third party provider
    var thirdParty = user.provider;
    var authId = 'auth.' + thirdParty + '.aid';
    //find whether that third party id has been registered in the database
    User.find({
        [authId]: user.id
    }).exec(function(err, items) {
        if (err) {
            return res.sendStatus(500)
        }
        if (items.length == 0) {
            createThirdPartyAccount(user, thirdParty, authId, res)
        } else {
            //if we find a third party user in the record, create an cookie and log him in
            var userObj = items[0];
            var username = userObj.username;
            setCookieForThirdParty(username, userObj, thirdParty, res);
            return res.redirect(frontRedirectUrl+"/#/profile")
        }
    })
}

/**
 * Create third party documents including User and Profile document
 * @param  {Object} user       User information returned from third party
 * @param  {String} thirdParty name of the third party provider
 * @param  {String} authId     third party id
 * @param  {Object} res        response Object
 */
function createThirdPartyAccount(user, thirdParty, authId, res) {
    var id = user.id
    var username = thirdParty === "twitter" ? user.displayName + "@" + thirdParty : user.name.givenName + "@" + thirdParty;
    var email = thirdParty === "twitter" ? "" : user.emails[0].value;
    var thirdPartyAuth = { aid: id, email: email }
    var payload = { username: username, auth: {} }
    payload.auth[thirdParty] = thirdPartyAuth;
    new User(payload).save(function() {
        //Fetch the third party document we just created 
        User.findOne({
            [authId]: user.id
        }).exec(function(err, item) {
            if (err) {
                return res.send(500)
            }
            //Profile document should be created along with user document
            new Profile({
                username: username,
                following: _following,
                picture: _picture,
                status: _status,
                email: email,
                zipcode: "00000"
            }).save(function() {
                //Create a cookie for the third party user
                setCookieForThirdParty(username, item, thirdParty, res);
                return res.redirect(frontRedirectUrl+"/#/profile")
            })
        })
    })
}

/**
 * Set cookie for third party on register or login 
 * @param {String} username   The username stored in redis for the logged in user
 * @param {Object} userObj    User object stored in redis
 * @param {String} thirdParty Third party provider name
 * @param {Object} res        Response Object
 */
function setCookieForThirdParty(username, userObj, thirdParty, res) {
    var sessionKey = md5("mySecretMessage" + new Date().getTime() + username)
    userObj.provider = thirdParty
    userObj.aid = userObj.auth[thirdParty].aid
    redis.hmset(sessionKey, userObj)
    res.cookie(_cookieKey, sessionKey, { maxAge: 3600 * 1000, httpOnly: true })
}

function fail(req, res) {
    res.send('fail!')
}

/**
 * This middleware checks whether a user is logged in or not
 * It first fetches cookie from the request using cookie-parser
 * and use the cookie to find the loggedin user in the _sessionUser object
 * If find then add user Object to the req which is then passed to other function
 * NOTE: this middleware must be passed to other modules so as be used to verify
 *       the current request user is loggedin
 * @param  {Object}   req  request
 * @param  {Object}   res  response
 * @param  {Function} next next function
 */
function isLoggedIn(req, res, next) {
    var sid = req.cookies[_cookieKey]
    console.log('sid', sid)
    if (!sid) {
        return res.sendStatus(401)
    }
    redis.hgetall(sid, function(err, userObj) {
        if (userObj) {
            req.username = userObj
            next()
        } else {
            return res.sendStatus(401)
        }
    })
}

/**
 * This function log a user in by reading the username and password
 * from the request and then fetching the salt from the database,
 * calculating the hash and comparing computed hash with that from
 * the server. If the two matches, log the user in, returns a cookie and
 * then store the loggedin user in sessionUser
 * @param  {Object}   req  [request]
 * @param  {Object}   res  [response]
 */
function login(req, res) {
    var username = req.body.username;
    var password = req.body.password;
    if (!username || !password) {
        return res.sendStatus(400);
    }
    //A very small function can bite you out of no where, put err and userObj all in
    User.findOne({ username: username }).exec(function(err, userObj) {
        if (!userObj || userObj.hash !== md5(userObj.salt + password)) {
            return res.sendStatus(401);
        }
        var sessionKey = md5("mySecretMessage" + new Date().getTime() + userObj.username)
        redis.hmset(sessionKey, userObj)
        res.cookie(_cookieKey, sessionKey, { maxAge: 3600 * 1000, httpOnly: true })
        var msg = { username: username, result: 'success' };
        res.send(msg);
    });
}

/**
 * This function log the user out and deletes the cached user
 * @param  {Object}   req  [request]
 * @param  {Object}   res  [response]
 */
function logout(req, res) {
    if (req.username) {
        res.clearCookie(_cookieKey)
        return res.sendStatus(200)
    } else {
        return res.endStatus(401)
    }
}

/**
 * This function register a new user and store the user information
 * into the Profile and User documents in the database
 * @param  {Object}   req  [request]
 * @param  {Object}   res  [response]
 */
function register(req, res) {
    var body = req.body;
    var username = body.username;
    var email = body.email;
    var zipcode = body.zipcode;
    var password = body.password;

    User.find({ username: username }).count().exec(function(err, count) {
        if (count != 0) {
            return res.status(404).send({ result: "User already exist" })
        }
        createUser(username, password);
        createProfile(username, _status, _following, email, zipcode, _picture);
        return res.send({ result: "success", username: username })
    })
}

/**
 * Add the register user profile information into the Profile document
 * @param  {String} username  
 * @param  {String} status    
 * @param  {String} following 
 * @param  {String} email     
 * @param  {String} zipcode   
 * @param  {String} picture   
 */
function createProfile(username, status, following, email, zipcode, picture) {
    new Profile({
        username: username,
        status: status,
        following: following,
        email: email,
        zipcode: zipcode,
        picture: picture
    }).save();
}

/**
 * Add the register user credential to the User document so that 
 * the register user can log in
 * @param  {String} username 
 */
function createUser(username, password) {
    //Generating a random salt and calculating the hash as a substitue for the raw password
    var salt = Math.random();
    var hash = md5(salt + password);
    new User({ username: username, salt: salt, hash: hash }).save();
}

/**
 * Update user password. It changes both salt and hash.
 * NOTE: while updating the password, we delete the old userObj in _sessionUser,
 *       add the updated userObj, and reset the cookie
 * @param  {Object}   req  [request]
 * @param  {Object}   res  [response]
 */
function password(req, res) {
    var userObj = req.username;
    if (!userObj) {
        return res.sendStatus(401);
    }
    User.findOne({ username: userObj.username }).exec(function(err, items) {
        var password = req.body.password;
        var salt = Math.random();
        var hash = md5(salt + password);
        items.hash = hash;
        items.salt = salt;
        items.save(function() {
            res.send({ username: items.username, status: "Password Updated!" });
        })
    })
}

/**
 * Merge third party accounts with existing account registered through the website
 * @param  {Object} req request Object
 * @param  {Object} res response Object
 */
function merge(req, res) {
    var userObj = req.username;
    if (!userObj) {
        return res.sendStatus(401);
    }
    if (!req.body || !req.body.username || !req.body.password) {
        return res.sendStatus(404)
    }
    var username = req.body.username;
    var password = req.body.password;

    var thirdParty = userObj.provider;
    //Find whether loggedin user is in database
    User.findOne({ username: username }).exec(function(err, user) {
        if (!user) {
            return res.sendStatus(404)
        }
        if (user.hash !== md5(user.salt + password)) {
            return res.sendStatus(401);
        }
        //If username and password are good, remove third party account 
        //and add the authentication information to the account to merge with
        var thirdPartyUsername = userObj.username;
        var thirdParty = userObj.provider;
        var authId = 'auth.' + thirdParty + '.aid';
        if (user.password) {
            return res.send(200)
        }
        User.findOneAndRemove({
            [authId]: userObj.aid
        }).where('salt').equals(null).exec(function(err, userToLink) {
            if (err) {
                return res.sendStatus(500);
            }
            if (!userToLink) {
                return res.sendStatus(404)
            }
            //Avoid side effect by setting aid to undefined
            userObj.aid = undefined;
            user.auth = user.auth || {}
            user.auth[thirdParty] = userToLink.auth[thirdParty]
                //Change the author of all posts by third party user to linked account 
            Post.find({ author: thirdPartyUsername }).exec(function(err, posts) {
                if (posts) {
                    posts.forEach(function(post) {
                        post.author = username;
                        post.save();
                    })
                }
                //And put all followers to the linked account followers
                Profile.findOne({ username: username }).exec(function(err, profile) {
                    if (!profile) {
                        return res.sendStatus(404)
                    }
                    Profile.findOneAndRemove({ username: thirdPartyUsername }).exec(function(err, profileToMerge) {
                        if (!profileToMerge) {
                            return res.sendStatus(404)
                        }
                        profileToMerge.following.forEach(function(follower) {
                                if (profile.following.indexOf(follower) == -1) {
                                    profile.following.push(follower);
                                }
                            })
                            //Linked accounts has been modified in terms of profile and user, so save them
                        profile.save(function() {
                            user.save(function() {
                                setCookieForThirdParty(userObj.username, user, thirdParty, res)
                                userObj.aid = undefined;
                                return res.send({ result: "merge succeed!" })
                            })
                        })
                    })
                })
            })
        })
    })
}

/**
 * Seperate a linked account
 * @param  {Object} req request Object
 * @param  {Object} res response Object
 */
function demerge(req, res) {
    var userObj = req.username;
    var username = req.body.username;
    var whichOneToPart = userObj.provider;
    if (!userObj) {
        return res.sendStatus(401);
    }
    //Find a user to detach and then delete it's respective third party field
    User.findOne({ username: userObj.username }).exec(function(err, user) {
        if (err) {
            return res.send(500)
        }
        //Can only unlink third-party user
        if (user.auth && userObj.username.indexOf('@') == -1) {
            user.auth[whichOneToPart] = undefined;
            user.save(function() {
                return res.send({ result: "Part succeed" })
            })
        } else {
            return res.status(404).send({ result: "Part failed" })
        }
    })
}
