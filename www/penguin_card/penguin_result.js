angular.module('penguin')
    .controller('PenguinResultCtrl', ['$scope', '$translate', '$stateParams', 'pguinCard', '$timeout', '$state', 'Loader',
        function ($scope, $translate, $stateParams, pguinCard, $timeout, $state, Loader) {
            $scope.translations = null;
            $translate([
                'ORDER_NUMBER',
                'TOPUP_NUMBER',
                'TOPUP_SUCCESS',
                'TOPUP_TIME',
                'WECHAT_ORDER_NUMBER',
                'TOPUP_FAIL'
            ]).then(function (data) {
                $scope.translations = data;
            }, function (translationIds) {
                $scope.translations = translationIds;
            });

            // $scope.showuSuccess = true;
            // $scope.$on('$ionicView.beforeEnter', function () {
            //     if ($stateParams.session_id == 0) {
            //         $scope.showuSuccess = false;
            //     }
            // });

            $scope.showCtrl = false;
            document.getElementsByTagName('title')[0].innerHTML = '充值结果';

            // 处理时间 转化为年月日 时分秒
            function processTime(time) {
                var date = new Date(time);
                var month = processBit(String(parseInt(date.getMonth()) + 1));
                var dd = processBit(date.getDate().toString());
                var hh = processBit(date.getHours().toString());
                var mm = processBit(date.getMinutes().toString());
                var ss = processBit(date.getSeconds().toString());
                var timeStr = date.getFullYear() + '-' + month + '-' + dd + ' ' + hh + ':' + mm + ':' + ss;
                $scope.orderTime = timeStr;
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
                    $scope.showCtrl = true;
                    pguinCard.getPguninOrder($stateParams.session_id).success(function (data) {
                        Loader.hideLoading();
                        if (data.data.status != 20) {
                            $scope.showuSuccess = false;
                            $timeout(function () {
                                $state.go('penguinPay');
                            }, 3000);
                            return;
                        } else {
                            $scope.showuSuccess = true;
                            $scope.orders = data.data;
                            processTime(data.data.created_at);
                        }
                    }).error(function (err) {
                        Loader.hideLoading();
                        console.log(err);
                    });
                }, 5000);
            }
        }

    ]);