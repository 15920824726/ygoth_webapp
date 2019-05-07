angular.module('ikm')
    .controller('IkmCtrl', ['$scope','$state','Loader', 'IkmFactory', function ($scope,$state, Loader, IkmFactory) {
        $scope.currencyDatas = [
            { "id" : "TELKOMSEL", "name" : "TELKOMSEL",   "range":['0811','0812','0813','0821','0822','0851','0852','0853','0823'], "fee": 0.0, "can_topup" : [10000,20000,25000,50000,100000,150000,200000,300000,500000,1000000] },
            { "id" : "INDOSAT",   "name" : "INDOSAT",     "range":['0814','0815','0816','0855','0856','0857','0858'], "fee": 0.0, "can_topup" : [5000,10000,12000,20000,25000,30000,50000,100000]},
            { "id" : "SMARTFREN", "name" : "SMARTFREN",   "range":['0881','0882','0883','0884','0885','0886','0887','0888','0889'], "fee": 0.0, "can_topup" : [5000,10000,20000,25000,50000,60000,100000] },
            { "id" : "THREE",     "name" : "TRI Telekom", "range":['0895','0896','0897','0898','0899'], "fee": 0.0, "can_topup" : [1000,2000,3000,4000,5000,10000,20000,25000,30000,50000,100000] },
            { "id" : "XL_AXIATA", "name" : "XL/AXIS",     "range":['0817','0818','0819','0877','0878','0859','0877','0878','0831','0832','0833','0838'], "fee": 0.0, "can_topup" : [5000,10000,15000,25000,30000,50000,100000] }
        ];
        $scope.user = {
            mobile: ''
        };
        $scope.showPrice = false;
        $scope.wrongNumber = false;
        $scope.goods = [];
        $scope.selected = 0;
        $scope.price = '';

        $scope.select = function(item , index) {
            console.log(item);
            $scope.selected = index;
            $scope.price = item;
        };

        // 用户输入 进行判断
        $scope.$watch('user.mobile', function (newValue, oldValue) {
            console.log($scope.user.mobile);
            if ($scope.user.mobile != oldValue){

                // 小于四位进行操作
                if($scope.user.mobile.length <10) {
                    $scope.showPrice = false;
                    $scope.wrongNumber = false;
                    $scope.selected = 0;
                    return
                }

                // 当mobile改变时执行的代码
                else  if($scope.user.mobile.length >= 10 && $scope.user.mobile.length <=15){
                    // 商品为 TELKOMSEL
                    // 有五种运行商 进行判断
                    if($scope.currencyDatas[0].range.indexOf($scope.user.mobile.slice(0,4)) >= 0){
                        $scope.goods = $scope.currencyDatas[0];
                        $scope.showPrice = true;
                        $scope.wrongNumber = false;
                        $scope.price = $scope.goods.can_topup[0];
                    }
                    else if($scope.currencyDatas[1].range.indexOf($scope.user.mobile.slice(0,4)) >= 0){
                        $scope.goods = $scope.currencyDatas[1];
                        $scope.showPrice = true;
                        $scope.wrongNumber = false;
                        $scope.price = $scope.goods.can_topup[0];
                    }
                    else if($scope.currencyDatas[2].range.indexOf($scope.user.mobile.slice(0,4)) >= 0){
                        $scope.goods = $scope.currencyDatas[2];
                        $scope.showPrice = true;
                        $scope.wrongNumber = false;
                        $scope.price = $scope.goods.can_topup[0];
                    }
                    else if($scope.currencyDatas[3].range.indexOf($scope.user.mobile.slice(0,4)) >= 0){
                        $scope.goods = $scope.currencyDatas[3];
                        $scope.showPrice = true;
                        $scope.wrongNumber = false;
                        $scope.price = $scope.goods.can_topup[0];
                    }
                    else if($scope.currencyDatas[4].range.indexOf($scope.user.mobile.slice(0,4)) >= 0){
                        $scope.goods = $scope.currencyDatas[4];
                        $scope.showPrice = true;
                        $scope.wrongNumber = false;
                        $scope.price = $scope.goods.can_topup[0];
                    }
                    else {
                        $scope.showPrice = false;
                        $scope.wrongNumber = true;
                        $scope.selected = 0;
                    }
                    return ;

                }else {
                    $scope.showPrice = false;
                    $scope.wrongNumber = true;
                    $scope.selected = 0;
                }
            }

        });

        $scope.confirm = function () {
            Loader.showLoading();
            var params = {
                openid: '123456789',
                phone_no: $scope.user.mobile,
                price: $scope.price,
                deno: '印尼卢比',
                operator_id: $scope.goods.id
            };
            IkmFactory.createOrder(params).success(function (res) {
                $state.go('ikmOrder',{
                    data: data
                })
            }).error(function(err) {
                console.log(err);
                Loader.toggleLoadingWithMessage('提交订单失败，请稍后再试！');
            })
        }
    }]);