angular.module('starter', ['ionic', 'starter.controllers', 'starter.services'])
    .constant('lbConfig', {
        // 'url': 'http://equilibreapp-cloudbruss.rhcloud.com/api',
        'url': 'http://localhost:3000/api'
    })
    .constant('SOCKET', {
        // 'url' : 'http://equilibresocket-cloudbruss.rhcloud.com:8000',
        'url': 'http://localhost:8000',
        'instance': null
    })
    .run(['$rootScope', '$window', '$ionicPlatform', '$ionicLoading', 'FacebookService', 'SocketService', 'SOCKET',
        function ($rootScope, $window, $ionicPlatform, $ionicLoading, FacebookService, SocketService, SOCKET) {
        $ionicPlatform.ready(function () {
            $rootScope.loader = $ionicLoading.show();

            if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                cordova.plugins.Keyboard.disableScroll(true);

            }
            if (window.StatusBar) {
                // org.apache.cordova.statusbar required
                StatusBar.styleDefault();
            }

        });

        // Global user variable
        $rootScope.user = {};

        // [Facebook] : Init Facebook connection
        FacebookService.init();

        // [Socket] : Init Socket connection
        SocketService.init(SOCKET.instance, SOCKET.url);
        SocketService.onInvit();

    }])
    .config(function ($stateProvider, $urlRouterProvider) {

        $stateProvider
            .state('tab', {
                url: '/tab',
                abstract: true,
                templateUrl: 'templates/tabs.html'
            })
            // Home page state
            .state('home', {
                url: '/',
                templateUrl: 'templates/pages/home.html',
                controller: 'HomeCtrl'
            })
            // Login page state
            .state('login', {
                url: '/login',
                templateUrl: 'templates/pages/login.html',
                controller: 'LoginCtrl'
            })
            // Logout page state
            .state('logout', {
                url: '/logout',
                controller: 'LogoutCtrl'
            })

            // Question page state
            .state('tab.question', {
                url: '/question',
                views: {
                    'tab-dash': {
                        templateUrl: 'templates/questions/question.html',
                        controller: 'QuestCtrl'
                    }
                }
            })

            // Game page state
            .state('tab.game', {
                url: '/game',
                views: {
                    'tab-game': {
                        templateUrl: 'templates/game/game.html',
                        controller: 'GameCtrl'
                    }
                },
                params: {
                    question: null
                }
            })

            // Account page state
            .state('tab.account', {
                url: '/account',
                views: {
                    'tab-account': {
                        templateUrl: 'templates/account/account.html',
                        controller: 'AccountCtrl'
                    }
                }
            });

        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/login');

    });
