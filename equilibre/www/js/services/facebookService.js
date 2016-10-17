angular.module('starter.facebookService', [])

    .service('FacebookService', ['$window', '$state', '$rootScope', 'ApiService',
        function ($window, $state, $rootScope, ApiService) {

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
                    console.log('connected');

                    // getProfile(false);
                    $state.go('home');

                    var uid = response.authResponse.userID;
                    var accessToken = response.authResponse.accessToken;

                } else if (response.status === 'not_authorized') {

                    console.log('not authorized');

                    $state.go('login');

                } else {

                    console.log('user not logged in');
                    // the user isn't logged in to Facebook.
                    $state.go('login');
                }
            });
        }

        function facebookLogin() {
            console.log('fbLoginService')

            FB.login(function (response) {
                if (response.authResponse) {
                    console.log('connected to Facebook')
                    // getProfile(true);

                } else {

                    console.log('User cancelled login or did not fully authorize.');
                    $state.go('login')
                }
            }, {
                scope: 'email, read_custom_friendlists',
                return: true
            });
        }

        function facebookLogout() {

            FB.logout(function (response) {
                console.log(response)
            });
        }

        function getProfile(registerUser) {

            FB.api('/me?fields=id,name,email,picture', function (response) {

                console.log(response)

                $rootScope.user = response;

                // if (registerUser)
                //     ApiService.registerUser($rootScope.user);
                // else
                //     $rootScope.user.password = 'password';
                //     $rootScope.user.rememberMe = true;
                //     ApiService.loginUser($rootScope.user);
            });

        }

        function getFriends() {

            FB.api('/me?fields=id,name,friendlists', function (response) {
                console.log('Good to see you, ' + response.name + '.');
                console.log(response)
            });

        }

        return {

            init: function () {
                return facebookInit()
            },
            login: function () {
                return facebookLogin()
            },
            logout: function () {
                return facebookLogout()
            },
            getFriends: function () {
                return getFriends()
            }


        }

    }]);
