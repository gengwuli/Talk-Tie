(function() {
    'use strict';

    angular
        .module('app')
        .controller('ProfileController', ProfileController);

    ProfileController.$inject = ['api', 'userService', '$location', '$scope', '$timeout'];

    function ProfileController(api, userService, $location, $scope, $timeout) {
        var vm = this;
        vm.back = back;
        vm.update = update;
        vm.name = "";
        vm.email = "";
        vm.phone = "";
        vm.zipcode = "";
        vm.setFile = setFile;
        vm.merge = merge;
        vm.demerge = demerge;
        loadInfo();

        $scope.dynamicPopover = {
            mergeUrl: 'merge.html',
        };

        /**
         * Merge a third party account with existing account in the website
         * @param  {String} username username of the account
         * @param  {String} password password of the account
         */
        function merge(username, password) {
            api.merge({username:username, password:password})
                .$promise.then(function(result) {
                    vm.mergeInfo = result.result;
                    $timeout(function(){
                        vm.mergeInfo = ""
                    }, 3000)
                }, function(err) {
                    vm.mergeInfo = "Merge failed"
                    $timeout(function(){
                        vm.mergeInfo = ""
                    }, 3000)
                })
        }

        /**
         * Detach a third party account from the existing account
         */
        function demerge() {
            api.demerge({username:vm.name}).$promise.then(function(result) {
                vm.mergeInfo = result.result;
                $timeout(function(){
                        vm.mergeInfo = ""
                    }, 3000)
            }, function(err) {
                vm.mergeInfo = "Part failed"
                $timeout(function(){
                        vm.mergeInfo = ""
                    }, 3000)
            })
        }

        /**
         * Upload the user profile picture
         * @param {Object} element the file input Object
         */
        function setFile(element) {
            api.upload({ 'img': element.files[0] })
                .$promise.then(function(result) {
                    vm.avatar = result.picture;
                })
        }

        /**
         * Load user profile
         */
        function loadInfo() {
            loadAvatar()
            api.getEmail()
                .$promise.then(function(result) {
                    vm.nameInfo = result.username;
                    vm.emailInfo = result.email;
                    vm.email = vm.emailInfo;
                    vm.name = vm.nameInfo;
                })
            api.getZipcode()
                .$promise.then(function(result) {
                    vm.zipcodeInfo = result.zipcode;
                    vm.zipcode = vm.zipcodeInfo;
                })

            //find whether a user is logged in through third party
            api.getLink()
                .$promise.then(function(result) {
                    if(result.link === '') {
                        vm.isLinkAvailable = false;
                    } else if(result.link === 'facebook' || result.link === 'twitter' || result.link === 'google') {
                        vm.isLinkAvailable = true;
                    }
                })
        }

        /**
         * Redirect user to the main page
         */
        function back() {
            $location.path('/main');
        }

        /**
         * Update user profile
         */
        function update() {
            if (vm.email) {
                api.updateEmail({ email: vm.email })
                    .$promise.then(function(result) {
                        vm.emailInfo = result.email;
                    })
            }

            if (vm.zipcode) {
                api.updateZipcode({ zipcode: vm.zipcode })
                    .$promise.then(function(result) {
                        vm.zipcodeInfo = result.zipcode;
                    })
            }
            if (vm.password) {
                api.updatePassword({ password: vm.password })
                    .$promise.then(function(result) {
                        vm.passwordstatus = result.status;
                    })
            }
            vm.nameInfo = vm.name;
        }

        /**
         * Load user profile picture
         */
        function loadAvatar() {
            api.getAvatar()
                .$promise.then(function(result) {
                    vm.avatar = result.pictures[0].picture;
                    userService.username = result.pictures[0].username;
                    vm.username = userService.username;
                })
        }

    }
})()
