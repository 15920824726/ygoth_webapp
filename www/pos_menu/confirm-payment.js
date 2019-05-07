angular.module('posMenu')
    .controller('ConfirmPaymentCtrl', ['$scope', '$state', 'Loader', '$stateParams', '$translate', 'IposFactory', 'Socket', 'ScanOrderFactory', 'PayCodeFactory',
        function($scope, $state, Loader, $stateParams, $translate, IposFactory, Socket, ScanOrderFactory, PayCodeFactory) {
            $scope.order_number = '';
            $scope.created_at = null;
            // 接收从点餐页传入的点单数据
            $scope.orderData = $stateParams.data;
            console.log('接收从点餐页传入的点单数据', $scope.orderData);
            var merchant_id = 3076;
            var mid = '3000000000024152'; //'3000000000023566';
            var tid = '10001'; //terminal id pos终端
            language();
            createOrder();


            // 去支付
            $scope.makePayment = function() {
                var printData = {
                    product: $scope.orderData.products[0],
                    tid: tid,
                    orderId: $scope.order_number
                };
                console.log('printData', printData);
                Socket.emit('print_voucher', printData, function(res) {
                    Loader.hideLoading();
                    console.log('print_voucher', res);
                });
                var type = {
                    type: "inapp",
                    mid: mid,
                    amount: $scope.orderData.total_price,
                    orderId: $scope.order_number,
                    ref_1: null,
                    ref_2: null
                };
                var urlStr = window.btoa(JSON.stringify(type));
                console.log('urlStr ', urlStr);
                window.location.href = 'https://wechat-mpay.digio.co.th/wxpay?data=' + urlStr;
            };

            function createOrder() {
                Loader.showLoading();
                var order = {
                    merchant_id: merchant_id,
                    total_price: $scope.orderData.total_price,
                    position: '',
                    total_quantity: 1,
                    products: $scope.orderData.products
                };
                console.log('提交订单信息:', order);
                ScanOrderFactory.setOrderList(order).success(function(data) {
                    console.log('创建订单', data);
                    Loader.hideLoading();
                    $scope.order_number = data.data.order.order_number;
                    $scope.created_at = data.data.order.created_at;
                }).error(function(err) {
                    console.log(err);
                });
            }

            function language() {
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
            };
        }
    ]);