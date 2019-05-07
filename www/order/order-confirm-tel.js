angular.module('order')
    .controller('OrderConfirmTelCtrl', ['$scope', 'ScanOrderFactory', '$state', 'Loader', '$stateParams', '$translate', 'ServerConfiguration', '$ionicHistory',
        function($scope, ScanOrderFactory, $state, Loader, $stateParams, $translate, ServerConfiguration, $ionicHistory) {

            $translate([
                'ORDER_FOOD_GO',
                'OK',
                'CONFIRM_ORDER',
                'CONFIRM',
                'SUBMIT',
                "NOW_PAY",
                "PAY_ORDER",
                "ORDER_NUMBER",
                "ORDER_TIME",
                "ORDER_DESKTOP",
                "CHECK_AFTER_PAY",
                "INSTALL_APP",
                "DOWNLOAD_SHARE_TRANSLATE",
                "PAY",
                "ALL_ORDER",
                "ONE_COLUMN",
                "TWO_COLUMNS",
                "PAYMENT_NOT_SUPPORTED2"
            ]).then(function(data) {
                $scope.translations = data;
            }, function(translationIds) {
                $scope.translations = translationIds;
            });

            $scope.base = ServerConfiguration.baseApiUrl;
            $scope.imageSrc = $scope.base + '/icons/ad1@2x.png';

            $scope.goFirstpage = function() {
                $state.go('UserSelect');
            };

            $scope.downlad = function() {
                window.location.href = "http://android.myapp.com/myapp/detail.htm?apkName=com.ygoworld.ygoth";
            }

            $scope.makeOrder = function() {
                var products = [];
                for (i = 0; i < $scope.orderItems.length; i++) {
                    products.push($scope.orderItems[i]);
                }

                var order = {
                    merchant_id: $scope.merchant.id,
                    total_price: $scope.totalPrice,
                    total_quantity: $scope.totalNumber,
                    products: products
                };

                ScanOrderFactory.setOrderList(order).success(function(data) {
                    if (data.retCode === 0) {
                        $scope.orderId = data.data.order.order_number;
                        var message = {
                            merchant_id: $scope.merchant.id,
                            product_id: 'ygoth',
                            content: $scope.translations.GOT_ORDER_PROMPT
                        };
                        ScanOrderFactory.pushNewOrderMessage(message);
                        $state.go("order-complete", {
                            orderId: $scope.orderId,
                            serviceId: $stateParams.serviceId,
                            categoryId: $stateParams.categoryId,
                            cityId: $stateParams.cityId
                        });
                    } else {
                        Loader.toggleLoadingWithMessage($scope.translations.CHOOSE_ITEM_PROMPT, 2000);
                    }
                });
            };

            $scope.goResult = function() {
                if ($scope.mpay_mid != null && $scope.mpay_mid != "") {
                    var type = {
                        "type": "inapp",
                        "mid": $scope.mpay_mid ? $scope.mpay_mid.toString() : '',
                        "amount": $scope.total_price ? $scope.total_price.toString() : '',
                        "orderId": $scope.order_number ? $scope.order_number.toString() : '',
                        "ref_1": null,
                        "ref_2": null
                    };
                    var str = window.btoa(JSON.stringify(type));
                    var finitialAddress = "https://wechat-mpay.digio.co.th/wxpay?data=" + str;
                    window.location.href = finitialAddress;
                } else {
                    Loader.toggleLoadingWithMessage($scope.translations.PAYMENT_NOT_SUPPORTED2);
                }
            };

            function Init() {
                try {
                    var data = JSON.parse(localStorage.getItem('orderItem'));
                    $scope.total_price = data.total_price;
                    $scope.total_quantity = data.total_quantity;
                    $scope.products = data.products;
                    $scope.mpay_mid = data.mpay_mid;
                    $scope.order_number = data.order_number;
                    $scope.position = data.position;
                    $scope.created_at = data.created_at;
                } catch (err) {
                    $ionicHistory.goBack(-1);
                }
            }

            Init();

        }
    ])