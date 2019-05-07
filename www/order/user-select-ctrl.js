angular.module('order')
    .controller('UserSelectCtrl', ['$scope', 'ServicesFactory', 'Loader', '$state', '$translate', '$rootScope', 'PayCodeFactory', 'QrcodesFactory', 'ScanOrderFactory',
        function($scope, ServicesFactory, Loader, $state, $translate, $rootScope, PayCodeFactory, QrcodesFactory, ScanOrderFactory) {
            $scope.translations = null;
            $translate([
                'CHINESE_ORDER',
                'PHONE_PAY',
                'LOAD_DATA_FAILED',
                'REGISTER_AND_PROMPT',
                'MENU_PAGE_PROMPT',
                'MENU_UNREGISTER_PAY',
                'PAYMENT_NOT_SUPPORTED'
            ]).then(function(data) {
                $scope.translations = data;
            }, function(translationIds) {
                $scope.translations = translationIds;
            });
            $scope.$on('$ionicView.beforeEnter', function() {
                $rootScope.hideTabs = 'tabs-item-hide'; //你的数据刷新方法
                if (ionic.Platform.isAndroid()) {
                    if (StatusBar && statusbarTransparent) {
                        statusbarTransparent.enable();
                        StatusBar.show();
                    }
                }
            });

            function Init() {
                Loader.toggleLoadingWithMessage('', 5000);
                var reCode = getQueryString()['code'];
                if (reCode) {
                    QrcodesFactory.getQrcode(reCode).success(function(data) {
                        //data.data.qrcode.service_id
                        /**
                         *  根据service id获取商家的基本信息
                         *  @params serviceId
                         *  @return data.data.service
                         **/
                        $scope.serviceId = data.data.qrcode.service_id;
                        $scope.positionId = data.data.qrcode.position;
                        ServicesFactory.getServiceDetail(data.data.qrcode.service_id).success(function(result) {
                            if (data.retCode === 0) {
                                $scope.merchant = result.data.service;
                            } else {
                                Loader.toggleLoadingWithMessage($translate.LOAD_DATA_FAILED);
                            }
                            Loader.hideLoading();
                        }).error(function(error) {
                            Loader.toggleLoadingWithMessage($translate.LOAD_DATA_FAILED);
                        });
                    }).error(function(error) {
                        Loader.toggleLoadingWithMessage($scope.translations.UNRECOGNIZE_QR_CODE);
                    });
                } else {
                    Loader.hideLoading();
                }

            }

            Init();

            /**
             *  用户选择跳转商家菜单
             *  @params serviceId
             *  @return
             **/
            $scope.menu = function(serviceId) {
                $state.go('order', {
                    serviceId: $scope.serviceId,
                    positionId: $scope.positionId
                });
            };

            function getQueryString() {
                var qs = window.location.search.substr(1), // 获取url中"?"符后的字串
                    args = {}, // 保存参数数据的对象
                    items = qs.length ? qs.split("&") : [], // 取得每一个参数项,
                    item = null,
                    len = items.length;

                for (var i = 0; i < len; i++) {
                    item = items[i].split("=");
                    var name = decodeURIComponent(item[0]),
                        value = decodeURIComponent(item[1]);
                    if (name) {
                        args[name] = value;
                    }
                }
                return args;
            }

            /**
             *  通过浏览器跳转到mPAY的公众号支付
             *  @params url, merchant id
             *  @return 支付结果页面
             **/
            $scope.payment = function(serviceId) {
                var params = {
                    merchant_id: $scope.merchant.merchant_id,
                    position_id: $scope.positionId
                }
                ScanOrderFactory.getOrderListCurrent(params).success(function(data) {
                    console.log(data);

                    if (data.data.orders.length > 0) {
                        var order = {
                            mpay_mid: data.data.orders[0].merchant.mpay_mid,
                            merchant_id: $scope.merchant.merchant_id,
                            total_price: data.data.orders[0].total_price,
                            total_quantity: data.data.orders[0].total_quantity,
                            position: data.data.orders[0].position,
                            products: data.data.orders[0].products,
                            order_number: data.data.orders[0].order_number,
                            created_at: data.data.orders[0].created_at
                        };
                        localStorage.setItem('orderItem', JSON.stringify(order));
                        $state.go('orderConfirmTel', {
                            data: order
                        });
                    } else {
                        if ($scope.merchant.mpay_mid != null && $scope.merchant.mpay_mid != "") {
                            var params = {
                                "merchant_id": $scope.merchant.merchant_id,
                                "payment": 40
                            };
                            PayCodeFactory.directPay(params).success(function(data) {
                                console.log(data);
                                PayCodeFactory.configureGetPayNo().success(function(pNum) {
                                    var pay_no = pNum.data.value;
                                    var param = {
                                        type: "static",
                                        mid: data.data.direct_pay.merchant.mid ? data.data.direct_pay.merchant.mid.toString() : "",
                                        ref_1: "ref1",
                                        ref_2: null
                                    };
                                    param[pay_no] = data.data.direct_pay.pay_no;
                                    var str = window.btoa(JSON.stringify(param));

                                    PayCodeFactory.configureMUrl().success(function(result) {
                                        var mPayUrl = result.data.value + '?data=' + str;
                                        window.location.href = mPayUrl;
                                    })
                                })

                            }).error(function(err) {
                                console.log(err);
                            })
                        } else {
                            Loader.toggleLoadingWithMessage($scope.translations.PAYMENT_NOT_SUPPORTED);
                        }
                    }

                }).error(function(error) {
                    console.log(error);
                })
            };
        }
    ]);