angular.module('penguin')
    .controller('PenguinPayRealCtrl', ['$scope', '$translate', '$state', 'Loader', 'pguinCard', '$http', '$rootScope',
        function ($scope, $translate, $state, Loader, pguinCard, $http, $rootScope) {
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
                'WAITING_CONSTANT'
            ]).then(function (data) {
                $scope.translations = data;
            }, function (translationIds) {
                $scope.translations = translationIds;
            });

            $scope.openid = '';
            $scope.APPID = 'wxb5693e63f692bc4c';

            $scope.$on('$ionicView.beforeEnter', function (e) {
                // h获取CODE
                var codeUrl = 'https://th.ygoworld.com/wxoa/userinfo/';
                var CODE = location.href.match(/code=(\w+)/)[1];

                // 如果缓存中包含userOpenid,则不请求openid
                if (sessionStorage.getItem('user_openid')) {
                    $scope.openid = sessionStorage.getItem('user_openid');
                } else {
                    $http.get(codeUrl + CODE).success(function (data) {
                        console.log('data:', JSON.stringify(data));
                        sessionStorage.setItem('user_openid', data.data.openid);
                        $scope.openid = data.data.openid;
                    }).error(function (res) {
                        console.log(res);
                    });
                }

                $http.get("https://test.ygoworld.com/wxoa/jsapi?url=" + encodeURIComponent(location.href.split('#')[0])).success(function (re) {
                    wx.config({
                        debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                        appId: 'wxb5693e63f692bc4c', // 必填，公众号的唯一标识
                        timestamp: re.data.timestamp, // 必填，生成签名的时间戳
                        nonceStr: re.data.nonceStr, // 必填，生成签名的随机串
                        signature: re.data.signature,// 必填，签名
                        jsApiList: ['chooseWXPay'] // 必填，需要使用的JS接口列表
                    });

                    wx.ready(function () {
                        console.log('p配置成功！');
                    })
                }).error(function (err) {
                    console.log(err);
                })

            });

            $scope.$on('$ionicView.enter', function (e) {
                console.log('after');
                document.getElementsByTagName('title')[0].innerHTML = '多多卡充值';
            });


            $scope.numbers = [0.1, 15, 30];
            $scope.user = {
                telphone: ""
            };
            $scope.showProcess = false;   // 默认不显示正在处理中

            // 选择套餐 默认选择第一个
            $scope.selected = 0;
            $scope.count = $scope.numbers[0];
            $scope.selectPackage = function (item, index) {
                console.log(item);
                $scope.selected = index;
                $scope.count = item;
                // $scope.$apply();
            };

            // 进行支付
            $scope.pay = function () {
                if (!$scope.user.telphone) {
                    Loader.toggleLoadingWithMessage('请填写电话号码', 3000);
                    return;
                }

                Loader.showLoading('微信支付');
                // 校验电话号码
                pguinCard.testPenguinNumber("66" + $scope.user.telphone).success(function (res) {
                    if (res.retCode == 20001) {
                        var params = {
                            msisdn: "66" + $scope.user.telphone,
                            amount: parseFloat($scope.count) * 100,
                            openid: $scope.openid
                        };
                        pguinCard.createPguinOrder(params).success(function (data) {
                            console.log(data);
                            //创建订单成功后,进行微信统一下单
                            if (data.retCode == 0) {
                                var w_params = {
                                    tradeNo: data.data.session_id,
                                    body: '多多卡充值' + $scope.count + '元套餐',
                                    attach: 'PguinRefill',
                                    totalFee: parseFloat($scope.count) * 100,
                                    openid: $scope.openid
                                };
                                $scope.sessionId = data.data.session_id;
                                pguinCard.createWechatOrder(w_params).success(function (data) {
                                    // 下单成功后  进行微信支付
                                    if (data.retCode == 20000) {
                                        // 判断插件是否纯在
                                        if (typeof WeixinJSBridge == "undefined") {
                                            // 不能支付
                                            Loader.toggleLoadingWithMessage('没有检测到微信插件，不能支付', 3000);
                                        } else {
                                            Loader.hideLoading();
                                            onBridgeReady(data);
                                        }
                                    } else {
                                        Loader.toggleLoadingWithMessage('下单异常！稍后重试', '3000');
                                    }
                                }).error(function (err) {
                                    console.log(err);
                                })
                            }
                        }).error(function (err) {
                            Loader.toggleLoadingWithMessage('充值失败，请稍后重试！');
                        });
                    } else {
                        Loader.toggleLoadingWithMessage('电话号码无效，请重试！', 3000);
                    }
                }).error(function (err) {
                    console.log(err);
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
                            $state.go('penguinResult', {
                                session_id: $scope.sessionId
                            })
                        } else if (res.err_msg == "get_brand_wcpay_request:cancel") {
                            Loader.toggleLoadingWithMessage('支付过程中用户取消', 3000);
                        } else if (res.err_msg == "get_brand_wcpay_request:cancel") {
                            Loader.toggleLoadingWithMessage('支付已失效', 3000);
                        } else {
                            Loader.toggleLoadingWithMessage('支付失败', 3000);
                            $state.go('penguinResult', {
                                session_id: 0
                            });
                        }
                    }
                );
            }

            function wxInterfacePay(data) {
                wx.chooseWXPay({
                    appId: "wxb5693e63f692bc4c",
                    timestamp: data.data.timestamp + "", // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
                    nonceStr: data.data.nonceStr, // 支付签名随机串，不长于 32 位
                    package: "prepay_id=" + data.data.prepayId, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=\*\*\*）
                    signType: "MD5", // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
                    paySign: data.data.sign, // 支付签名
                    success: function (res) {
                        // 支付成功后的回调函数
                        console.log(res);

                    }
                });
            }


        }
    ]);