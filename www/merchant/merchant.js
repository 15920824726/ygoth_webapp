angular.module('merchant')
    .controller('MerchantCtrl', ['$scope', '$stateParams', '$ionicSlideBoxDelegate', '$ionicHistory', 'ServicesFactory', '$state', 'CommentsFactory', '$rootScope', 'AuthFactory', '$timeout', 'ServerConfiguration', '$ionicScrollDelegate', '$translate',
        function($scope, $stateParams, $ionicSlideBoxDelegate, $ionicHistory, ServicesFactory, $state, CommentsFactory, $rootScope, AuthFactory, $timeout, ServerConfiguration, $ionicScrollDelegate, $translate) {
            $scope.service = [];
            $scope.comments = [];
            $scope.AMapId = "amap-container-service";
            $scope.mapObj = null; //
            $scope.mapObj2 = null; //存放初始化的地图对象
            $scope.serviceTag = "";
            var page = 1;
            $scope.showsub = false;
            $scope.hasRemark = false;
            $scope.moredata = false;
            $scope.fav = false;
            $scope.serviceDesc = "";
            $scope.images = [];
            $scope.feedback = {
                user_id: '',
                service_id: '',
                content: ''
            };
            $scope.showShare = false;
            $scope.unfavL = true;
            $scope.snippet = '';
            $scope.length = 0;
            $scope.showMenu = false;
            $scope.sendUmeng = false;

            $scope.longitude = '';
            $scope.latitude = '';

            $scope.service = {
                title: '',
                zhtitle: '',
                avg_expense: '',
                cn_addr: '',
                nearest_transport: '',
                contact_no: '',
                sub_category_name: '',
                website: '',
                rating: '',
                show_date: '',
                show_time: '',
                entry_time: '',
                price: '',
                children_notice: '',
                service_type: 20
            };

            $scope.serviceId = $stateParams.merchantId;

            $scope.base = ServerConfiguration.baseApiUrl;
            var currentUser = AuthFactory.getUser();
            $rootScope.containerNo = $rootScope.containerNo + 1;
            $scope.containerNumber = $rootScope.containerNo;
            $scope.today = [];

            //进入详情页，获取当前的时间
            var now = new Date();
            $scope.score = 0;
            //多语言支持
            $scope.translations = null;
            $translate([
                'LOAD_DATA_FAILED',
                'SUCCESS_TO_RATE',
                'PLEASE_LOGIN',
                'HAD_RATE',
                'REGISTER_AND_PROMPT',
                'SERVICE_DETAIL_TITLE',
                'CONTACT_NO',
                'BUSINESS_TIME_DETAIL',
                'HOW_TO_GO',
                'TAXI_CARD',
                'COMMENTS',
                'ALL_COMMENTS',
                'TODAY',
                'NOT_IN_BUSINESS',
                'OPEN_HOURS',
                'SERVICE_DETAIL_TAB_TITLE',
                'SERVICE_DETAIL_AVERAGE',
                'SERVICE_SUPPORT_PARKING_LOT',
                'SERVICE_SUPPORT_FOOD_DELIVERY',
                'SERVICE_DETAIL_SORT_TITLE_ADDRESS',
                'SERVICE_DETAIL_SORT_SUBTITLE_TRANSPORTATION',
                'SERVICE_DETAIL_SORT_TITLE_INFORMATION',
                'SERVICE_DETAIL_CALL',
                'OPEN_NOW_SIGN',
                'SERVICE_DETAIL_SORT_SUBTITLE_BRIEF',
                'SERVICE_DETAIL_VIEW_ALL',
                'SERVICE_DETAIL_WRITING_PROMPT',
                'RATING_MODAL_SCORE',
                'RATING_MODAL_PLACEHOLDER',
                'POST_YOUR_COMMENT',
                'SERVICE_DETAIL_SORT_TITLE_NOTICE',
                'SERVICE_DETAIL_SHOW_DATE',
                'SERVICE_DETAIL_SHOW_TIME',
                'SERVICE_DETAIL_ENTRY_TIME',
                'SERVICE_DETAIL_PRICE',
                'SERVICE_DETAIL_CHILDREN_NOTICE',
                'PERSON',
                'CANCEL',
                'CLOSED',
                'ASSISTANT_RECORD_DETAIL_TITLE',
                'CHINESE_ORDER',
                'NO_COMMENT',
                'SERVICE_DETAIL_ACTOR_ADDRESS',
                'WECHAT_FRIENT',
                'WECHAT_CIRCLE',
                'SHARE',
                'APPOINT_NOW',
                'APPOINT_PROMOTION'
            ]).then(function(data) {
                $scope.translations = data;
            }, function(translationIds) {
                $scope.translations = translationIds;
            });

            $scope.back = function() {
                if ($ionicHistory.backView() == null || $ionicHistory.backView().stateName == 'qrscan') {
                    $ionicHistory.nextViewOptions({
                        disableBack: true
                    });
                    if ($stateParams.categoryId || $stateParams.cityId) {
                        $state.go('tab.category-detail', {
                            categoryId: $stateParams.categoryId,
                            cityId: $stateParams.cityId
                        });
                    } else {
                        $state.go('tab.home');
                    }
                } else {
                    $ionicHistory.goBack(-1);
                }
            };

            var tur = true;

            function scrollOnce() {
                var scrollHeight = $ionicScrollDelegate.getScrollPosition();
                var innerWidth = window.innerWidth;
                var positionY = innerWidth * 3 / 4;

                var initHeight = parseInt(positionY / 10);
                if (scrollHeight.top < initHeight) {
                    $('.service-detail .service-header').css('background', 'linear-gradient(to bottom,rgba(0,0,0,0.5) 0%,rgba(255,255,255,0) 100%)');
                    setWhiteButton();
                } else if (initHeight < scrollHeight.top && scrollHeight.top < initHeight * 2) {
                    $('.service-detail .service-header').css('background', 'linear-gradient(to bottom,rgba(0,0,0,0.4) 0%,rgba(255,255,255,0.1) 100%)');
                    setWhiteButton();
                } else if (initHeight * 2 < scrollHeight.top && scrollHeight.top < initHeight * 3) {
                    $('.service-detail .service-header').css('background', 'linear-gradient(to bottom,rgba(0,0,0,0.3) 0%,rgba(255,255,255,0.2) 100%)');
                    setWhiteButton();
                } else if (initHeight * 3 < scrollHeight.top && scrollHeight.top < initHeight * 4) {
                    $('.service-detail .service-header').css('background', 'linear-gradient(to bottom,rgba(0,0,0,0.2) 0%,rgba(255,255,255,0.3) 100%)');
                    setWhiteButton();
                } else if (initHeight * 4 < scrollHeight.top && scrollHeight.top < initHeight * 5) {
                    $('.service-detail .service-header').css('background', 'linear-gradient(to bottom,rgba(0,0,0,0.1) 0%,rgba(255,255,255,0.4) 100%)');
                    setWhiteButton();
                } else if (initHeight * 5 < scrollHeight.top && scrollHeight.top < initHeight * 6) {
                    $('.service-detail .service-header').css('background', 'linear-gradient(to bottom,rgba(255,255,255,0.5) 0%,rgba(255,255,255,1) 100%)');
                    setBlackButton();
                } else if (initHeight * 6 < scrollHeight.top && scrollHeight.top < initHeight * 7) {
                    $('.service-detail .service-header').css('background', 'linear-gradient(to bottom,rgba(255,255,255,0.6) 0%,rgba(255,255,255,1) 100%)');
                    setBlackButton();
                } else if (initHeight * 7 < scrollHeight.top && scrollHeight.top < initHeight * 8) {
                    $('.service-detail .service-header').css('background', 'linear-gradient(to bottom,rgba(255,255,255,0.7) 0%,rgba(255,255,255,1) 100%)');
                    setBlackButton();
                } else if (initHeight * 8 < scrollHeight.top && scrollHeight.top < initHeight * 9) {
                    $('.service-detail .service-header').css('background', 'linear-gradient(to bottom,rgba(255,255,255,0.8) 0%,rgba(255,255,255,1) 100%)');
                    setBlackButton();
                } else if (initHeight * 9 < scrollHeight.top && scrollHeight.top < initHeight * 10) {
                    $('.service-detail .service-header').css('background', 'linear-gradient(to bottom,rgba(255,255,255,0.9) 0%,rgba(255,255,255,1) 100%)');
                    setBlackButton();
                } else {
                    $('.service-detail .service-header').css('background', 'linear-gradient(to bottom,rgba(255,255,255,1) 0%,rgba(255,255,255,1) 100%)');
                    setBlackButton();
                }

                if (scrollHeight.top > positionY) {
                    $timeout(function() {
                        $scope.showsub = true;
                        $scope.$apply();
                        $('.service-detail .service-header').css('background-color', 'rgba(255,255,255,1)');
                    }, 10);
                } else {
                    $timeout(function() {
                        $scope.showsub = false;
                        $scope.$apply();
                    }, 10);
                }
                tur = true;
            }

            function setWhiteButton() {
                // $('.service-detail .service-header .icon-return-bold').css('color', '#ffffff');
                $scope.unfavL = true;
            }

            function setBlackButton() {
                // $('.service-detail .service-header .icon-return-bold').css('color', '#3a3a3a');
                $scope.unfavL = false;
            }

            function testPosition() {
                var scrollHeight = $ionicScrollDelegate.getScrollPosition();
                var innerWidth = window.innerWidth;
                var positionY = innerWidth * 3 / 4;

                var initHeight = parseInt(positionY / 10);
                if (0 <= scrollHeight.top && scrollHeight.top < initHeight * 5) {
                    //$('.service-detail .service-header .icon-collect').css('color', '#ffffff');
                    return $scope.unfavL = true;
                } else {
                    return $scope.unfavL = false;
                }
            }

            document.querySelector(".service-detail .service-detail-content").onscroll = function() {
                if (tur) {
                    setTimeout(scrollOnce, 10);
                    tur = false;
                } else {

                }
            };

            //取出star rating
            //判断是否已经打过星
            var havePickStar = function() {
                for (i = 0; i < $scope.service.servicerates.length; i++) {
                    if ($scope.service.servicerates[i].user_id == currentUser.id) {
                        $scope.starState = false; //代表评过分
                    }
                }
            };

            function isJSON(str) {
                if (typeof str == 'string') {
                    try {
                        JSON.parse(str);
                        return true;
                    } catch (e) {
                        return false;
                    }
                }
            }

            ServicesFactory.getServiceDetail($scope.serviceId).success(function(data) {
                $scope.service = data.data.service;
                $scope.serviceDesc = data.data.service.description;
                $scope.images = data.data.service.attachments;
                $ionicSlideBoxDelegate.update(); //显示轮播图片

                //判断是否有service_bookings字段
                if ($scope.service.service_bookings) {
                    appointment();
                }

                //判断已经取得商家名字，可以向友盟发请求
                $scope.sendUmeng = true;

                //服务类型：商家20/表演10
                $scope.service_type = $scope.service.service_type;
                //显示其他服务
                var other_service = $scope.service.other_service;
                if (isJSON(other_service)) {
                    other_service = JSON.parse(other_service);
                }
                showOtherServices(other_service.data);
                //显示支付方式
                var payment_methods = $scope.service.payment_methods;
                if (isJSON(payment_methods)) {
                    payment_methods = JSON.parse(payment_methods);
                }
                showPaymentMethods(payment_methods.data);
                //表演的社交帐号的信息
                var social_contacts = $scope.service.social_contacts;
                if (isJSON(social_contacts)) {
                    social_contacts = JSON.parse(social_contacts);
                }
                showSocialContacts(social_contacts.data);
                // 判断是否是商家服务
                if ($scope.service_type == 20) {
                    var business_time = data.data.service.business_time;
                    if (isJSON(business_time)) {
                        business_time = JSON.parse(business_time);
                    }
                    showBusinessTime(business_time.data);
                }

                //是否显示菜单
                // if (data.data.service.menu !== null) {
                $scope.showMenu = true;
                // }

                if ($rootScope.isAuthenticated) {
                    $scope.starState = true; //代表没评分
                    havePickStar();
                }
                //当设置了service的坐标才显示地图
                $scope.showMap = false;
                if ($scope.service.longitude !== null && $scope.service.latitude !== null && $scope.service.longitude !== '' && $scope.service.latitude !== '') {
                    $timeout(function() {
                        getLocationByLatitude($scope.service.latitude, $scope.service.longitude);
                    }, 20);
                }

            }).error(function(data) {

            });

            //处理预约优惠的内容显示
            function appointment() {
                $scope.appointDiscount = JSON.parse($scope.service.service_bookings[0].promotions);
                $scope.appointLength = $scope.appointDiscount.filter(function(item, index) {
                    return item.content;
                });
            }


            // getLocationByLatitude(39.914850, 116.403765);
            //地图处理函数
            function getLocationByLatitude(latitude, longitude) {
                // var myLatLng = {
                //     lat: parseFloat(latitude),
                //     lng: parseFloat(longitude)
                // };
                // var map = new google.maps.Map(document.getElementById('container-123'), {
                //     zoom: 15,
                //     center: myLatLng
                // });
                //
                // var marker = new google.maps.Marker({
                //     position: myLatLng,
                //     map: map,
                // });
                //
                // marker.setMap(map);
                /*
                    百度地图
                 */

                var map = new BMap.Map("container-123");
                //var point = new BMap.Point(116.404, 39.915);
                var point = new BMap.Point(parseFloat(longitude), parseFloat(latitude));
                map.centerAndZoom(point, 15);
                var marker = new BMap.Marker(point); // 创建标注
                map.addOverlay(marker); // 将标注添加到地图中
                map.disableDragging(); //禁止拖拽
                map.disableDoubleClickZoom(); //禁用双击放大
                map.disablePinchToZoom();

                /*
                  腾讯地图的 Javascript API
                 */
                //var center = new qq.maps.LatLng(parseFloat(latitude), parseFloat(longitude));
                // var center = new qq.maps.LatLng(39.914850, 116.403765);
                // //var center = new qq.maps.LatLng(13.815752, 100.598037);
                // var map = new qq.maps.Map(
                //   document.getElementById("container-123"),
                //   {
                //     center: center,
                //     zoom: 13,
                //     draggable: false,
                //     scrollwheel: false,
                //     disableDoubleClickZoom: false
                //   }
                // );
                // var marker = new qq.maps.Marker({
                //   position: center,
                //   map: map
                // });
            }

            $("#container").bind("DOMNodeInserted", function(e) {
                var tempCount = 0;
                $("#container .smnoprint").siblings().each(function() {
                    tempCount++;
                    if (tempCount == 2 || tempCount == 3) {
                        $(this).remove();
                    }
                });
            });

            //获取该service的评价等级信息
            CommentsFactory.getRatingAndComments($scope.serviceId, 1).success(function(data) {
                $scope.total_count = data.paginate_meta.total_count;
                if ($scope.total_count > 0) {
                    $scope.hasRemark = true;
                    $scope.rateone = data.data.servicerates[0];
                    if ($scope.rateone.user.avatar.indexOf("missing.png") < 0) {
                        $scope.avatar = $scope.base + $scope.rateone.user.avatar;
                    } else {
                        if ($scope.rateone.user.headimgurl) {
                            $scope.avatar = $scope.rateone.user.headimgurl;
                        } else {
                            $scope.avatar = $scope.base + $scope.rateone.user.avatar;
                        }
                    }
                } else {
                    // $scope.create_date = "";
                    // $scope.rateone = {
                    //     content: "",
                    //     rate: 0
                    // };
                    $scope.hasRemark = false;
                }
            }).error(function(data) {

            });

            $scope.goDownload = function() {
                window.location.href = "http://android.myapp.com/myapp/detail.htm?apkName=com.ygoworld.ygoth";
            };

            $scope.loadAvatar = function() {
                $timeout(function() {
                    $scope.rateone.user.headimgurl ? ($scope.avatar = $scope.rateone.user.headimgurl) : ($scope.avatar = 'img/smile-face@3x.jpg');
                }, 50);
            };

            //查询该service是否被收藏
            if ($rootScope.isAuthenticated) {
                $scope.user = AuthFactory.getUser();
                $scope.feedback.user_id = $scope.user.id;
                ServicesFactory.getServiceFav($scope.user.id, $scope.serviceId).success(function(data) {
                    //$scope.favorite = data.favorite;
                    if (data.favorite) {
                        $scope.fav = true;
                    } else {
                        $scope.fav = false;
                    }
                }).error(function(data) {

                });
            }
            $scope.mark = function(num) {
                $scope.score = num;
            };

            $scope.remark = {
                content: ""
            };
            $scope.$watch('remark.content', function(newValue, oldValue) {
                if (newValue && newValue != oldValue) {
                    if (newValue.length >= 100) {
                        $scope.remark.content = newValue.substr(0, 100); // 这里截取有效的150个字符
                    }
                }
            });


            // //显示社交帐号的详细信息
            function showSocialContacts(social_contacts) {
                $scope.wechat = '';
                $scope.line = '';
                $scope.facebook = '';
                $scope.instagram = '';
                for (var i = 0; i < social_contacts.length; i++) {
                    if (social_contacts[i].name == "Wechat") {
                        $scope.wechat = social_contacts[i].value;
                    } else if (social_contacts[i].name == 'LINE') {
                        $scope.line = social_contacts[i].value;
                    } else if (social_contacts[i].name == 'Facebook') {
                        $scope.facebook = social_contacts[i].value;
                    } else if (social_contacts[i].name == 'Instagram') {
                        $scope.instagram = social_contacts[i].value;
                    }
                }
            }

            // 显示营业时间和判断是否正在营业
            function showBusinessTime(business_time) {
                // 模态框给当天星期几加红色框
                $scope.today_week = getWeek(now.getDay());
                $scope.business_time = deletEmptyTime(business_time);
                if ($scope.business_time == "") {
                    $scope.isOpen = false;
                    return;
                }
                if ($scope.business_time[$scope.today_week].time.length) {
                    $scope.isOpen = isOpen($scope.business_time[$scope.today_week].time, now);
                } else {
                    $scope.isOpen = false;
                }
            }
            //删除营业时间数据空的数据，方便页面显示
            function deletEmptyTime(data) {
                for (var i = 0; i < data.length; i++) {
                    for (var j = 0; j < data[i].time.length; j++) {
                        if (data[i].time[j].start == "" || data[i].time[j].end == "") {
                            if (j == 0) {
                                data[i].time.splice(j, 3);
                                break;
                            } else if (j == 1) {
                                data[i].time.splice(j, 2);
                                break;
                            } else if (j == 2) {
                                data[i].time.splice(j, 1);
                                break;
                            }
                        }
                    }
                }
                return data;
            }
            //获取今天是星期几
            function getWeek(week) {
                if (week == 0) {
                    return 6;
                } else {
                    return week - 1;
                }
            }
            // 判断是否正在营业
            function isOpen(today_business_times, now) {
                var h = now.getHours().toString();
                var m = now.getMinutes().toString();
                if (m < 10) {
                    m = "0" + m;
                }
                if (h < 10) {
                    h = "0" + h;
                }

                var timeStr = h + m;

                if (parseInt(today_business_times[0].end.replace(':', '')) == 0) {
                    if (parseInt(today_business_times[0].start.replace(':', '')) < parseInt(timeStr) && 2400 > parseInt(timeStr)) {
                        return true;
                    }
                } else {
                    if (parseInt(today_business_times[0].start.replace(':', '')) < parseInt(timeStr) && parseInt(today_business_times[0].end.replace(':', '')) > parseInt(timeStr)) {
                        return true;
                    }
                }

                return false;
            }


            //显示支付方式
            function showPaymentMethods(payment_methods) {
                $scope.select_payment = [];
                for (var i = 0; i < payment_methods.length; i++) {
                    if (payment_methods[i].selected) {
                        $scope.select_payment.push(payment_methods[i].name);
                    }
                }
                return $scope.select_payment;
            }

            function showOtherServices(other_service) {
                $scope.select_service = [];
                for (var i = 0; i < other_service.length; i++) {
                    if (other_service[i].selected) {
                        $scope.select_service.push(other_service[i].name);
                    }
                }
                return $scope.select_service;
            }

        }
    ])