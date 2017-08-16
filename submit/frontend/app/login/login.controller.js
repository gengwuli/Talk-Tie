(function() {
    angular
        .module('app')
        .controller('LoginController', LoginController);

    LoginController.$inject = ['$location', 'api', '$http', 'userService', '$timeout'];

    function LoginController($location, api, $http, userService, $timeout) {
        var vm = this;
        vm.login = login;
        vm.getUsername = getUsername;
        vm.register = register;

        /**
         * Register a new user, and prompt an alert on success
         */
        function register() {
            //Because of closure, you must store variable to a globally reachable variable
            //and then fetch it when you need it
            angular.name = vm.name;
            angular.password = vm.password
            api.register({ username: vm.name, email: vm.email, zipcode: vm.zipcode, password: vm.password })
                .$promise.then(function(result) {
                    vm.loginInfo = "Welcome " + result.username + "!"
                    $timeout(function() {
                        vm.login(angular.name, angular.password)
                    }, 1000)
                }, function(error) {
                    vm.loginInfo = error.data.result;
                    $timeout(function() {
                        vm.loginInfo = ""
                    }, 2000)
                })
        }

        /**
         * @param  {String} username
         * @param  {String} password
         * @return 
         */
        function login(username, password) {
            api.login({ username: username, password: password })
                .$promise.then(
                    function(result) {
                        userService.username = result.username;
                        $location.path('/main');
                    },
                    function(reason) { //warn user if login fails
                        alert('Wrong username or password');
                    })
        }

        /**
         * fetch username from userService
         */
        function getUsername() {
            return userService.username;
        }
    }
})();
