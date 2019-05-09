angular.module('ikm')
    .controller('IkmResultCtrl', ['$scope', '$translate', '$stateParams', 'IkmFactory', '$timeout', '$state', 'Loader',
        function ($scope, $translate, $stateParams, IkmFactory, $timeout, $state, Loader) {

            document.getElementsByTagName('title')[0].innerHTML = '充值结果';

            $scope.operator_id = $stateParams.operator_id;

            $scope.refill_no = $stateParams.refill_no;
            $scope.showWait = true;
            $scope.showSuccess = false;
            $scope.orderData = '';

            // 处理时间 转化为年月日 时分秒
            function processTime(time) {
                var date = new Date(time);
                var month = processBit(String(parseInt(date.getMonth()) + 1));
                var dd = processBit(date.getDate().toString());
                var hh = processBit(date.getHours().toString());
                var mm = processBit(date.getMinutes().toString());
                var ss = processBit(date.getSeconds().toString());
                var timeStr = date.getFullYear() + '-' + month + '-' + dd + ' ' + hh + ':' + mm + ':' + ss;
                return timeStr;
            }

            // 处理位数 ，如果1位，前面补0
            function processBit(value) {
                if (value.length == 1) {
                    return value = '0' + value;
                }
                return value;

            }

            Init();

            function Init() {
                Loader.showLoading('正在查询充值结果，请稍后!');
                $timeout(function () {
                    IkmFactory.getIkmOrder($stateParams.refill_no).success(function (data) {
                        Loader.hideLoading();
                        $scope.orderData = data.data;
                        $scope.orderData.operator_id = $stateParams.operator_id;
                        $scope.orderData.created_at = processTime($scope.orderData.created_at);
                        if (data.data.status == 20) {
                            $scope.showWait = false;
                            $scope.showSuccess = true;
                        } else {
                            $scope.showWait = false;
                            $scope.showSuccess = false;
                        }
                    }).error(function (err) {
                        Loader.hideLoading();
                        $scope.showWait = false;
                        $scope.showSuccess = false;
                    });
                }, 6000);
            }

            $scope.retry = function () {
                $state.go('ikmPay');
            }
        }

    ]);