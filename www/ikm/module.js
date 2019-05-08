/*
    created by 2018-06-16
 */

(function() {
    'use strict';

    /*
     ** module is created.
     */
    var moduleName = 'ikm';

    angular.module(moduleName, [])
        .config(['$stateProvider',
            function($stateProvider) {
                $stateProvider
                    .state('ikmPay', {
                        url: '/ikmPay',
                        cache:false,
                        templateUrl: 'ikm/ikm_pay.html',
                        controller: 'IkmPayCtrl'
                    })
                    .state('ikmPayReal', {
                        url: '/ikmPayReal',
                        cache:false,
                        params: {
                            'data': null
                        },
                        templateUrl: 'ikm/ikm_payReal.html',
                        controller: 'IkmPayRealCtrl'
                    })
                    .state('ikmResult',{
                        url: '/IkmResult',
                        cache:false,
                        params:{
                            refill_no: null
                        },
                        templateUrl: 'ikm/ikm_result.html',
                        controller: 'IkmResultCtrl'
                    });
            }
        ]);
})()