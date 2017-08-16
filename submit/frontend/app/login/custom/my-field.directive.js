//Optional testing of custom directives
(function() {
    angular
        .module('app')
        .directive('myField', myField);

    myField.$inject = ['inputFactory'];

    function myField(inputFactory) {
        var directive = {
            restrict: 'E',
            template: function(element, attribute) {
                var item = inputFactory[attribute.name];
                var compareTo = '';
                if (attribute.name === 'repassword') {
                    compareTo = ' ng-pattern="vm.password" '
                }
                var template = '<label>' + item.label + '</label>' +
                    '<input type="' + item.type + '" ng-model="' + attribute.model +
                    '" name="' + item.name + '" placeholder="' + item.placeholder +
                    '" ' + item.validation + compareTo + ' required class="form-control"/><div class="errors" ng-if="' +
                    inputFactory['form'] + '.' + item.name + '.$dirty" ng-messages="' + inputFactory['form'] +
                    '.' + item.name + '.$error"' + '>' + '<div ng-messages-include="' + inputFactory['errorMessage'] +
                    '"></div></div>';
                return template;
            }
        };
        return directive;
    }
})()
