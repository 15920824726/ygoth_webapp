angular.module('evoa')
    .controller('EvoaPaymentCtrl', ['$scope', '$stateParams', '$state', 'Loader', '$http', '$rootScope', '$ionicHistory',
        function ($scope, $stateParams, $state, Loader, $http, $rootScope, $ionicHistory) {
            $scope.query = {
                visa_fee: 0,
                service_fee: 0,
                name: '',
                passport_no: '',
                arrived_at: ''
            };

            var url = 'https://www.ygoth.com/evoapi/v1/queries';

            Loader.showLoading('正在查询，请稍后...');

            queryPyament();

            function queryPyament () {
                $http.post(url, { queryId: $stateParams.orderid }).success(function (res) {
                    console.log('res', res);
                    if (res.data.status == 30) {
                        Loader.hideLoading();
                        $state.go('result', {
                            amount: res.data.visa_fee + res.data.service_fee,
                            appNo: res.data.app_no,
                            paymentNo: res.data.order_no,
                            endAt: res.data.end_at
                        });
                    } else {
                        var t = $timeout(function() {
                            queryPyament();
                            clearTimeout(t);
                        }, 1000)
                    }
                }).error(function (err) {
                    console.log('err', err);
 
                    Loader.noBgToast('查询失败', 2000);
                    $ionicHistory.goBack(-1);
                });
            }
        }
    ]);