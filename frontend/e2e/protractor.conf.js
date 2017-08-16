exports.config = {
	allScriptsTimeout: 111000,
	specs: [ 'scenarios.js' ],
	capabilities: {
		'browserName': 'chrome',
        'chromeOptions': {
             'args': ['incognito', 'disable-extensions' ]
        }
	},
	
	directConnect: true,
	baseUrl: 'http://localhost:8080',

	framework: 'jasmine2',
	jasmineNodeOpts: {
        showColors: true,
		defaultTimeoutInterval: 30000
	},

    onPrepare: function() {
        var jr = require('jasmine-reporters')
        jasmine.getEnv().addReporter(new jr.JUnitXmlReporter({
             savePath: 'e2e-results'
        }))
        jasmine.getEnv().addReporter(new jr.TapReporter())
    }
}


