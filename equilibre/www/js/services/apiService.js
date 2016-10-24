angular.module('starter.apiService', [])

    .service('ApiService', ['$window', '$state', 'lbConfig', '$http', '$q', '$rootScope', '$ionicLoading', 'SocketService',
    function ($window, $state, lbConfig, $http, $q, $rootScope, $ionicLoading, SocketService) {

        // ------------------------------------
        // [API] : Call to API
        function APIRequest(method, url, data, methodName, scopeData) {

            var defer = $q.defer();

            $http({
                method: method,
                url: lbConfig.url + url,
                data: data,
                dataType: 'JSONP'
            }).then(function successCallback(response) {

                switch(methodName) {
                    case 'loginUser':
                        setUser(response.data);
                        break;
                    case 'logout':
                        $state.go('login');
                        break;
                    case 'getStatsQuestion':
                        putStatQuestion(response.data.stats, scopeData);
                        break;
                    case 'putStatsQuestion':
                        break;
                    case 'addQuestion':
                        $state.go('tab.account');
                        break;
                    default:
                        break;

                }

                defer.resolve(response.data);
                $ionicLoading.hide()

            }, function errorCallback(response) {
                defer.reject(response);

            });

            return defer.promise;
        }

        // [API] : Register new user
        function registerUser(user) {

            var newUser = {
                name:               user.name,
                username:           user.name,
                email:              user.email,
                password:           user.password,
                facebookId:         user.id,
                profilePicture:     user.picture.data.url

            };

            APIRequest('POST', '/Players', newUser, 'loginUser')

        }


        // [Socket] : Connect user to socket
        function setUser(data) {

            $rootScope.user['userId']       = data.userId;
            $rootScope.user['accessToken']  = data.id;

            SocketService.connection($rootScope.user.id);

            $state.go('home');

        }

        function putStatQuestion(stats, data) {

            var statTrue;
            var statFalse;
            (stats[0] == undefined) ? statTrue = 0 : statTrue = stats[0];
            (stats[1] == undefined) ? statFalse = 0 : statFalse = stats[1];

            var newstat = {"stats": [statTrue, statFalse]};

            if (data[0]) {
                newstat.stats[0] = newstat.stats[0] + 1
            }else {
                newstat.stats[1] = newstat.stats[1] + 1
            }

            APIRequest('PUT', '/Questions/'+ data[1], newstat, 'putStatsQuestion')
        }

        return {
            addQuestion: function (question) {
                return APIRequest('POST', '/Questions', question, 'addQuestion');
            },
            getQuestions: function(accessToken) {
                return APIRequest('GET', '/Players/'+$rootScope.user.userId+'/questions?access_token='+accessToken, '', 'getQuestions')
                // filter={"where":{"status":true}}
            },
            getUser: function (accessToken) {
                return APIRequest('GET', '/Players/'+$rootScope.user.userId+'?access_token='+accessToken, '', 'getQuestions')
            },
            updateUser: function (accessToken, data) {
                return APIRequest('PUT', '/Players/'+$rootScope.user.userId+'?access_token='+accessToken, data, 'getQuestions')
            },
            registerUser: function (user) {
                return registerUser(user)
            },
            loginUser: function(user) {
                return APIRequest('POST', '/Players/login', user, 'loginUser')
            },
            logoutUser: function(accessToken) {
                return APIRequest('POST', '/Players/logout?access_token='+accessToken, '', 'logout')
            },
            getStatsQuestion: function(answer, id) {
                return APIRequest('GET', '/Questions/'+ id, '', 'getStatsQuestion', [answer, id])
            }

        }


    }]);
