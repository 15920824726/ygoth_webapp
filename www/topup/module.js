(function() {
  'use strict';

  /*
   ** module is created.
   */
  var moduleName = 'topup';

  angular.module(moduleName, [])
    .config(['$stateProvider',
      function($stateProvider) {
        $stateProvider
          .state('topup', {
            url: '/topup',
            templateUrl: 'topup/topup.html',
            controller: 'TopupCtrl'
          });
      }
    ]);
})()