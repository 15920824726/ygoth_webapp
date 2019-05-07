angular.module('order')
  .controller('OrderCtrl', ['$scope', '$state', '$stateParams', '$ionicScrollDelegate', '$translate', 'ScanOrderFactory', 'ServerConfiguration', 'Loader',
    function($scope, $state, $stateParams, $ionicScrollDelegate, $translate, ScanOrderFactory, ServerConfiguration, Loader) {
      $scope.serviceId = $stateParams.orderId;
      $scope.base = ServerConfiguration.baseApiUrl;
      $scope.totalNumber = 0; //订单项目的总数
      $scope.totalPrice = 0; //订单总价
      $scope.isLoggedIn = true;
      $scope.orderItems = [];
      $scope.showSummary = false;
      $scope.translations = null;
      $scope.orderTop = 94;
      $translate([
        'ORDER_FOOD_TITLE',
        'ORDER_FOOD_GO',
        'GOT_ORDER_PROMPT',
        'CHOOSE_ITEM_PROMPT',
        'SERVICE_DETAIL_TAB_TITLE',
        'ORDER_TAGS',
        'ORDER_CLEAR',
        'MENU_PAGE_PROMPT',
        'CONTINUE',
        'CHINESE_ORDER',
        'ORDER_IMG_REFER',
        'ORDER_COMMIT'
      ]).then(function(data) {
        $scope.translations = data;
      }, function(translationIds) {
        $scope.translations = translationIds;
      });

      $scope.$on('$ionicView.afterEnter', function() {

        console.log('afterEnter');

      }, false);

      //菜品对应的菜单
      $scope.selected = 0;
      $scope.selectedClassIndex = 0;
      $scope.showMenu = function(index) {
        $ionicScrollDelegate.$getByHandle('order').scrollTop();
        $scope.selected = index;
        $scope.selectedClassIndex = index;
      };

      $scope.showSum = function() {
        if ($scope.orderItems.length) {
          $scope.showSummary = !$scope.showSummary;
        }
      };

      $scope.alertTags = function() {
        $scope.showSummary = !$scope.showSummary;
        $('.store .scroll-food-details').css("overflow-y", "scroll");
        $('.store .scroll-food').css("overflow-y", "scroll");
      };

      $scope.tags = function(event) {
        event.stopPropagation();
      };

      $('.store .details-modal').on("touchmove", function(event) {
        event.preventDefault(); //该方法将通知 Web 浏览器不要执行与事件关联的默认动作（如果存在这样的动作）。
      });

      $('.store .details-modal-content .detail-content').on("touchmove", function(event) {
        event.stopPropagation(); //该方法将停止事件的传播，阻止它被分派到其他 Document 节点。在事件传播的任何阶段都可以调用它。
        $('.store .scroll-food').css("overflow-y", "hidden");
        $('.store .scroll-food-details').css("overflow-y", "hidden");
      });


      //加减菜
      $scope.add = function(index, product) {
        var i = 0;
        while (i <= $scope.orderItems.length) {
          if ($scope.orderItems[i] && $scope.orderItems[i].id == product.id) {
            $scope.orderItems[i].quantity++;
            product.number++;
            $scope.merchant.classifications[$scope.selectedClassIndex].categoryNumber++;
            $scope.totalNumber++;
            $scope.totalPrice = $scope.totalPrice + product.price;
            break;
          }
          i++;
        }

        if (i > $scope.orderItems.length) {
          var tmpItem = {
            id: product.id,
            title: product.title,
            price: product.price,
            origin_title: product.origin_title,
            quantity: 1
          };
          $scope.orderItems.push(tmpItem);
          product.number++;
          $scope.merchant.classifications[$scope.selectedClassIndex].categoryNumber++;
          $scope.totalNumber++;
          $scope.totalPrice = $scope.totalPrice + product.price;
        }
      };

      $scope.minus = function(index, product) {
        for (var i = 0; i < $scope.orderItems.length; i++) {
          if ($scope.orderItems[i].id == product.id) {
            if ($scope.orderItems[i].quantity !== 0) {
              $scope.orderItems[i].quantity--;
              $scope.totalNumber--;
              $scope.totalPrice = $scope.totalPrice - product.price;
              product.number--;
              $scope.merchant.classifications[$scope.selectedClassIndex].categoryNumber--;

              if ($scope.orderItems[i].quantity === 0) {
                $scope.orderItems.splice(i, 1);
              }
              break;
            }
          }
        }
      };

      $scope.sumAdd = function(index, item) {
        console.log(item);
        for (var j = 0; j < $scope.merchant.classifications.length; j++) {
          for (var k = 0; k < $scope.merchant.classifications[j].products.length; k++) {
            if ($scope.merchant.classifications[j].products[k].id == item.id) {
              item.quantity++;
              $scope.totalNumber++;
              $scope.totalPrice = $scope.totalPrice + $scope.merchant.classifications[j].products[k].price;
              $scope.merchant.classifications[j].products[k].number++;
              $scope.merchant.classifications[j].categoryNumber++;
              break;
            }
          }
        }
      };

      $scope.sumMinus = function(index, item) {
        for (var j = 0; j < $scope.merchant.classifications.length; j++) {
          for (var k = 0; k < $scope.merchant.classifications[j].products.length; k++) {
            if ($scope.merchant.classifications[j].products[k].id == item.id) {
              if (item.quantity !== 0) {
                item.quantity--;
                $scope.totalNumber--;
                $scope.totalPrice = $scope.totalPrice - $scope.merchant.classifications[j].products[k].price;
                $scope.merchant.classifications[j].products[k].number--;
                $scope.merchant.classifications[j].categoryNumber--;
                if (item.quantity === 0) {
                  $scope.orderItems.splice(index, 1);
                  if ($scope.orderItems.length == 0) {
                    $scope.showSummary = false;
                  }
                }
              }
              break;
            }
          }
        }
      };

      $scope.makeOrder = function() {
        var products = [];
        for (i = 0; i < $scope.orderItems.length; i++) {
          products.push($scope.orderItems[i]);
        }

        var order = {
          mpay_mid: $scope.mpay_mid,
          merchant_id: $scope.merchant.id,
          total_price: $scope.totalPrice,
          total_quantity: $scope.totalNumber,
          position: $stateParams.positionId,
          products: products
        };

        if ($scope.totalNumber > 0) {
          $state.go('orderConfirm', {
            data: order
          })
        } else {
          Loader.toggleLoadingWithMessage($scope.translations.CHOOSE_ITEM_PROMPT, 2000);
        }

      };

      $scope.goHome = function() {
        $state.go('UserSelect');
      };

      $scope.clear = function() {
        $scope.orderItems = [];
        for (var i = 0; i < $scope.merchant.classifications.length; i++) {
          $scope.merchant.classifications[i].categoryNumber = 0;
          for (var j = 0; j < $scope.merchant.classifications[i].products.length; j++) {
            $scope.merchant.classifications[i].products[j].number = 0;
          }
        }
        $scope.totalNumber = 0;
        $scope.totalPrice = 0;
        $scope.showSummary = false;
      };

      function Init() {
        Loader.toggleLoadingWithMessage('', 10000);
        ScanOrderFactory.getMerchantMenu($stateParams.serviceId).success(function(data) {
          $scope.merchant = data.data.merchant;
          $scope.mpay_mid = data.data.merchant.mpay_mid;
          for (var i = 0; i < $scope.merchant.classifications.length; i++) {
            if (!$scope.merchant.classifications[i].products.length) {
              $scope.merchant.classifications.splice(i, 1);
            } else {
              $scope.merchant.classifications[i].categoryNumber = 0;
              for (var j = 0; j < $scope.merchant.classifications[i].products.length; j++) {
                $scope.merchant.classifications[i].products[j].number = 0;
              }
            }
          }
          $(".order-food .order_info").ready(function() {
            console.log('order :' + document.querySelector('.order-food .order_info').clientHeight);
            $scope.orderTop = document.querySelector('.order-food .order_info').clientHeight;
            Loader.hideLoading();
          });

        }).error(function(err) {
          Loader.hideLoading();
        });
      }

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

      Init();
    }
  ]);