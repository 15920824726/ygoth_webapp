(function() {
  'use strict';

  /*
   ** module is created.
   */
  var moduleName = 'order';

  angular.module(moduleName, [])
    .config(['$stateProvider',
      function($stateProvider) {
        $stateProvider
          .state('order', {
            url: '/order/:serviceId/:positionId',
            templateUrl: 'order/order-food.html',
            controller: 'OrderCtrl'
          })
          .state('orderConfirm', {
            url: '/orderConfirm',
            params: {
              'data': null
            },
            templateUrl: 'order/order-confirm.html',
            controller: 'OrderConfirmCtrl'
          })
          .state('orderConfirmTel', {
            url: '/orderConfirmTel',
            params: {
              'data': null
            },
            templateUrl: 'order/order-confirm-tel.html',
            controller: 'OrderConfirmTelCtrl'
          })
          .state('orderResult', {
            url: '/orderResult',
            params: {
              'condition': null
            },
            templateUrl: 'order/order-result.html',
            controller: 'OrderResultCtrl'
          })
          .state('UserSelect', {
            url: '/UserSelect',
            templateUrl: 'order/user-select.html',
            controller: 'UserSelectCtrl'
          })
      }
    ]);
})()