describe('PostController test', function() {
    var ctrl;
    var api;

    beforeEach(module('app'))
    beforeEach(module('app.post'))

    beforeEach(module(function($provide) {
        $provide.value('api', jasmine.helper.mockApiService)
    }))

    //substitute the original api with mocking api
    beforeEach(inject(function($controller, $rootScope, $q, _api_) {
        jasmine.helper.init($q)
        api = _api_;
        var scope = $rootScope.$new();
        ctrl = $controller('PostController', {
            'api': _api_,
            $scope: scope
        })
        ctrl._resolveTestPromises = function() {
            jasmine.helper.resolveTestPromises($rootScope)
        }
        ctrl._resolveTestPromises()
    }))

    it('should add a post', function() {
        //When loading, controller  will load one default post from the mocking server
        expect(ctrl.posts.length).toBe(1)
        var newPost = "new Post"
        ctrl.addPost(newPost)
        ctrl._resolveTestPromises()
        expect(ctrl.posts.length).toBe(2)
    })

    it('should edit a post', function() {
        //Choose the first post in the controller and update it
        ctrl.updatePost(0, "edit a post");
        ctrl._resolveTestPromises()
        //check the post content has been modified
        expect(ctrl.posts[0].body).toBe("edit a post")
    })

    it('should comment a post and edit that comment', function() {
        //By default, the mocking server will provide one default comment
        expect(ctrl.posts[0].comments.length).toBe(1)
        //Create a comment
        var comment = "a comment"
        //Add the comment to the first post
        ctrl.addComment(comment, ctrl.posts[0])
        //Update the post according to its index
        ctrl._resolveTestPromises()
        //Check whether the comment has been added
        expect(ctrl.posts[0].comments.length).toBe(2)
        expect(ctrl.posts[0].comments[1].body).toBe("a comment")
        //Now edit the added comment
        ctrl.updateComment(ctrl.posts[0], 1, "update comment")
        expect(ctrl.posts[0].comments[1].body).toBe("update comment")
    })


})
