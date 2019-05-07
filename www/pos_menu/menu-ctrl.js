angular.module('posMenu')
    .controller('PosMenuCtrl', ['$scope', '$translate', '$state', 'ScanOrderFactory', 'ServerConfiguration', 'Loader',
        function($scope, $translate, $state, ScanOrderFactory, ServerConfiguration, Loader) {
            var serviceId = 3068;
            $scope.merchant = {
                name: '职业培训中心',
                original_name: 'Vocational Training Center',
                background: '/system/service_attachments/000/018/494/originals/5.jpg?1529047107'
            }
            $scope.translations = null;
            $scope.base = ServerConfiguration.baseApiUrl;
            $scope.orderItems = [];
            $scope.totalNumber = 0; //订单项目的总数
            $scope.totalPrice = 0; //订单总价

            // 去下单
            $scope.confirm = function(item) {
                var products = [];
                products.push(item);
                var data = {
                    products: products,
                    total_price: item.price,
                    total_quantity: 1
                };
                $state.go('confirmPayment', {
                    data: data
                });

            };

            // 为每个菜单项添加一个数量字段
            initMenu();
            language();

            function language() {
                $translate([
                    'LOAD_DATA_FAILED',
                    'SERVICE_DETAIL_ACTOR_ADDRESS',
                    'NOW_PAY',
                    'AIS_PAY',
                    'TELE_INPUT',
                    'SELECT_PAY',
                    'MATTERS_ONE',
                    'MATTERS_TWO',
                    'PAY_EXPECT'
                ]).then(function(data) {
                    $scope.translations = data;
                }, function(translationIds) {
                    $scope.translations = translationIds;
                });
            };

            function initMenu() {
                Loader.noBgToast('加载中', 120000);
                ScanOrderFactory.getMerchantMenu(serviceId).success(function(data) {
                    $scope.merchant = data.data.merchant;
                    $scope.mpay_mid = data.data.merchant.mpay_mid;
                    console.log(data.data.merchant);
                    $scope.menus = data.data.merchant.classifications[0].products;
                    console.log($scope.menus);
                    for (item of $scope.menus) {
                        item.quantity = 1;
                    }
                    Loader.hideLoading();
                }).error(function(err) {
                    Loader.noBgToast('加载失败请稍后再试', 3000);
                });
            };

        }
    ]);