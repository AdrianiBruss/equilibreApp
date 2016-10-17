angular.module('starter.apiService', [])

    .service('ApiService', ['$window', '$state', 'lbConfig', '$http', '$rootScope', function ($window, $state, lbConfig, $http, $rootScope) {

        // ------------------------------------
        function APIRequest(method, url, data) {

            // console.log('APIRequest : ', method, url, data)

            $http({
                method: method,
                url: lbConfig.url + url,
                data: data,
                dataType: 'JSONP'
            }).then(function successCallback(response) {
                // console.log(response)

                if ( response.data.userId ) {
                    $rootScope.user['userId'] = response.data.userId;
                    $rootScope.user['accessToken'] = response.data.id;
                    console.log('$rootScope.user', $rootScope.user);
                }

                console.log('data', response.data)
                // $state.go('home');

            }, function errorCallback(response) {

                console.log(response)

                // console.error(response.data.error.details.messages['username'][0])


            });
        }

        function registerUser(user) {

            var newUser = {
                name:               user.name,
                username:           user.name,
                email:              user.email,
                password:           user.password,
                facebookId:         user.id,
                profilePicture:     user.picture.data.url

            };

            APIRequest('POST', '/Players', newUser)

        }


        return {
            addQuestion: function (question) {
                return APIRequest('POST', '/Questions', question);
            },
            getQuestions: function(accessToken) {
                return APIRequest('GET', '/Players/'+$rootScope.user.userId+'/questions?filter={"where":{"status":true}}&access_token='+accessToken, '')
            },
            registerUser: function (user) {
                return registerUser(user)
            },
            loginUser: function(user) {
                return APIRequest('POST', '/Players/login', user)
            }

        }


    }]);
