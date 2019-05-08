angular.module('ygoworld.services', [])


.factory('Socket', ['ServerConfiguration', 'socketFactory', function(ServerConfiguration, socketFactory) {
    var myIoSocket = io.connect(ServerConfiguration.socketUrl + '/ipos');

    var socket = socketFactory({
        ioSocket: myIoSocket
    });

    return socket;
}])

//显示过度动画或提示
.factory('Loader', ['$ionicLoading', '$timeout', function($ionicLoading, $timeout) {
    var LOADERAPI = {
        showLoading: function(text) {
            text = text || 'Loading...';
            $ionicLoading.show({
                template: text
            });
        },
        showEmptyLoading: function() {
            $ionicLoading.show();
        },
        hideLoading: function() {
            $ionicLoading.hide();
        },
        toggleLoadingWithMessage: function(text, timeout) {
            this.showLoading(text);

            $timeout(function() {
                $ionicLoading.hide();
            }, timeout || 3000);
        },
        noBgToast: function(text, timeout) {
            timeout = timeout || 2000;
            $ionicLoading.show({
                template: text,
                duration: timeout,
                noBackdrop: true
            })
        }
    };

    return LOADERAPI;
}])


//操作本地缓存
.factory('LSFactory', [function() {
    var LSAPI = {
        clear: function() {
            return localStorage.clear();
        },

        get: function(key) {
            return JSON.parse(localStorage.getItem(key));
        },

        set: function(key, data) {
            return localStorage.setItem(key, JSON.stringify(data));
        },


        delete: function(key) {
            return localStorage.removeItem(key);
        },

        getAll: function() {
            var cities = [];
            var items = Object.keys(localStorage);

            for (var i = 0; i < items.length; i++) {
                if (items[i] !== 'user' || items[i] != 'token') {
                    cities.push(JSON.parse(localStorage[items[i]]));
                }
            }

            return cities;
        }
    };
    return LSAPI;
}])

//身份认证
.factory('AuthFactory', ['LSFactory', function(LSFactory) {
    var userKey = 'user';
    var tokenKey = 'token';
    var AuthAPI = {
        isLoggedIn: function() {
            return this.getUser() === null ? false : true;
        },

        getUser: function() {
            return LSFactory.get(userKey); //从本地缓存获取用户信息
        },

        setUser: function(user) {
            return LSFactory.set(userKey, user);
        },

        getToken: function() {
            return LSFactory.get(tokenKey);
        },

        setToken: function(token) {
            return LSFactory.set(tokenKey, token);
        },

        deleteAuth: function() {
            LSFactory.delete(userKey);
            LSFactory.delete(tokenKey);
        }
    };
    return AuthAPI;
}])

.factory('QrcodesFactory', ['$http', 'ServerConfiguration', function($http, ServerConfiguration) {
    var API = {
        getQrcode: function(code) {
            return $http.get(ServerConfiguration.baseApiUrl + '/api/v1/qrcodes/' + code);
        }
    };

    return API;
}])

//扫码点菜获取商家信息
.factory('ScanOrderFactory', ['$http', 'ServerConfiguration', function($http, ServerConfiguration) {
        var API = {
            setOrderList: function(orderData) {
                return $http.post(ServerConfiguration.baseApiUrl + '/api/v1/orders', orderData);
            },
            pushNewOrderMessage: function(message) {
                return $http.post(ServerConfiguration.baseApiUrl + '/api/v3/push_messages', message);
            },
            getMerchantMenu: function(serviceId) {
                return $http.get(ServerConfiguration.baseApiUrl + '/api/v1/merchant_menus/' + serviceId);
            },
            getOrderListCurrent: function(data) {
                return $http.get(ServerConfiguration.baseApiUrl + '/api/v1/orders?merchant_id=' + data.merchant_id + '&position=' + data.position_id);
            }
        };
        return API;
    }])
    .factory('ServicesFactory', ['$http', 'ServerConfiguration', function($http, ServerConfiguration) {
        var perPage = 2;
        var page2 = 1;
        var similarNumber = 5;
        var per_page = 3;
        var API = {
            getServiceDetail: function(serviceId) {
                return $http.get(ServerConfiguration.baseApiUrl + '/api/v2/services/' + serviceId);
            },
            getServiceFav: function(userId, serviceId) {
                return $http.get(ServerConfiguration.baseApiUrl + '/api/v1/favorites/isFavorite?user_id=' + userId + '&service_id=' + serviceId);
            }
        };

        return API;
    }])


