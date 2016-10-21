angular.module('starter.apiService', [])

    .service('ApiService', ['$window', '$state', 'lbConfig', '$http', '$q', '$rootScope', '$ionicLoading', 'SocketService',
    function ($window, $state, lbConfig, $http, $q, $rootScope, $ionicLoading, SocketService) {

        // ------------------------------------
        // [API] : Call to API
        function APIRequest(method, url, data, methodName) {

            var defer = $q.defer();
            // console.log('APIRequest : ', method, url, data)

            $http({
                method: method,
                url: lbConfig.url + url,
                data: data,
                dataType: 'JSONP'
            }).then(function successCallback(response) {

                switch(methodName) {
                    case 'loginUser':
                        setUser(response.data)
                    break;
                    case 'logout':
                        $state.go('login');
                    break;
                    default:
                        console.log('switch default')
                    break;

                }

                defer.resolve(response.data);
                $ionicLoading.hide()

            }, function errorCallback(response) {
                console.log(response)
                defer.reject(response);

                // console.error(response.data.error.details.messages['username'][0])
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

            SocketService.connection($rootScope.user.id)

            $state.go('home');

        }


        return {
            addQuestion: function (question) {
                return APIRequest('POST', '/Questions', question, 'addQuestion');
            },
            getQuestions: function(accessToken) {
                return APIRequest('GET', '/Players/'+$rootScope.user.userId+'/questions?filter={"where":{"status":true}}&access_token='+accessToken, '', 'getQuestions')
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
            answerQuestion(answer, id) {
                return APIRequest('PUT', '/Questions/'+ id, answer, 'answerQuestion')
            }

        }


    }]);
