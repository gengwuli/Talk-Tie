(function() {
    'use strict';

    angular
        .module('app')
        .controller('MainController', MainController);


    MainController.$inject = ['userService', '$scope', 'api', '$location', '$window']

    function MainController(userService, $scope, api, $location, $window) {
        var vm = this;
        vm.logout = logout;
        vm.getUsername = getUsername;
        vm.inview = inview

        /**
         * This is to change the view when one element is out of view
         * @param  {Boolean} inview determines whether that element is in view or not
         * @return {[type]}        [description]
         */
        function inview(inview) {
            vm.showSideBar = inview;
            if($window.innerWidth < 800) {
                vm.styleLeft={}
                vm.styleRight={}
                vm.styleWrapper={}
                return;
            }
            if(!inview) {
                vm.styleRight = {'margin-left': '-20%'}
            } else {
                vm.styleRight = {}
            }
        }

        /**
         * Log user out
         */
        function logout() {
            userService.username = undefined;
            api.logout();
            $location.path('/login');
        }

        /**
         * Get logged in user from user service
         */
        function getUsername() {
            return userService.username;
        }
    }
})()