.factory('CommentsFactory', ['$http', 'ServerConfiguration', function($http, ServerConfiguration) {
    var perPage = 5;
    //var page = 1;
    var API = {
        getRatingAndComments: function(serviceId, page) {
            return $http.get(ServerConfiguration.baseApiUrl + '/api/v1/servicerates?service_id=' + serviceId);
        }
    };

    return API;
}])

.factory('IposFactory', ['$http', 'ServerConfiguration', function($http, ServerConfiguration) {
    var API = {
        printVoucher: function(item) {
            return $http.post(ServerConfiguration.socketUrl + '/api/v3/ipos_vouchers', item);
        }
    };

    return API;
}])

.factory('PayCodeFactory', ['$http', 'ServerConfiguration', function($http, ServerConfiguration) {
    var API = {
        configureMUrl: function() {
            return $http.get(ServerConfiguration.baseApiUrl + '/api/v1/configures/MPAYURL');
        },
        configureGetPayNo: function() {
            return $http.get(ServerConfiguration.baseApiUrl + '/api/v1/configures/PAYNO');
        },
        directPay: function(data) {
            return $http.post(ServerConfiguration.baseApiUrl + '/api/v1/direct_pays', data)
        }

    }
    return API;
}])

// 企鹅卡创建订单服务，得到订单服务
.factory('pguinCard',['$http','ServerConfiguration',function ($http,ServerConfiguration) {
    var API = {
        createPguinOrder: function (params) {
            return $http.post(ServerConfiguration.baseApiUrl+'/api/v1/pguin_refills',params);
        },
        getPguninOrder: function (id) {
            return $http.get(ServerConfiguration.baseApiUrl+'/api/v1/pguin_refills/' + id);
        },
        createWechatOrder: function (params) {
            return $http.post(ServerConfiguration.baseApiUrl+'/wxpay/unifiedorder' , params);
        },
        testPenguinNumber: function (msisdn) {
            return $http.get(ServerConfiguration.baseApiUrl+'/pguin/gwv1/check/' + msisdn);
        }
    }
    return API;
}])

//IKM创建订单服务，得到订单服务
.factory('ikmCard',['$http','ServerConfiguration',function ($http,ServerConfiguration) {
    var API = {
        createIkmOrder: function (params) {
            return $http.post(ServerConfiguration.baseApiUrl+'/api/v1/ikm_refills',params);
        },
        getIkmOrder: function (id) {
            return $http.get(ServerConfiguration.baseApiUrl+'/api/v1/ikm_refills/' + id);
        },
        getIkmOrderFromIkm: function (id) {
            return $http.get(ServerConfiguration.baseApiUrl+'/ikmgw/v1/ikmrefills/' + id);
        },
        createWechatOrder: function (params) {
            return $http.post(ServerConfiguration.baseApiUrl+'/wxpay/unifiedorder' , params);
        }
    }
    return API;
}])

// 印尼话费充值
.factory('IkmFactory', ['$http', 'ServerConfiguration', 'DevServerConfiguration', function ($http, ServerConfiguration, DevServerConfiguration) {
    var API = {
        // 创建订单
        createOrder: function (data) {
            return $http.post(DevServerConfiguration.baseApiUrl + '/api/v1/ikm_refills', data)
        }
    };
    return API;
}]);