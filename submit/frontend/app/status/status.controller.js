(function() {
    'use strict';

    angular
        .module('app')
        .controller('StatusController', StatusController);

    StatusController.$inject = ['api', 'userService', '$scope'];

    function StatusController(api, userService, $scope) {
        var vm = this;
        vm.updateStatus = updateStatus;
        vm.loadStatus = loadStatus;
        vm.getUsername = getUsername;
        vm.username;
        loadAvatar();
        vm.loadStatus();

        /**
         * Load status from server
         */
        function loadStatus() {
            api.getStatus()
                .$promise.then(
                    function(result) {
                        vm.currentStatus = result.statuses[0].status
                        userService.username = result.statuses[0].username;
                        vm.username = userService.username;
                    })
        }

        /**
         * Load user profile picture from server
         */
        function loadAvatar() {
            api.getAvatar()
                .$promise.then(function(result) {
                    vm.avatar = result.pictures[0].picture;
                    userService.username = result.pictures[0].username;
                    vm.username = userService.username;
                })
        }

        /**
         * @param  {string} new status to update
         */
        function updateStatus(newStatus) {
            api.updateStatus({ status: newStatus })
                .$promise.then(function(result) {
                    vm.currentStatus = result.status;
                    vm.newStatus = "";
                });
        }

        /**
         * return username which is stored in userService
         * and is shared among controllers
         */
        function getUsername() {
            return userService.username;
        }
    }
})()
