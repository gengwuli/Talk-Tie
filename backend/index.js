var logger = require('morgan')
var qs = require('querystring')
var express = require('express')
var request = require('request')
var passport = require('passport')
var bodyParser = require('body-parser')
var session = require('express-session')
var cookieParser = require('cookie-parser')
var isLoggedIn = require('./app_server/auth.js').isLoggedIn
var FacebookStrategy = require('passport-facebook').Strategy

//Middleware must be used in order
var app = express()
app.use(cookieParser())
app.use(bodyParser.json())
app.use(logger("default"))
app.use(session({secret: 'ThisIsASecretMessage'}))
app.use(passport.initialize())
app.use(passport.session())
app.use(corsEnable);

app.get('/', hello)
app.get('/link', isLoggedIn, getLink)

require('./app_server/profile.js').setup(app);
require('./app_server/posts.js').setup(app);
require('./app_server/auth.js').setup(app);
require('./app_server/following.js').setup(app);

function corsEnable(req, res, next) {
    res.set({
        'Access-Control-Allow-Origin': req.get('origin'),
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Allow-Headers': 'Authorization, Content-Type, X-Requested-With'
    })
    if (req.method == 'OPTIONS') {
        //remember to add a return or it will affect the latter request
        return res.sendStatus(200)
    }
    next();
}

if (process.env.NODE_ENV !== "production") {
    require('dot-env')
}

function hello(req, res) {
    res.send('Hello World!')
}

function getLink(req, res) {
    var userObj = req.username;
    if(!userObj || !userObj.provider) {
        return res.send({link:''});
    }
    return res.send({link:userObj.provider});
}

// Get the port from the environment, i.e., Heroku sets it
var port = process.env.PORT || 3000

//////////////////////////////////////////////////////
var server = app.listen(port, function() {
     console.log('Server listening at http://%s:%s', 
               server.address().address,
               server.address().port)
})
