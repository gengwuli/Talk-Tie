(function() {
    'use strict';
    /**
     * inject ngAnimate and ui.bootstrap to use modal and popover components
     * post module is big, so separate it in a independent module
     */
    angular
        .module('app.post', ['ngAnimate', 'ui.bootstrap']);
})();
