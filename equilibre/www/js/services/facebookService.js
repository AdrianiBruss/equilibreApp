angular.module('starter.facebookService', [])

    .service('FacebookService', ['$window', '$state', '$rootScope', 'ApiService', '$ionicLoading', 'ngFB',
        function ($window, $state, $rootScope, ApiService, $ionicLoading, ngFB) {

        // [Facebook] : init service
        // [Facebook] : watching for login status
        function facebookInit() {

            ngFB.getLoginStatus().then(function (response) {

                $ionicLoading.hide();

                if (response.status === 'connected') {
                    // User connected
                    $rootScope.user = response;

                    var uid = response.authResponse.userID;
                    var accessToken = response.authResponse.accessToken;

                    // get profile datas from Facebook and login to API
                    getProfile(false);

                } else if (response.status === 'not_authorized') {
                    // User not authorized
                    $state.go('login');

                } else {
                    // User not logged in to Facebook
                    $state.go('login');
                }
            },
            function (error) {
                $ionicLoading.hide();
                console.log('getLoginStatus', error);
            });
        }

        // [Facebook] : Facebook logout
        // [API] : Logout user
        function facebookLogout() {
            ngFB.logout();
            ApiService.logoutUser($rootScope.user.accessToken)
        }

        // [Facebook] : Facebook register
        function facebookResgister(register) {

            ngFB.login({scope: 'email, read_custom_friendlists, user_friends'}).then(
                function (response) {
                    $ionicLoading.hide();
                    if (response.status === 'connected') {
                        getProfile(register);

                    } else {
                        $state.go('login')
                    }
            });
        }

        // [Facebook] : get profile datas
        // [API] : Login or register User to API
        function getProfile(registerUser) {
            ngFB.api({
                path: '/me',
                params: {fields: 'id,name,email,picture.width(200),friends{picture.width(200),name},cover'}
            }).then(
            function (response) {
                $ionicLoading.hide();
                $rootScope.user = response;
                $rootScope.user['password'] = sha512_224(response.email+response.id);
                if (registerUser)
                    ApiService.registerUser($rootScope.user);
                else
                    ApiService.loginUser($rootScope.user);
            },
            function (error) {
                $ionicLoading.hide();
                console.log('Facebook error: ' + error.error_description);
            });
        }

        return {

            init: function () {
                return facebookInit()
            },
            login: function () {
                return facebookResgister(false)
            },
            logout: function () {
                return facebookLogout()
            },
            register: function(){
                return facebookResgister(true)
            }


        }

    }]);
