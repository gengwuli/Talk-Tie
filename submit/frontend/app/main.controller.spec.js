describe('MainController test', function() {
    var ctrl;
    var promises = []
    var api;

    beforeEach(module('app'))

    beforeEach(module(function($provide) {
        $provide.value('api', jasmine.helper.mockApiService)
    }))


    beforeEach(inject(function($controller, $rootScope, $q, _api_) {
        jasmine.helper.init($q)
            //substitute the original api with mocking api
        api = _api_;
        var scope = $rootScope.$new();
        ctrl = $controller('MainController', {
            'api': _api_,
            $scope: scope
        })
        ctrl._resolveTestPromises = function() {
            jasmine.helper.resolveTestPromises($rootScope)
        }
        ctrl._resolveTestPromises()
    }))

    it('should logout', inject(function(userService) {
        userService.username = "someone";
        expect(ctrl.getUsername()).toBe("someone");
        ctrl.logout();
        ctrl._resolveTestPromises()
            //There should be no username when logout
        expect(ctrl.getUsername()).not.toBeDefined();
        expect(userService.username).not.toBeDefined();
    }));
})
