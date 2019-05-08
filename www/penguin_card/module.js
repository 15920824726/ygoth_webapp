/*
    created by 2018-06-16
 */

(function() {
    'use strict';

    /*
     ** module is created.
     */
    var moduleName = 'penguin';

    angular.module(moduleName, [])
        .config(['$stateProvider',
            function($stateProvider) {
                $stateProvider
                    .state('penguinPay', {
                        url: '/penguinPay',
                        cache:false,
                        templateUrl: 'penguin_card/penguin_pay.html',
                        controller: 'PenguinPayCtrl'
                    })
                    .state('penguinPayReal', {
                        url: '/penguinPayReal',
                        cache:false,
                        templateUrl: 'penguin_card/penguin_payReal.html',
                        controller: 'PenguinPayRealCtrl'
                    })
                    .state('penguinResult',{
                        url: '/penguinResult',
                        cache:false,
                        params:{
                            session_id: null
                        },
                        templateUrl: 'penguin_card/penguin_result.html',
                        controller: 'PenguinResultCtrl'
                    });
            }
        ]);
})()