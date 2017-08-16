(function() {
    angular
        .module('app')
        .controller('FollowController', FollowController);

    FollowController.$inject = ['api', '$timeout']

    function FollowController(api, $timeout) {
        var vm = this;
        vm.loadFollowing = loadFollowing;
        vm.unfollow = unfollow;
        vm.addFollower = addFollower;
        vm.followers = [];
        vm.loadFollowing();

        /**
         * Unfollow a user, delete it from the database and update the view
         */
        function unfollow(follower) {
            api.unfollow({ user: follower.username })
                .$promise.then(function(result) {
                    vm.followers.forEach(function(follower, index) {
                        var found = false;
                        result.following.forEach(function(username) {
                            if (username == follower.username) {
                                found = true;
                            }
                        })
                        if (!found) {
                            vm.followers.splice(index, 1);
                        }
                    })
                })
        }

        /**
         * Add a new follower
         */
        function addFollower(newFollower) {
            var exist = false;
            vm.followers.forEach(function(follower) {
                if (follower.username == newFollower) {
                    vm.followError = "Already followed!"
                    $timeout(function() {
                        vm.followError = ""
                    }, 3000)
                    vm.newFollower = ""
                    exist = true;
                }
            })
            if (exist) {
                return;
            }
            api.addFollower({ user: newFollower })
                .$promise.then(function(result) {
                    var users = "";
                    var found = false;
                    result.following.forEach(function(username) {
                        if (username == newFollower) {
                            vm.followers.push({ username: newFollower });
                            getStatuses(newFollower, vm.followers);
                            getPictures(newFollower, vm.followers);
                            found = true;
                        }
                    })
                    if (!found) {
                        vm.followError = "Follower doesn't exist!"
                        $timeout(function() {
                            vm.followError = ""
                        }, 3000)
                    }
                    vm.newFollower = ""
                })
        }

        /**
         * Load followers from the server
         */
        function loadFollowing() {
            api.getFollowers()
                .$promise.then(function(result) {
                    vm.followers = []
                    var users = "";
                    result.following.forEach(function(username, index) {
                        users = users + username + ","
                        vm.followers.push({ username: username });
                    })
                    getStatuses(users, vm.followers);
                    getPictures(users, vm.followers);

                })
        }

        /**
         * Get multiple statuses from multiple users
         * @param  {String} users    user whose status are to be queried
         * @param  {Object} follower follower object to be added with the returned status
         */
        function getStatuses(users, follower) {
            api.getStatuses({ user: users })
                .$promise.then(function(result) {
                    result.statuses.forEach(function(status) {
                        follower.findIndex(function(element, index, array) {
                            if (status.username == element.username) {
                                element.status = status.status;
                            }
                        })
                    })
                })
        }

        /**
         * Get multiple pictures from their relative users
         * @param  {String} users    user whose picture are to be get
         * @param  {Object} follower follower object to be added with returned picture
         */
        function getPictures(users, follower) {
            api.getPictures({ user: users })
                .$promise.then(function(result) {
                    result.pictures.forEach(function(picture) {
                        follower.findIndex(function(element, index, array) {
                            if (picture.username == element.username) {
                                element.picture = picture.picture;
                            }
                        })
                    })
                })
        }
    }

})()
