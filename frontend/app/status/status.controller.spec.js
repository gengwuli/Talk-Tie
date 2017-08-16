describe('StatusController test', function() {
    var ctrl;
    var api;

    beforeEach(module('app'))

    beforeEach(module(function($provide) {
        $provide.value('api', jasmine.helper.mockApiService);
    }))

    beforeEach(inject(function($controller, $rootScope, $q, _api_, userService) {
        jasmine.helper.init($q);
        var scope = $rootScope.$new();
        //substitute the original api with mocking api
        api = _api_;
        ctrl = $controller('StatusController', {
            'api': _api_,
            $scope: scope,
            'userService': userService
        });
        ctrl._resolveTestPromises = function() {
            jasmine.helper.resolveTestPromises($rootScope)
        }
        ctrl._resolveTestPromises();
    }))

    it('should update status', inject(function(api) {
        var newStatus = 'new status';
        ctrl.updateStatus(newStatus);
        ctrl._resolveTestPromises();
        expect(ctrl.currentStatus).toEqual(newStatus);
    }))

    it('should share the username between post controller and status controller', inject(function($controller, userService) {
        //optional, assign a value to userService
        userService.username='hello'
        //instantiate a post controller
        var postCtrl = $controller('PostController', { userService})
        expect(ctrl.getUsername()).toBe(postCtrl.getUsername()) 
    }))
})
