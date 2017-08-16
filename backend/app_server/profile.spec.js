/*
 * Test suite for profile.js
 */
var request = require('request')
var post = require('./profile.js')

function url(path) {
    return "http://localhost:3000" + path
}

describe('Validate profile Functionality', function() {
	it("should update the status message", function(done) {
		request(url("/status"), function(err, res, body) {
			var oldStatus = JSON.parse(body).statuses[0].status;
			var newStatus;
			// Make sure that the old status is different from new status
			newStatus = oldStatus == "Happy"?"Not Happy":"Happy";
			var payload = {status:newStatus};
			request({
				url: url('/status'),
                    method: 'PUT',
                    json: payload},function(err, res, body) {
				expect(body.statuses[0].status).toBe(newStatus);
				expect(newStatus).not.toBe(oldStatus);
				done();
			});
		})
	}, 200)
})
