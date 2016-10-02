angular.module('starter.facebookService', [])

    .service('FacebookService', ['$window', '$state', function ($window, $state) {

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
                    $state.go('home');

                    var uid = response.authResponse.userID;
                    var accessToken = response.authResponse.accessToken;

                } else if (response.status === 'not_authorized') {

                    console.log('not authorized');

                    $state.go('login');

                } else {

                    console.log('user not logged in');
                    // the user isn't logged in to Facebook.
                }
            });
        }

        function facebookLogin() {

            FB.login(function (response) {
                if (response.authResponse) {
                    console.log('Welcome!  Fetching your information.... ');
                    $state.go('home')
                } else {
                    console.log('User cancelled login or did not fully authorize.');
                    $state.go('login')
                }
            }, {
                scope: 'read_custom_friendlists',
                return: true
            });
        }

        function facebookLogout() {

            FB.logout(function (response) {
                console.log(response)
            });
        }

        return {

            init: function () {
                return facebookInit();
            },
            login: function () {
                return facebookLogin()
            },
            logout: function () {
                return facebookLogout()
            },
            getFriends: function () {

                FB.api('/me?fields=id,name,friendlists', function (response) {
                    console.log('Good to see you, ' + response.name + '.');
                    console.log(response)
                });

            }


        }

    }]);