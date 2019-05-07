angular.module('order')
  .controller('OrderResultCtrl', ['$scope', '$state', '$stateParams', '$translate', 'ServerConfiguration', '$ionicHistory',
    function($scope, $state, $stateParams, $translate, ServerConfiguration, $ionicHistory) {
      $translate([
        'SUCCESS_TO_POST',
        'RETURN_FIRSTPAGE',
        'ORDER_COMMIT',
        'SUCCESS_TO_POST',
        'FAILED_TO_SUBMIT',
      ]).then(function(data) {
        $scope.translations = data;
      }, function(translationIds) {
        $scope.translations = translationIds;
      });

      $scope.return = function() {
        $ionicHistory.goBack(-1);
      };

      $scope.result = true;

      $scope.base = ServerConfiguration.baseApiUrl;
      $scope.imageSrc = $scope.base + '/icons/ad2@2x.png';

      $scope.goFirstPage = function() {
        $state.go('UserSelect');
      };


      function Init() {
        if (!$stateParams.condition) {
          $scope.result = false;
        }
      }

      Init();

    }
  ])