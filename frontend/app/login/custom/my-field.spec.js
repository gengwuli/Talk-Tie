//Optional testing of custom directives
describe('Directive my-field Test', function() {
    var element, scope, inputs;
    beforeEach(module('app'))

    beforeEach(inject(function(_inputFactory_) {
        inputs = _inputFactory_;
    }))
    beforeEach(inject(function($compile, $rootScope) {
        scope = $rootScope.$new();
        element = $compile("<my-field name='name' model= 'vm.name'></my-field>")(scope);
    }));

    it('test label', function() {
        scope.$digest();
        expect(element.find('label').text()).toEqual(inputs['name'].label);
    });

    it('test model', function() {
        expect(element.find("input").attr('ng-model')).toEqual('vm.name')
    });

    it('test type', function() {
        expect(element.find('input').attr('type')).toEqual(inputs['name'].type);
    });

    it('test name', function() {
        expect(element.find('input').attr('name')).toEqual(inputs['name'].name);
    });

    it('test placeholder', function() {
        expect(element.find('input').attr('placeholder')).toEqual(inputs['name'].placeholder);
    });

    it('test validation', function() {
        expect(element.html()).toContain(inputs['name'].validation);
    });

    it('test form field', function() {
        expect(element.html()).toContain(inputs.form);
    });
})
