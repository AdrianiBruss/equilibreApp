angular.module('starter.facebookService', [])

    .service('FacebookService', ['$window', '$state', '$rootScope', 'ApiService', '$ionicLoading',
        function ($window, $state, $rootScope, ApiService, $ionicLoading) {

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

        function facebookWatchLoginStatus() {

            FB.getLoginStatus(function (response) {

                if (response.status === 'connected') {
                    // console.log('connected');

                    $rootScope.user = response;

                    var uid = response.authResponse.userID;
                    var accessToken = response.authResponse.accessToken;

                    getProfile(false);

                    // $state.go('home');

                } else if (response.status === 'not_authorized') {

                    // console.log('not authorized');
                    $ionicLoading.hide();

                    $state.go('login');

                } else {

                    $ionicLoading.hide();
                    // console.log('user not logged in');
                    // the user isn't logged in to Facebook.
                    $state.go('login');
                }
            });
        }

        function facebookLogout() {

            FB.logout(function (response) {
                // console.log('fb logout', response);
            });
            ApiService.logoutUser($rootScope.user.accessToken)
        }

        function facebookResgister(register) {
            FB.login(function (response) {

                if (response.authResponse) {
                    // console.log('connected to Facebook');
                    // console.log('facebookResgister', response);

                    getProfile(register);

                } else {

                    // console.log('User cancelled login or did not fully authorize.');
                    $state.go('login')
                }
            }, {
                scope: 'email, read_custom_friendlists, user_friends',
                return: true
            });
        }

        function getProfile(registerUser) {

            FB.api('/me?fields=id,name,email,picture,friends{picture,name}', function (response) {

                $rootScope.user = response;
                $rootScope.user['password'] = sha512_224(response.email+response.id)

                // console.log($rootScope.user);

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
