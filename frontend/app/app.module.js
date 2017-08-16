(function() {
    'use strict';

    angular
        .module('app', ['ngRoute', 'ngMessages', 'ngResource', 'app.post', 'angular-inview'])
        .config(config)

    config.$inject = ['$routeProvider'];

    function config($routeProvider) {
        $routeProvider
            .when('/login', {
                templateUrl: 'app/login/login.html',
                controller: 'LoginController',
                controllerAs: 'vm'
            })
            .when('/main', {
                templateUrl: 'app/main.html',
                controller: 'MainController',
                controllerAs: 'vm'
            })
            .when('/profile', {
                templateUrl: 'app/profile/profile.html',
                controller: 'ProfileController',
                controllerAs: 'vm'
            })
            .otherwise({ redirectTo: '/login' })
    }

})()
