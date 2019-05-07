angular.module('ygoworld.directives', [])

.directive('compareTo', [function() {
    return {
        require: "ngModel",
        scope: {
            otherModelValue: "=compareTo"
        },
        link: function(scope, element, attributes, ngModel) {

            ngModel.$validators.compareTo = function(modelValue) {
                return modelValue == scope.otherModelValue;
            };

            scope.$watch("otherModelValue", function() {
                ngModel.$validate();
            });
        }
    };
}])

//放大/缩小图片
.directive('zoomView', ['$compile', '$ionicModal', '$ionicPlatform', '$ionicSlideBoxDelegate', function($compile, $ionicModal, $ionicPlatform, $ionicSlideBoxDelegate) {
    return {

        restrict: "A",

        link: function link(scope, elem, attr) {

            $ionicPlatform.ready(function() {

                elem.attr("ng-click", "showZoomView($index)");
                elem.removeAttr("zoom-view");
                $compile(elem)(scope);

                var zoomViewTemplate = '<ion-modal-view style="background-color: black;" class="zoom-view">' +

                    '<ion-content style="overflow-y: hidden;" class="zoom-view-content">' +
                    '<div style="margin-top:50%">' +
                    '<ion-slide-box ng-click="closeZoomView()" show-pager="false"  width="100%" delegate-handle="my-zoom-handle">' +
                    '<ion-slide ng-repeat="ngSrc in images" width="100%" active-slide="choose()">' +
                    '<div>' +
                    '<img ng-src="{{base + ngSrc.url}}" id="img2" width="100%">' +
                    '<div style="color:#fff; font-size:16px; position:absolute; right:0; bottom:0px;">' + '{{images.indexOf(ngSrc)+1}}' + '/{{images.length}}' +
                    '</div>' +
                    '</div>' +
                    '</ion-slide>' +
                    '</ion-slide-box>' +
                    '</div>' +
                    '</ion-content>' +
                    '</ion-modal-view>';

                scope.zoomViewModal = $ionicModal.fromTemplate(zoomViewTemplate, {
                    scope: scope,
                    animation: "slide-in-up"
                });
                scope.showZoomView = function($index) {
                    scope.zoomViewModal.show();
                    scope.ngSrc = attr.zoomSrc;
                    scope.page = scope.images.indexOf(scope.ngSrc);
                    $ionicSlideBoxDelegate.$getByHandle('my-zoom-handle').slide($index);
                };

                //change 
                scope.choose = function() {
                    scope.page = scope.images.indexOf(scope.ngSrc);
                    return scope.page;
                };

                scope.closeZoomView = function() {
                    scope.zoomViewModal.hide();
                };

                scope.next = function() {
                    if (scope.page == scope.images.length - 1) {
                        return;
                    } else {
                        scope.page++;
                        scope.ngSrc = scope.images[scope.page];
                    }
                };
                scope.pre = function() {
                    if (scope.page === 0) {
                        return;
                    } else {
                        scope.page--;
                        scope.ngSrc = scope.images[scope.page];
                    }
                };
            });
        }
    };
}])

.directive('zooms', ['$compile', '$window', '$ionicSlideBoxDelegate', '$ionicModal', '$ionicPlatform', function($compile, $window, $ionicSlideBoxDelegate, $ionicModal, $ionicPlatform) {
    return {
        restrict: "A",
        scope: {
            desc: "@"
        },
        link: function link(scope, elem, attr) {

            $ionicPlatform.ready(function() {

                scope.index = attr.index;
                elem.attr("ng-click", "showZooms({{index}})");
                elem.removeAttr("zooms");
                $compile(elem)(scope);

                var zoomsTemplate = '<ion-modal-view style="background-color: black;" class="zoom-view">' +
                    '<ion-content>' +
                    '<div style="margin-top: {{top}}px;">' +
                    '<ion-slide-box ng-click="closeZooms()" show-pager="false" delegate-handle="my-slide">' +
                    '<ion-slide ng-repeat="url in ngSrc">' +
                    '<div>' +
                    '<img ng-src="{{url}}" width="100%">' +
                    '<div style="color:#fff; font-size:16px; position:absolute; right:0; bottom:0px;">' + '{{ngSrc.indexOf(url)+1}}' + '/{{ngSrc.length}}' +
                    '</div>' +
                    '</div>' +
                    '</ion-slide>' +
                    '</ion-slide-box>' +
                    '</div>' +
                    '</ion-content>' +
                    '</ion-modal-view>';
                scope.zoomsModal = $ionicModal.fromTemplate(zoomsTemplate, {
                    scope: scope,
                    animation: "slide-in-up"
                });

                scope.showZooms = function(index) {
                    scope.zoomsModal.show();
                    console.log(index);
                    var imgs = angular.element(scope.desc).children();
                    var urls = [];
                    var heights = [];
                    var widthes = [];
                    for (var i = 0; i < imgs.length; i++) {
                        urls.push(imgs[i].src);
                        heights.push(imgs[i].height);
                        widthes.push(imgs[i].width);
                    }
                    scope.ngSrc = urls;
                    scope.height = ($window.innerWidth * heights[index]) / widthes[index];
                    scope.top = ($window.innerHeight - scope.height) / 2 - 44;
                    // console.log('innerHeight ' + $window.innerHeight);
                    // console.log('heights[index] ' + heights[index]);
                    // console.log('scope.height ' + scope.height);
                    // console.log('scope.top ' + scope.top);
                    $ionicSlideBoxDelegate.slide(index);
                };

                scope.closeZooms = function() {
                    scope.zoomsModal.hide();
                };
            });
        }
    };
}])

