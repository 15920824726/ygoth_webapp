angular.module('evoa')
    .controller('EvoaPaymentResultCtrl', ['$scope', '$stateParams', '$state', 'Loader', '$http', '$rootScope',
        function ($scope, $stateParams, $state, Loader, $http, $rootScope) {
            $scope.result = {
                amount: $stateParams.amount,
                app_no: $stateParams.appNo,
                payment_no: $stateParams.paymentNo,
                end_at: $stateParams.endAt
            };

            $scope.back = function () {
                $state.go('index');
            }
        }
    ]);