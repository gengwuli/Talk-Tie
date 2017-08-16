(function() {
    'use strict';

    angular
        .module('app.post')
        .controller('PostController', PostController)

    PostController.$inject = ['api', '$uibModal', 'userService', '$timeout'];

    function PostController(api, $uibModal, userService, $timeout) {
        var vm = this;
        vm.postPic;
        vm.posts = [];
        vm.showThumb = true;
        vm.addPost = addPost;
        vm.setFile = setFile;
        vm.goToPage = goToPage;
        vm.isAuthor = isAuthor;
        vm.loadPosts = loadPosts;
        vm.openModal = openModal;
        vm.addComment = addComment;
        vm.updatePost = updatePost;
        vm.getUsername = getUsername;
        vm.loadUsername = loadUsername;
        vm.updateComment = updateComment;
        vm.whichPage = 1;
        vm.firstPage = 1;
        vm.lastPage = Number.MAX_SAFE_INTEGER;

        function setFile(element) {
            vm.postPic = element.files[0];
        }
        vm.loadPosts();

        //popover template to be opened
        vm.popovertemplateUrl = { templateUrl: 'app/post/popover.template.html' };


        /**
         * Select which page to show
         * @param  {Integer} whichPage which page to show
         */
        function goToPage(whichPage) {
            if (whichPage == 0) {
                vm.pageInfo = "Already at first page!"
                vm.whichPage = 1
                $timeout(function() {
                    vm.pageInfo = ""
                }, 2000)
                return;
            }
            api.getPosts({ whichPage: vm.whichPage }).$promise.then(function(result) {
                if (result.posts.length == 0) {
                    vm.pageInfo = "No more posts!"
                    vm.whichPage--;
                    $timeout(function() {
                        vm.pageInfo = ""
                    }, 2000)
                }  else {
                    if(vm.whichPage==Number.MAX_SAFE_INTEGER) {
                        vm.whichPage = result.whichPage || 1;
                    }
                    vm.posts = result.posts;
                }
            })
        }

        /**
         * return logged-in username
         */
        function getUsername() {
            return userService.username;
        }

        /**
         * @param  {String} comment author
         * @return {Boolean} returns boolean whether a comment belongs to logged-in user
         */
        function isAuthor(author) {
            return author === vm.getUsername();
        }

        /**
         * @param  {Integer} indicating which posts to be updated
         * @param  {String} post body
         * @return 
         */
        function updatePost(index, content) {
            api.updatePost({ id: vm.posts[index].id, body: content })
                .$promise.then(function(result) {
                    vm.posts[index] = result.posts[0]
                });
        }

        /**
         * @param  {Object} indicating which post the comment belongs to
         * @param  {Integer} which comment in the post to edit
         * @param  {String} comment content
         * @return 
         */
        function updateComment(post, index, comment) {
            api.updatePost({ id: post.id, body: comment, commentId: post.comments[index].commentId })
                .$promise.then(function(result) {
                    post.comments = result.posts[0].comments;
                });
        }

        /**
         * @param {String} post body to add
         */
        function addPost(post_body) {
            api.addPost({ body: post_body, img: vm.postPic })
                .$promise.then(function(result) {
                    var post = result.posts[0];
                    createTitle(post);
                    vm.post_body = "";
                    vm.posts.unshift(post);
                });
        }

        /**
         * @param {String} comment to be added to post
         * @param {Object} whic post to add
         */
        function addComment(comment, post) {
            api.updatePost({ id: post.id, body: comment, commentId: -1 })
                .$promise.then(function(result) {
                    post.comments = result.posts[0].comments;
                });

        }

        /**
         * should be called every time the user refreshes the page
         */
        function loadUsername() {
            api.getStatus()
                .$promise.then(
                    function(result) {
                        userService.username = result.statuses[0].username;
                    })
        }

        /**
         * load all posts
         */
        function loadPosts() {
            api.getPosts()
                .$promise.then(
                    function(result) {
                        result.posts.forEach(function(post) {
                            createTitle(post)
                                //The date field must be transformed to a date object
                                //in order to be ordered.
                            post.date = new Date(post.date);
                            vm.posts.push(post);
                        })
                    })
        }

        /**
         * @param  {Object} add a title to post so it can display
         * @return 
         */
        function createTitle(post) {
            if (post.body == undefined) {
                post.title = ''
                post.body = ''
            } else {
                var s = post.body.split(' ');
                var title = [s[0], s[1], s[2], '...'].join(' ');
                post.title = title;
            }
        }

        /**
         * @param  {Integer} indicating which post to edit
         */
        function openModal(index) {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'app/post/modal.template.html',
                controller: 'ModalInstanceCtrl',
                resolve: {
                    post: function() { //post object passed to template
                        return vm.posts[index];
                    }
                }
            });
            // when user returns from the modal, resolve the post object which
            // was passed to the modal earlier
            modalInstance.result.then(function(result) {
                api.updatePost({ id: vm.posts[index].id, body: vm.posts[index].body })
                    .$promise.then(function(result) {
                        //update posts according to post object
                        //which might be updated in the modal
                        var post = vm.posts[index] = result.posts[0];
                        createTitle(post)
                            //The date field must be transformed to a date object
                            //in order to be ordered.
                        post.date = new Date(post.date);
                    });
            });
        }
    }
})()
