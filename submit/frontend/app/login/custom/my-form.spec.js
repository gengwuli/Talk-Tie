//Optional testing of custom directives
describe('Directive my-form Test', function() {
    var element, scope, inputs;

    beforeEach(module('app'))
    beforeEach(inject(function(_inputFactory_) {
        inputs = _inputFactory_;
    }))
    beforeEach(inject(function($compile, $rootScope) {
        scope = $rootScope.$new();
        element = $compile('<my-form name="loginForm"></my-form>')(scope);
    }));

    it('set form name field', function() {
        expect(inputs['form']).toEqual('loginForm');
    });
})
