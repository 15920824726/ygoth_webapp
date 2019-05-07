(function() {
  'use strict';

  /*
   ** module is created.
   */
  var moduleName = 'posMenu';

  angular.module(moduleName, [])
    .config(['$stateProvider',
      function($stateProvider) {
        $stateProvider
          .state('posmenu', {
            url: '/posmenu',
            templateUrl: 'pos_menu/menu.html',
            controller: 'PosMenuCtrl'
          })
          .state('confirmPayment', {
            url: '/posmenu/confirm',
            params: {
              data: null
            },
            templateUrl: 'pos_menu/confirm-payment.html',
            controller: 'ConfirmPaymentCtrl'
          })
      }
    ]);
})()