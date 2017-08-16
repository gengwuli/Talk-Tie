(function() {
    angular
        .module('app')
        .directive('nameValidator', nameValidator);

    function nameValidator() {
        var directive = {
            restrict: 'A',
            require: 'ngModel',
            link: linkFcn
        };

        return directive;
    }
    
    /**
     * @param  {Object} scope object associate with this directive
     * @param  {Object}  represent this directive
     * @param  {Object}  attributes
     * @param  {Object}  controller if required, specify as require: '<controller>'
     * @return {Boolean} return boolean indicating whether user input matches format
     */
    function linkFcn(scope, element, attrs, ctrl) {
        ctrl.$validators.nameValidator = function(modelValue, viewValue) {
            var value = modelValue || viewValue;
            return /^[a-zA-Z][a-zA-Z0-9]{1,9}$/.test(value);
        }
    }
})()
