angular.module('starter.apiService', [])

    .service('ApiService', ['$window', '$state', 'lbConfig', '$http', function ($window, $state, lbConfig, $http) {

        // ------------------------------------
        function APIRequest(method, url, data) {

            $http({
                method: method,
                url: lbConfig.url + url,
                data: data,
                dataType: 'JSONP'
            }).then(function successCallback(response) {
                console.log(response)

            }, function errorCallback(response) {
                console.log(response)

            });
        }


        return {
            addQuestion: function(question) {
                return APIRequest('POST', '/Questions', question);
            }

        }



    }]);
