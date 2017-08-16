/*
 * Test suite for posts.js
 */
var request = require('request')
var post = require('./posts.js')

function url(path) {
    return "http://localhost:3000" + path
}

describe('Validate Post Functionality', function() {

    it('should give me three or more posts', function(done) {
        // fill it in
        request(url("/posts"), function(err, res, body) {
            expect(res.statusCode).toBe(200);
            expect(JSON.parse(body).posts.length).not.toBeLessThan(3);
            done()
        })
    }, 200)

    it('should add a new post', function(done) {
        var payload = {
            body: "This is a new post"
        }
        var postLen;
        request(url("/posts"), function(err, res, body) {
            postLen = JSON.parse(body).posts.length;
            request({
                url: url('/post'),
                method: 'POST',
                json: payload
            }, function(err, res, body) {
                expect(res.statusCode).toBe(200);
                expect(body.posts[0].id).toBe(postLen + 1);
                expect(body.posts[0].body).toBe("This is a new post");
                request(url("/posts"), function(err, res, body) {
                    expect(JSON.parse(body).posts.length).toBe(postLen + 1);
                    done();
                })

            })
        })

    }, 200)
});
