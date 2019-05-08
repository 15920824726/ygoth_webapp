angular.module('evoa')
    .controller('EvoaDopayCtrl', ['$scope', '$stateParams', '$state', 'Loader', '$http', '$rootScope', '$ionicHistory',
        function ($scope, $stateParams, $state, Loader, $http, $rootScope, $ionicHistory) {
            $scope.query = {
                visa_fee: 0,
                service_fee: 0,
                name: '',
                passport_no: '',
                arrived_at: ''
            };

            var url = 'https://www.ygoth.com/evoapi/v1/queries';

            $http.post(url, { queryId: $stateParams.id }).success(function (res) {
                console.log('res', res);
                $scope.query.visa_fee = res.data.visa_fee;
                $scope.query.service_fee = res.data.service_fee;
                $scope.query.name = res.data.name;
                $scope.query.passport_no = res.data.passport_no;
                $scope.query.arrived_at = res.data.arrived_at;
                $scope.query.order_no = res.data.order_no;
                $scope.query.end_at = res.data.end_at;
                if (res.data.status == 30) {
                    $state.go('result', {
                        amount: res.data.visa_fee + res.data.service_fee,
                        appNo: res.data.app_no,
                        paymentNo: res.data.order_no,
                        endAt: res.data.end_at
                    });
                }
            }).error(function (err) {
                console.log('err', err);
                Loader.noBgToast('查询失败', 2000);
                $ionicHistory.goBack(-1);
            });

            $scope.makePayment = function() {
                var param = {
                    type: "inapp",
                    mid: '3000000000023566',
                    amount: ($scope.query.visa_fee + $scope.query.service_fee) * 100,
                    orderId: $scope.query.order_no,
                    ref_1: "ref1",
                    ref_2: null
                };
                var str = window.btoa(JSON.stringify(param));

                var mPayUrl = 'https://wechat-mpay.digio.co.th/wxpay?data=' + str;
                window.location.href = mPayUrl;
            };
        }
    ]);