angular.module('ikm')
    .controller('IkmPayRealCtrl', ['$scope', '$translate', '$state', 'Loader', 'ikmCard', '$http', '$rootScope','$stateParams',
        function ($scope, $translate, $state, Loader, pguinCard, $http, $rootScope,$stateParams) {
            $scope.name = 'IkmOrderCtrl';

            $scope.showPay = false;

            $scope.orderData = $stateParams.data;

            $scope.confirm = function () {
                $scope.showPay = true;
                document.getElementsByTagName('title')[0].innerHTML = '充值结果';
            }

            /*
                 1. 已充值的电话号码，存储在本地，首先本地读取电话号码
                 2. 读取CODE 获取openID
                 3. 设置微信公总号配置，获取微信支付授权
             */
            $scope.$on('$ionicView.beforeEnter', function (e) {

            });

            /*
                ----设置标题-----
             */
            $scope.$on('$ionicView.enter', function (e) {
                document.getElementsByTagName('title')[0].innerHTML = '印尼话费充值';
            });
        }
    ]);