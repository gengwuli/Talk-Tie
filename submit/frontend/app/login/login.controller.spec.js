describe('LoginController test', function() {
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
        ctrl = $controller('LoginController', {
            'api': _api_
        })
        ctrl._resolveTestPromises = function() {
            jasmine.helper.resolveTestPromises($rootScope)
        }
        ctrl._resolveTestPromises()
        spyOn(api, 'login').and.callThrough();
    }))

    it('should login if both user and password are right', function() {
        //Before login in, the username should not be set
        expect(ctrl.username).not.toBeDefined();
        //Right username and password combination
        ctrl.login('user', '1234')
        ctrl._resolveTestPromises()
        //After login, the mock login function should be called
        expect(api.login).toHaveBeenCalled()
        //And we get the username returned from the mocking server
        expect(ctrl.getUsername()).toEqual('user')
    })

    it('should not login if user or password is wrong', function() {
        //Before login in, the username should not be set
        expect(ctrl.username).not.toBeDefined();
        //Wrong combination
        ctrl.login('user', '123')
        ctrl._resolveTestPromises()
        //After login, the mock login function should be called
        expect(api.login).toHaveBeenCalled()
        //And we get the username returned from the mocking server
        expect(ctrl.getUsername()).not.toBeDefined()
    })

})
