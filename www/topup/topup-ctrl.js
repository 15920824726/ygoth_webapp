angular.module('topup')
    .controller('TopupCtrl', ['$scope', '$translate',
        function($scope, $translate) {
            $scope.translations = null;
            $translate([
                'LOAD_DATA_FAILED',
                'SERVICE_DETAIL_ACTOR_ADDRESS',
                'NOW_PAY',
                'AIS_PAY',
                'TELE_INPUT',
                'SELECT_PAY',
                'MATTERS_ONE',
                'MATTERS_TWO',
                'PAY_EXPECT'
            ]).then(function(data) {
                $scope.translations = data;
            }, function(translationIds) {
                $scope.translations = translationIds;
            });

            $scope.data = '';

            $scope.oldvalues = [50, 100, 150, 250, 500, 1000, 1500, 2500];
            $scope.values = [{
                id: 0,
                value: 50
            }, {
                id: 1,
                value: 100
            }, {
                id: 2,
                value: 150
            }, {
                id: 3,
                value: 250
            }, {
                id: 4,
                value: 500
            }, {
                id: 5,
                value: 1000
            }, {
                id: 6,
                value: 1500
            }, {
                id: 7,
                value: 2500
            }];
            $scope.signPay = false;

            $scope.user = {
                mobile: ''
            };

            $scope.goPay = function() {
                console.log($scope.user + $scope.data);
            };

            $scope.selectPay = function(item) {
                $scope.data = item.value;
                $('.topup ion-content .value-list .list-list').css({
                    'backgroundColor': '#ffffff',
                    'color': '#cccccc'
                });
                $('.topup ion-content .value-list .list-list').eq(item.id).css({
                    'backgroundColor': 'red',
                    'color': '#ffffff'
                });
            };
        }
    ]);