//Optional testing of custom directives
(function() {
    angular
        .module('app')
        .directive('myForm', myForm);

    myForm.$inject = ['inputFactory'];

    function myForm(inputFactory) {
        var directive = {
            transclude: true,
            replace: true,
            template: function(element, attribute) {
                inputFactory.form = attribute.name;
                return '<form name=' + attribute.name + '><ng-transclude></ng-transclude></form>';
            },
            restrict: 'E'
        };
        return directive;
    }
})()
