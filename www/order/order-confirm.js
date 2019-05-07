angular.module('order')
  .controller('OrderConfirmCtrl', ['$scope', 'ScanOrderFactory', '$state', 'Loader', '$stateParams', '$translate', 'ServerConfiguration', '$ionicHistory',
    function($scope, ScanOrderFactory, $state, Loader, $stateParams, $translate, ServerConfiguration, $ionicHistory) {

      $translate([
        'ORDER_FOOD_GO',
        'OK',
        'CONFIRM_ORDER',
        'CONFIRM',
        'SUBMIT',
        'ORDER_DESKTOP',
        "ONE_COLUMN",
        "TWO_COLUMNS",
        "ALL_ORDER",
        "CONFIRM_SUBMIT"
      ]).then(function(data) {
        $scope.translations = data;
      }, function(translationIds) {
        $scope.translations = translationIds;
      });

      $scope.base = ServerConfiguration.baseApiUrl;
      // $scope.imageSrc= $scope.base+'/icons/ad1@2x.png';

      $scope.goOrderFood = function() {
        $ionicHistory.goBack(-1);
      };

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
        var order = {
          merchant_id: $stateParams.data.merchant_id,
          total_price: $stateParams.data.total_price,
          total_quantity: $stateParams.data.total_quantity,
          position: $stateParams.data.position,
          products: $stateParams.data.products
        };
        ScanOrderFactory.setOrderList(order).success(function(data) {
          if (data.retCode === 0) {
            $state.go('orderResult', {
              condition: true
            })
          } else {
            $state.go('orderResult', {
              condition: false
            });
          }
        }).error(function() {

        });

      };

      function Init() {
        try {
          $scope.total_price = $stateParams.data.total_price;
          $scope.total_quantity = $stateParams.data.total_quantity;
          $scope.products = $stateParams.data.products;
          $scope.position = $stateParams.data.position;
        } catch (err) {
          $ionicHistory.goBack(-1);
        }
      }

      Init();

    }
  ])