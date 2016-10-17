angular.module('starter.apiService', [])

    .service('ApiService', ['$window', '$state', 'lbConfig', '$http', function ($window, $state, lbConfig, $http) {

        // ------------------------------------
        function APIRequest(method, url, data) {

            console.log('APIRequest : ', method, url, data)

            $http({
                method: method,
                url: lbConfig.url + url,
                data: data,
                dataType: 'JSONP'
            }).then(function successCallback(response) {
                console.log(response)

                $state.go('home');

            }, function errorCallback(response) {
                console.log(response)

            });
        }

        function registerUser(user) {


            console.log('TODO:: resgister user', user)

            var newUser = {
                name:               user.name,
                username:           user.name,
                email:              user.email,
                password:           'password',
                facebookId:         user.id,
                profilePicture:     user.picture.data.url

            };

            APIRequest('POST', '/Players', newUser)

        }


        return {
            addQuestion: function (question) {
                return APIRequest('POST', '/Questions', question);
            },
            getQuestions: function(user) {
                // return APIRequest('')
            },
            registerUser: function (user) {
                return registerUser(user)
            },
            loginUser: function(user) {
                return APIRequest('POST', '/Players/login', user)
            }

        }


    }]);