//隐藏底部tabs处理
.directive('hideTabs', ['$rootScope', function($rootScope) {
    return {
        restrict: 'A',
        link: function($scope, element, attributes) {
            $scope.$on('$ionicView.beforeEnter', function(e) {
                //$rootScope.hideTabs = true;
                $scope.$watch(attributes.hideTabs, function() {
                    $rootScope.hideTabs = true;
                });
            });
        }
    };
}])

.directive('compile', ['$compile', function($compile) {
    return function(scope, element, attrs) {
        scope.$watch(
            function(scope) {
                return scope.$eval(attrs.compile);
            },
            function(value) {
                element.html(value);
                $compile(element.contents())(scope);
            }
        );
    };
}])

//定义显示tab的showTabs指令
.directive('showTabs', ['$rootScope', function($rootScope) {
    return {
        restrict: 'A',
        link: function($scope, element, attributes) {
            $scope.$on('$ionicView.beforeEnter', function(e) {
                $scope.$watch(attributes.showTabs, function() {
                    $rootScope.hideTabs = false;
                });
            });

        }
    };
}])

//自动弹出键盘
.directive('focusMe', ['$timeout', function($timeout) {
    return {
        link: function(scope, element, attrs) {
            $timeout(function() {
                element[0].focus();
            });
        }
    };
}])

//处理键盘的搜索
.directive('ngEnter', ['Loader', function(Loader) {
    return function(scope, element, attrs) {
        element.bind("keydown keypress", function(event) {
            if (event.which === 13) {
                if (scope.search.content) {
                    scope.$apply(function() {
                        scope.$eval(attrs.ngEnter);
                    });
                    event.preventDefault();
                    scope.closeModal();
                } else {
                    Loader.toggleLoadingWithMessage('Search content cannot be empty.');
                }
            }
        });
    };
}])

.directive('ngSearch', ['Loader', function(Loader) {
    return function(scope, element, attrs) {
        element.bind("keydown keypress", function(event) {
            if (event.which === 13) {
                if (scope.search.content) {
                    scope.$apply(function() {
                        scope.$eval(attrs.ngSearch);
                    });
                } else {
                    Loader.toggleLoadingWithMessage('Search content cannot be empty.');
                }
            }
        });
    };
}])

.directive('imageOnload', ['Loader', function(Loader) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            element.bind('load', function() {

            });
            element.bind('error', function() {
                attrs.src = 'img/default.jpg'; //默认头像
                Loader.toggleLoadingWithMessage(attrs.src);
                scope.$apply();
            });
        }
    };
}])

.directive('mask', [function() {
    return {
        template: '<div class="mask"></div>',
        restrict: 'E',
        replace: true
    };
}])

.directive('formItem', ['$compile', function($compile) {
    return {
        restrict: 'E',
        scope: {
            modelValue: '='
        },
        template: '<div class="form-item">' +
            '<span ng-show="!show" ng-click="showInput()" class="place-holder">{{placeHolder}}</span>' +
            '<label class="item item-input item-stacked-label" ng-show="show">' +
            '<span class="input-label">{{placeHolder}}</span>' +
            '<input type="{{typeValue}}" ng-model="modelValue">' +
            '</label>' +
            '</div>',
        replace: true,
        link: function(scope, element, attrs) {
            scope.placeHolder = attrs.placeHolder;
            scope.show = false;
            scope.typeValue = attrs.typeValue;
            scope.showInput = function() {
                scope.show = true;
            };
        }
    };
}])

.directive('contenteditable', ['$window', function() {
    return {
        restrict: 'A',
        require: '?ngModel', // 此指令所代替的函数
        link: function(scope, element, attrs, ngModel) {
            if (!ngModel) {
                return;
            } // do nothing if no ng-model
            // Specify how UI should be updated
            ngModel.$render = function() {
                element.html(ngModel.$viewValue || '');
            };
            // Listen for change events to enable binding
            element.on('blur keyup change', function() {
                scope.$apply(readViewText);
            });
            // No need to initialize, AngularJS will initialize the text based on ng-model attribute
            // Write data to the model
            function readViewText() {
                var html = element.html();
                // When we clear the content editable the browser leaves a <br> behind
                // If strip-br attribute is provided then we strip this out
                if (attrs.stripBr && html === '<br>') {
                    html = '';
                }
                ngModel.$setViewValue(html);
            }
        }
    };
}])

.directive('comfirm', [function() {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            title: '@',
            content: '@',
            placeholder: '@',
            ok: '&',
            cancel: '&'
        },
        template: '<div class="promptBox">' +
            '<div class="promptTitle">{{title}}</div>' +
            '<div class="promptbody">' +
            '{{content}}' +
            '<p class="promptInputWrapper">' +
            '<input type="text" ng-model="value" maxlength="100" placeholder="{{placeholder}}" class="promptInput">' +
            '</p>' +
            '</div>' +
            '<div class="promptFooter">' +
            '<input type="button" value="确定" class="promptSureBtn" ng-click="ok({value: value})">' +
            '<input type="button" value="取消" class="promptCancelBtn" ng-click="cancel()">' +
            '<div class="clear-both"></div>' +
            '</div>' +
            '</div>'
    };
}]);