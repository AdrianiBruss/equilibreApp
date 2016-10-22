angular.module('starter.facebookService', [])

    .service('FacebookService', ['$window', '$state', '$rootScope', 'ApiService', '$ionicLoading',
        function ($window, $state, $rootScope, ApiService, $ionicLoading) {

        // [Facebook] : init service
        function facebookInit() {

            $window.fbAsyncInit = function () {
                FB.init({
                    appId: '1297400556958732',
                    status: true,
                    cookie: true,
                    xfbml: true,
                    version: 'v2.7'
                });
                facebookWatchLoginStatus();
            };

        }

        // [Facebook] : watching for login status
        function facebookWatchLoginStatus() {

            FB.getLoginStatus(function (response) {

                if (response.status === 'connected') {
                    // User connected

                    $rootScope.user = response;

                    var uid = response.authResponse.userID;
                    var accessToken = response.authResponse.accessToken;

                    // get profile datas from Facebook and login to API
                    getProfile(false);

                } else if (response.status === 'not_authorized') {
                    // User not authorized
                    console.log('not authorized');

                    $ionicLoading.hide();

                    $state.go('login');

                } else {
                    // User not logged in to Facebook
                    console.log('login');
                    $ionicLoading.hide();
                    $state.go('login');
                }
            });
        }

        // [Facebook] : Facebook logout
        // [API] : Logout user
        function facebookLogout() {
            FB.logout();
            ApiService.logoutUser($rootScope.user.accessToken)
        }

        // [Facebook] : Facebook register
        function facebookResgister(register) {
            FB.login(function (response) {

                if (response.authResponse) {
                    // User connected to Facebook

                    // get profile datas from Facebook and register to API
                    getProfile(register);

                } else {
                    // User cancelled login or did not fully authorize
                    $state.go('login')
                }
            }, {
                scope: 'email, read_custom_friendlists, user_friends',
                return: true
            });
        }

        // [Facebook] : get profile datas
        // [API] : Login or register User to API
        function getProfile(registerUser) {

            FB.api('/me?fields=id,name,email,picture,friends{picture,name}', function (response) {

                $rootScope.user = response;
                $rootScope.user['password'] = sha512_224(response.email+response.id);

                if (registerUser)
                    ApiService.registerUser($rootScope.user);
                else
                    ApiService.loginUser($rootScope.user);
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
