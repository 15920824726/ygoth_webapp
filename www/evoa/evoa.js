angular.module('evoa')
    .controller('EvoaIndexCtrl', ['$scope', '$translate', '$state', 'Loader', '$http', '$rootScope',
        function ($scope, $translate, $state, Loader, $http, $rootScope) {
            $scope.translations = null;
            $translate([
                'PAY_YOUR_ORDER'
            ]).then(function(data) {
                $scope.translations = data;
            }, function(translationIds) {
                $scope.translations = translationIds;
            });

            var query = {
                passport_no: ''
            };

            $scope.query = function () {
                if (query.passport_no !== '') {
                    $state.go('payment', { passport_no: query.passport_no });
                }
            }
        }
    ]);