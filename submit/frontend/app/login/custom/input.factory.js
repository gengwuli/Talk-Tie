//input factory containing date to generate the register form
(function() {
    angular
        .module('app')
        .factory('inputFactory', inputFactory);

    function inputFactory() {
        return {
            'name': new Input('text', 'Name:', 'name', 'name-validator', 'gl22'),
            'phone': new Input('tel', 'Phone:', 'phone', 'phone-validator', '1234567890'),
            'email': new Input('email', 'Email:', 'email', '', 'gengwuli@gmail.com'),
            'zipcode': new Input('text', 'Zip Code:', 'zipcode', 'zipcode-validator', '12345'),
            'birthday': new Input('date', 'Birthday:', 'birthday', '', ''),
            'password': new Input('password', 'Password:', 'password', '', ''),
            'repassword': new Input('password', 'Confirm password:', 'repassword', '', ''),
            'errorMessage': 'app/login/errors.template.html',
            'form': 'form'
        };
    }

    function Input(type, label, name, validation, placeholder) {
        this.type = type;
        this.label = label;
        this.name = name;
        this.validation = validation;
        this.placeholder = placeholder;
    }
})()
