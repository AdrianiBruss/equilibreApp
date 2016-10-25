angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'ngCordova', 'ngOpenFB'])
    .constant('lbConfig', {
        'url': 'http://equilibreapp-cloudbruss.rhcloud.com/api',
        // 'url': 'http://localhost:3000/api'
    })
    .constant('SOCKET', {
        'url' : 'http://equilibresocket-cloudbruss.rhcloud.com:8000',
        // 'url': 'http://localhost:8000',
        'instance': null
    })
    .run(['$rootScope', '$window', '$ionicPlatform', '$ionicLoading', 'FacebookService', 'SocketService', 'SOCKET', 'ngFB',
        function ($rootScope, $window, $ionicPlatform, $ionicLoading, FacebookService, SocketService, SOCKET, ngFB) {
        $ionicPlatform.ready(function () {
            $ionicLoading.show();

            if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                cordova.plugins.Keyboard.disableScroll(true);

            }
            if (window.StatusBar) {
                // org.apache.cordova.statusbar required
                StatusBar.styleDefault();
            }

            ngFB.init({
                appId: '1297400556958732',
                tokenStore: localStorage
            });

            // Global user variable
            $rootScope.user = {};
            $rootScope.roomId = null;
            $rootScope.invitation = true;
            $rootScope.waiting = false;
            $rootScope.game = false;
            $rootScope.gameEnded = false;
            $rootScope.usersResponses = {
                'active': false
            };

            // [Facebook] : Init Facebook connection
            FacebookService.init();

            // [Socket] : Init Socket connection
            SocketService.init(SOCKET.instance, SOCKET.url);
            SocketService.onInvit();

            // called every time the state transition is attempted
            $rootScope.$on('$stateChangeStart', function(event, toState, toParams) {

                if(toState.name == "tab.game")
                {
                    $rootScope.invitation = true;
                    $rootScope.waiting = false;
                    $rootScope.game = false;
                    $rootScope.gameEnded = false;
                    $rootScope.usersResponses = {
                        'active': false
                    };
                }
                else
                {
                    if($rootScope.roomId != null)
                    {
                        SOCKET.instance.leave('room ' + $rootScope.roomId);                        
                    }

                    $('div.tab-nav.tabs').show();
                }

            })


        });

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
                    question: null,
                    participants: null
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
