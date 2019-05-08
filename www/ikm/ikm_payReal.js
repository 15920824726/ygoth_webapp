angular.module('ikm')
    .controller('IkmPayRealCtrl', ['$scope', '$translate', '$state', 'Loader', 'ikmCard', '$http', '$rootScope','$stateParams',
        function ($scope, $translate, $state, Loader, pguinCard, $http, $rootScope,$stateParams) {
            $scope.name = 'IkmOrderCtrl';

            $scope.showPay = false;

            $scope.orderData = $stateParams.data;

            $scope.confirm = function () {
                $scope.showPay = true;
            }
        }
    ]);