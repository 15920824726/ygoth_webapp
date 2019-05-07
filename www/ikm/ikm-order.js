angular.module('ikm')
    .controller('IkmOrderCtrl', ['$scope','$stateParams', function ($scope,$stateParams) {
        $scope.name = 'IkmOrderCtrl';

        $scope.showPay = false;

        $scope.data = $stateParams.data;
        
        $scope.confirm = function () {
            $scope.showPay = true;
        }

    }]);