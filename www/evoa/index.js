angular.module('evoa')
    .controller('EvoaIndexCtrl', ['$scope', '$translate', '$state', 'Loader', '$http', '$rootScope',
        function ($scope, $translate, $state, Loader, $http, $rootScope) {
            $scope.translations = null;
            $translate([
                'PAY_YOUR_ORDER'
            ]).then(function (data) {
                $scope.translations = data;
            }, function (translationIds) {
                $scope.translations = translationIds;
            });

            $scope.query = {
                app_no: '',
                passport_no: ''
            };

            $scope.goQuery = function () {
                var url = 'https://www.ygoth.com/evoapi/v1/queries';

                if ($scope.query.passport_no !== '') {
                    $http.post(url, { queryId: $scope.query.passport_no }).success(function (res) {
                        $state.go('dopay', { id: $scope.query.passport_no });
                    }).error(function (err) {
                        Loader.noBgToast('查询失败，请确认输入是否正确！', 1000);
                    });
                } else if ($scope.query.app_no !== '') {
                    $http.post(url, { queryId: $scope.query.app_no }).success(function (res) {
                        $state.go('dopay', { id: $scope.query.app_no });
                    }).error(function (err) {
                        Loader.noBgToast('查询失败，请确认输入是否正确！', 1000);
                    });
                } else {
                    Loader.noBgToast('输入不能为空', 1000);
                }

            }
        }
    ]);