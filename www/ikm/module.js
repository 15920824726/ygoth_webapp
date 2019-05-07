(function () {
    'use strict';

    /*
     ** module is created.
     */
    var moduleName = 'ikm';

    angular.module(moduleName,[])
        .config(['$stateProvider',
            function ($stateProvider) {
                $stateProvider
                    .state('ikm', {
                        url: '/ikm',
                        templateUrl: 'ikm/ikm.html',
                        controller: 'IkmCtrl'
                    })
                    .state('ikmOrder', {
                        url: '/ikmOrder',
                        params: {
                            data: null
                        },
                        templateUrl: 'ikm/ikm-order.html',
                        controller: 'IkmOrderCtrl'
                    });
            }
        ]);
})();
