angular.module('ikm')
    .controller('IkmPayRealCtrl', ['$scope', '$translate', '$state', 'Loader', '$http', 'IkmFactory','$stateParams',
        function ($scope, $translate, $state, Loader, $http, IkmFactory,$stateParams) {
            $scope.name = 'IkmOrderCtrl';

            $scope.showPay = false;

            $scope.orderData = $stateParams.data;


            /*
                ---- 以防使用 ----
             */
            $scope.$on('$ionicView.beforeEnter', function (e) {

            });

            /*
                ----设置标题-----
             */
            $scope.$on('$ionicView.enter', function (e) {
                document.getElementsByTagName('title')[0].innerHTML = '印尼话费充值';
            });



            $scope.pay = function () {
                Loader.showLoading('微信支付支付中，请耐心等待...');

                var params = {
                    tradeNo: $scope.orderData.refill_no,
                    body: '印尼话费充值 ' + $scope.orderData.price ,
                    attach: 'IkmRefill',
                    // totalFee: $scope.orderData.total_fee,
                    totalFee: 2,
                    openid: sessionStorage.getItem('user_openid')
                };
                // 创建微信支付订单
                IkmFactory.createWechatOrder(params).success(function (data) {
                    console.log(data)
                    // 下单成功后  进行微信支付
                    if (data.retCode == 20000) {
                        // 判断插件是否纯在
                        if (typeof WeixinJSBridge == "undefined") {
                            // 不能支付
                            Loader.toggleLoadingWithMessage('没有检测到微信插件，不能支付', 3000);
                        } else {
                            //Loader.hideLoading();
                            onBridgeReady(data);
                        }
                    }else {
                        Loader.toggleLoadingWithMessage('下单异常！稍后重试', '3000');
                    }
                }).error(function (err) {
                    console.log(err);
                    Loader.toggleLoadingWithMessage('充值失败，请稍后重试！');
                });
            };

            function onBridgeReady(data) {
                WeixinJSBridge.invoke(
                    'getBrandWCPayRequest', {
                        "appId": "wxb5693e63f692bc4c",     //公众号名称，由商户传入
                        "timeStamp": data.data.timestamp + "",         //时间戳，自1970年以来的秒数
                        "nonceStr": data.data.nonceStr, //随机串
                        "package": "prepay_id=" + data.data.prepayId, //包
                        "signType": "MD5",         //微信签名方式：
                        "paySign": data.data.sign//微信签名
                    },
                    function (res) {
                        if (res.err_msg == "get_brand_wcpay_request:ok") {
                            // 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回    ok，但并不保证它绝对可靠。
                            // 支付成功，保存电话号码 在sesssionStorage里面
                            $state.go('ikmResult', {
                                refill_no: $scope.orderData.refill_no,
                                operator_id: $scope.orderData.operator_id
                            })
                        } else if (res.err_msg == "get_brand_wcpay_request:cancel") {
                            Loader.toggleLoadingWithMessage('支付过程中用户取消', 3000);
                        } else if (res.err_msg == "get_brand_wcpay_request:cancel") {
                            Loader.toggleLoadingWithMessage('支付已失效', 3000);
                        } else {
                            // 支付失败，保存电话号码 在sesssionStorage里面
                            Loader.toggleLoadingWithMessage('支付失败', 3000);
                            $state.go('ikmResult', {
                                refill_no: $scope.orderData.refill_no,
                                operator_id: $scope.orderData.operator_id
                            });
                        }
                    }
                );
            };

        }
    ]);