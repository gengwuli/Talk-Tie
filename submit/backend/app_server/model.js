// User mongoose to make our life easier, and load db.js to connect to database
var mongoose = require('mongoose')
require('./db.js')

var commentSchema = new mongoose.Schema({
    commentId: Number,
    author: String,
    date: Date,
    body: String
})

var postSchema = new mongoose.Schema({
    id: Number,
    author: String,
    img: String,
    date: Date,
    body: String,
    comments: [commentSchema]
})

var authSchema = new mongoose.Schema({
    aid: String,
    name: String,
    email: String
})

var thirdPartyAuthSchema = new mongoose.Schema({
    google:authSchema,
    facebook:authSchema,
    twitter:authSchema
})

var userSchema = new mongoose.Schema({
    username: String,
    salt: String,
    hash: String,
    auth: thirdPartyAuthSchema
})

var profileSchema = new mongoose.Schema({
    username: String,
    status: String,
    following: [String],
    email: String,
    zipcode: String,
    picture: String
})

// Add a getHash to the user document so we can call the function 
// to get the hash
userSchema.methods.getHash = function() {
    return this.hash;
}

// Create the models and exports them so that they are ready to be used
exports.Post = mongoose.model('posts', postSchema)
exports.User = mongoose.model('users', userSchema)
exports.Profile = mongoose.model('profiles', profileSchema)
