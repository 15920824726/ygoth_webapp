/*
    created by 2018-06-16
 */

(function () {
    'use strict';

    /*
     ** module is created.
     */
    var moduleName = 'evoa';

    angular.module(moduleName, [])
        .config(['$stateProvider',
            function ($stateProvider) {
                $stateProvider
                    .state('index', {
                        url: '/index',
                        cache: false,
                        templateUrl: 'evoa/index.html',
                        controller: 'EvoaIndexCtrl'
                    })
                    .state('payment', {
                        url: '/payment/:orderid',
                        cache: false,
                        templateUrl: 'evoa/payment.html',
                        controller: 'EvoaPaymentCtrl'
                    })
                    .state('result', {
                        url: '/result/:amount/:appNo/:paymentNo/:endAt',
                        cache: false,
                        templateUrl: 'evoa/payment-result.html',
                        controller: 'EvoaPaymentResultCtrl'
                    })
                    .state('dopay', {
                        url: '/dopay/:id',
                        cache: false,
                        templateUrl: 'evoa/dopay.html',
                        controller: 'EvoaDopayCtrl'
                    });
            }
        ]);
})()