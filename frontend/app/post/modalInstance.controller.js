(function() {
    'use strict';

    angular
        .module('app.post')
        .controller('ModalInstanceCtrl', ModalInstanceCtrl);

    /**
     * post was generated in the resolve object
     * any changes to post will be eventually resolved
     */
    ModalInstanceCtrl.$inject = ['$scope', '$uibModalInstance', 'post'];

    function ModalInstanceCtrl($scope, $uibModalInstance, post) {
        $scope.post = post;
        $scope.ok = function() {
            var s = title = $scope.post.body.split(' ');
            var title = [s[0], s[1], s[2], '...'].join(' ');
            $scope.post.title = title;
            $uibModalInstance.close($scope.post);
        };
    }
})();
