angular.module('payment')
    .controller('PaymentCtrl', ['$scope', '$translate', '$state', 'Loader', 'PaymentFactory', '$http', '$rootScope',
        function($scope, $translate, $state, Loader, PaymentFactory, $http, $rootScope) {
            $scope.translations = null;
            $translate([
                'PAY_EXPECT',
                'TOPUP_NUMBER',
                'SELECT_MONEY',
                'INTRODUCTION',
                'VALUEED_TIME',
                'FLOW',
                'RATE',
                'PROCESSING_DIAN',
                'WAITING_CONSTANT',
                'PENGUIN_NUMBER',
                'PENGUIN_CHARGE_TIME'
            ]).then(function(data) {
                $scope.translations = data;
            }, function(translationIds) {
                $scope.translations = translationIds;
            });

            var uid = getUrlUid();

            if (uid != '') {
                PaymentFactory.getMerchant(uid).success(function(res) {
                    if (res.retCode === 0) {
                        var merchant_id = res.data.merchant.id;
                        var mpay_mid = res.data.merchant.mpay_mid;
                        var bluepay_mid = res.data.merchant.bluepay_mid;
                        
                    } else {
                        Loader.toggleLoadingWithMessage('找不到商家！');
                    }
                }).error(function(err) {
                    Loader.toggleLoadingWithMessage('出错了，请稍后再试！');
                });
            } else {
                Loader.toggleLoadingWithMessage('不能识别二维码！');
            }

            function getUrlUid() {
                var url = window.location;
                var uid = '';
                index1 = url.indexOf('p/');
                index2 = url.indexOf('?');
                if (index1 != -1) {
                    if (index2 != -1) {
                        uid = url.substr(index1 + 2, index2 - (index1 + 2));
                    } else {
                        uid = url.substr(index1 + 2);
                    }
                }
                return uid;
            };
        }
    ]);