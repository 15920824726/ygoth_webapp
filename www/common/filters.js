angular.module('ygoworld.filters', [])

.filter('ellipsis', function() {
    return function(text, length ,detail) {
        if (text) {
            var text1 = text.toString();
            if (text1.length > length) {
                if(text1.substr(length-1,1)=='<' || text1.substr(length-1,1)=='&'){
                    return text1.substr(0, length-1) + "..." +'<span class="detail">'+detail+'</span>';
                }
                if(text1.substr(length-2,2)=='<p' || text1.substr(length-2,2)=='</' || text1.substr(length-2,2)=='&n') {
                    return text1.substr(0, length-2) + "..." +'<span class="detail">'+detail+'</span>';
                }
                if(text1.substr(length-3,3)=='</p' || text1.substr(length-3,3)=='&nb'){
                    return text1.substr(0, length-3) + "..." +'<span class="detail">'+detail+'</span>';
                }
                if(text1.substr(length-4,4)=='&nbs'){
                    return text1.substr(0, length-4) + "..."+'<span class="detail">'+detail+'</span>';
                }
                return text1.substr(0, length) + "..."+'<span class="detail">'+detail+'</span>';
            }
            return text1 +'<span class="detail">'+detail+'</span>';
        } else {
            return '';
        }
    };
})

.filter('numbertok', function() {
    return function(text) {
        if (text) {
            var number1 = Number(text);
            if (number1 >= 1000) {
                var number2 = parseInt(number1 / 1000);
                return number2.toString() + " k";
            }
            return text;
        } else {
            return '';
        }
    };
})

//日期为今天的数据
.filter('today', function() {
    return function(inputData) {
        var array = [];
        var today = new Date();
        for (var i = 0; i < inputData.length; i++) {
            if (inputData[i].created_at == today.getDate()) {
                array.push(inputData[i]);
            }
        }

        return array;
    };
})

.filter('floor', [function() {
    return function(input) {
        return Math.floor(input);
    };
}])

.filter('twoDecimal', [function() {
    return function(input) {
        var x = parseFloat(input);
        if (isNaN(x)) {
            return input;
        }
        var f_x = Math.round(x * 100) / 100;
        var s_x = f_x.toString();
        var pos_decimal = s_x.indexOf('.');
        if (pos_decimal < 0) {
            pos_decimal = s_x.length;
            s_x += '.';
        }
        while (s_x.length <= pos_decimal + 2) {
            s_x += '0';
        }
        return s_x;
    };
}])

.filter('searchCountries', function() {
    return function(items, query) {
        var filtered = [];
        var letterMatch = new RegExp(query, 'i');
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            if (query) {
                if (letterMatch.test(item.name.substring(0, query.length))) {
                    filtered.push(item);
                }
            } else {
                filtered.push(item);
            }
        }
        return filtered;
    };
})

.filter('tags', ['$sce', function($sce) {
    return function(text, length) {
        return $sce.trustAsHtml(text);
    };
}])

.filter('to_trusted', ['$sce', function($sce) {
    return function(text) {
        return $sce.trustAsHtml(text);
    };
}]);