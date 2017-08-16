
// This script logs into the dummy server and logs into your server
// it pulls data from the dummy server and pushes it into your server

var fs = require('fs')
var request = require('request').defaults({jar: true})

var cred = {}
fs.readFile('./cred.json', function(err, data) {    
    var d = JSON.parse(data)    
    Object.keys(d).forEach(function(key) {
        cred[key] = d[key]
    })
    login()
})

function login() {
    request({ url: cred.dummy_url + '/login', method: 'POST',
        json: { "username": cred.dummy_username, "password": cred.dummy_password }
    }, function (err, res, body) {
        if (err || body.result !== "success") {
            console.error("There was an error logging into the dummy server with credentials: " + cred, err)
            process.exit(1)
        }       
        getPosts()
    })
}

var postsToPost;
function getPosts(cookie) { 
    request({ url: cred.dummy_url + '/posts/hz44', method: 'GET', json:true }, function(err, res, body) {
        if (err) {
            console.error("There was an error grabbing posts from the dummy server", err)
            process.exit(1)
        }       
        postsToPost = body.posts
        console.log("Read " + postsToPost.length + " posts from dummy server")
        loginToSite()
    })
}

function loginToSite() {
    request({ url: cred.site_url + '/login', method: 'POST',
        json: { "username": cred.site_username, "password": cred.site_password }
    }, function(err, res, body) {
        if (err) {
            console.error("There was an error logging into YOUR server with credentials: " + cred, err)
            process.exit(1)
        }       
        getPostCount(sendPosts)
    })
}

function sendPosts() {  
    var post = postsToPost.pop()
    if (post) {     
        request({ url: cred.site_url + '/post', method: 'POST', json: post }, function(err, res, body) {
            if (err) {
                console.error("There was an error making a post to YOUR server.  post=" + post, err)
                process.exit(1)
            }
            sendPosts()
        })
    } else {
        getPostCount(function() {
            console.log('You now have some data in your database!')
        })
    }
}

function getPostCount(next) {
    request({ url: cred.site_url + '/posts', method: 'GET', json:true }, function(err, res, body) {
        if (err) {
            console.error("There was an error grabbing posts from YOUR server", err)
            process.exit(1)
        }       
        console.log("Read " + body.posts.length + " posts from YOUR server")
        if (next) {
            next()
        }
    })
}