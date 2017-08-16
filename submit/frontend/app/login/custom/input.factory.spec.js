//Optional testing of input factory
describe('inputFactory Tests', function() {
    beforeEach(module('app'))
    beforeEach(inject(function(_inputFactory_) {
        inputs = _inputFactory_;
    }))
    it('check form field', function() {
        expect(inputs['form']).toEqual('form');
    })

    it('check errorMessage field', function() {
        expect(inputs['errorMessage']).toEqual('app/templates/errors.html');
    })

    it('check name', function() {
        var name = inputs['name'];
        expect(name.type).toEqual('text');
        expect(name.label).toEqual('Name:');
        expect(name.name).toEqual('name');
        expect(name.validation).toEqual('name-validator');
        expect(name.placeholder).toEqual('gl22');
    })

    it('check phone', function() {
        var name = inputs['phone'];
        expect(name.type).toEqual('tel');
        expect(name.label).toEqual('Phone:');
        expect(name.name).toEqual('phone');
        expect(name.validation).toEqual('phone-validator');
        expect(name.placeholder).toEqual('1234567890');
    })

    it('check email', function() {
        var name = inputs['email'];
        expect(name.type).toEqual('email');
        expect(name.label).toEqual('Email:');
        expect(name.name).toEqual('email');
        expect(name.validation).toEqual('');
        expect(name.placeholder).toEqual('eg@eg.com');
    })

    it('check zipcode', function() {
        var name = inputs['zipcode'];
        expect(name.type).toEqual('text');
        expect(name.label).toEqual('Zip Code:');
        expect(name.name).toEqual('zipcode');
        expect(name.validation).toEqual('zipcode-validator');
        expect(name.placeholder).toEqual('12345');
    })

    it('check password', function() {
        var name = inputs['password'];
        expect(name.type).toEqual('password');
        expect(name.label).toEqual('Password:');
        expect(name.name).toEqual('password');
        expect(name.validation).toEqual('');
        expect(name.placeholder).toEqual('');
    })

    it('check repassword', function() {
        var name = inputs['repassword'];
        expect(name.type).toEqual('password');
        expect(name.label).toEqual('Confirm password:');
        expect(name.name).toEqual('repassword');
        expect(name.validation).toEqual('');
        expect(name.placeholder).toEqual('');
    })
})
