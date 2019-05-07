(function() {
  'use strict';

  // Ionic Starter App

  // angular.module is a global place for creating, registering and retrieving Angular modules
  // 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
  // the 2nd parameter is an array of 'requires'
  var app = angular.module('starter', ['ionic', 'angularMoment', 'pascalprecht.translate', 'btford.socket-io', 
    'merchant', 
    'order', 
    'topup', 
    'posMenu',
    'ikm',
    'ygoworld.services',
    'ygoworld.directives',
    'ygoworld.configs',
    'ygoworld.constants',
    'ygoworld.filters'
  ])

  .run(function($ionicPlatform, $http, APP, ServerConfiguration, DevServerConfiguration, ChinaServerConfiguration) {
    $ionicPlatform.ready(function() {
      // if(window.cordova && window.cordova.plugins.Keyboard) {
      //   // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      //   // for form inputs)
      //   cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      //
      //   // Don't remove this line unless you know what you are doing. It stops the viewport
      //   // from snapping when text inputs are focused. Ionic handles this internally for
      //   // a much nicer keyboard experience.
      //   cordova.plugins.Keyboard.disableScroll(true);
      // }


      /*
       *  根据用户的位置访问不同的服务器（中国或泰国）；根据APP.devMode判断是否为开发环境，如果是则访问开发环境
       *
       */
      function getIp() {
        //获取IP  根据IP获取国家
        $http.get('http://pv.sohu.com/cityjson?ie=utf-8').success(function(data) {
          var obj = transformObj(data);
          var ip = obj.cip;
          $http.get('http://int.dpool.sina.com.cn/iplookup/iplookup.php?format=js&ip=' + ip).success(function(result) {
            var countryObj = transformObj(result);
            var country = countryObj.country;
            //是否为开发环境
            if (APP.devMode) {
              ServerConfiguration.baseApiUrl = DevServerConfiguration.baseApiUrl;
              ServerConfiguration.socketUrl = DevServerConfiguration.socketUrl;
              ServerConfiguration.domain = DevServerConfiguration.domain;
              ServerConfiguration.updateUrl = DevServerConfiguration.updateUrl;
            } else {
              //用户是否在中国，如果是，则访问中国的服务器
              if (decodeURI(country) == "中国") {
                ServerConfiguration.baseApiUrl = ChinaServerConfiguration.baseApiUrl;
                ServerConfiguration.socketUrl = ChinaServerConfiguration.socketUrl;
                ServerConfiguration.domain = ChinaServerConfiguration.domain;
                ServerConfiguration.updateUrl = ChinaServerConfiguration.updateUrl;
              }
            }
          }).error(function(err) {
            console.log(err);
          });
        }).error(function(err) {
          console.log(err);
        });
      }

      // getIp();

      function transformObj(data) {
        var str = data.slice(data.indexOf('=') + 1).replace(';', '');
        return JSON.parse(str);
      }

      if (window.StatusBar) {
        StatusBar.styleDefault();
      }
    });
  });

  app.config(['$stateProvider', '$urlRouterProvider', '$ionicConfigProvider', '$translateProvider', 'ServerConfiguration', 'DevServerConfiguration', 'APP', 'ChinaServerConfiguration',
    function($stateProvider, $urlRouterProvider, $ionicConfigProvider, $translateProvider, ServerConfiguration, DevServerConfiguration, APP, ChinaServerConfiguration) {
      //tab position in ios android
      ionic.Platform.isFullScreen = true;
      $ionicConfigProvider.tabs.position('bottom');

      $ionicConfigProvider.platform.ios.tabs.style('standard');
      $ionicConfigProvider.platform.ios.tabs.position('bottom');
      $ionicConfigProvider.platform.android.tabs.style('standard');
      $ionicConfigProvider.platform.android.tabs.position('standard');

      $ionicConfigProvider.platform.ios.navBar.alignTitle('center');
      $ionicConfigProvider.platform.android.navBar.alignTitle('left');

      $ionicConfigProvider.platform.ios.backButton.previousTitleText('').icon('ion-ios-arrow-thin-left');
      $ionicConfigProvider.platform.android.backButton.previousTitleText('').icon('ion-android-arrow-back');

      $ionicConfigProvider.platform.ios.views.transition('ios');
      $ionicConfigProvider.platform.android.views.transition('android');

      //多语言支持
      $translateProvider.useStaticFilesLoader({
        prefix: 'languages/locale-',
        suffix: '.json'
      });
      //模式使用的语言

      // $translateProvider.preferredLanguage('en_US');
      var lang;
      if (window.navigator.language.toLowerCase() == "zh-cn") {
        lang = "zh_CN";
      } else {
        lang = "en_US";
      }

      ServerConfiguration.baseApiUrl = DevServerConfiguration.baseApiUrl;
      ServerConfiguration.socketUrl = DevServerConfiguration.socketUrl;
      ServerConfiguration.domain = DevServerConfiguration.domain;
      ServerConfiguration.updateUrl = DevServerConfiguration.updateUrl;

      $translateProvider.preferredLanguage(lang);

      var address = window.location.href;
      if (address.indexOf('merchant') > 0) {
        var parrent = /\d+$/;
        var selectId = address.match(parrent);
        $urlRouterProvider.otherwise('/merchant', {
          merchantId: selectId[0]
        });
      } else if (address.indexOf('call') > 0) {
        window.location.href = "http://android.myapp.com/myapp/detail.htm?apkName=com.ygoworld.ygoth";
      } else if (address.indexOf('topup') > 0) {
        $urlRouterProvider.otherwise('/topup');
      } else if (address.indexOf('/posmenu') > 0) {
        $urlRouterProvider.otherwise('/posmenu');
      }else if(address.indexOf('ikm')){
        $urlRouterProvider.otherwise('/ikm');
      }else {
        $urlRouterProvider.otherwise('/UserSelect');
      }
    }
  ])
})()