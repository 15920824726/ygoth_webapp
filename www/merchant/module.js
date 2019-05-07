(function () {
  'use strict';

  /*
   ** module is created.
   */
  var moduleName = 'merchant';

  angular.module(moduleName,[])
    .config(['$stateProvider',
      function ($stateProvider) {
        $stateProvider
          .state('merchant', {
            url: '/merchant/:merchantId',
            templateUrl: 'merchant/merchant.html',
            controller: 'MerchantCtrl'
          });
      }
    ]);
})()
