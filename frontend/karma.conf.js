module.exports = function(config) {
  config.set({
     basePath: '',
     frameworks: ['jasmine'],
     files: [
          'https://code.angularjs.org/1.5.0/angular.js',
          'https://code.angularjs.org/1.5.0/angular-mocks.js',
          'https://code.angularjs.org/1.5.0/angular-route.min.js',
          'https://code.angularjs.org/1.5.0/angular-messages.js',
          'https://code.angularjs.org/1.5.0/angular-resource.js',
          'https://code.angularjs.org/1.5.0/angular-animate.js',
          'https://cdnjs.cloudflare.com/ajax/libs/angular-ui-bootstrap/1.2.4/ui-bootstrap-tpls.js',
          'app/**/*.js'
     ],
     browsers: ['Chrome'],
     singleRun: false,
     autoWatch: true,
     reporters: ['progress', 'coverage'],
     preprocessors: { 'app/**/*.js': ['coverage'] }
  })
}
