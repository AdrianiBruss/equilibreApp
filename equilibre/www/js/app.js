// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services'])
    .constant('lbConfig', {
        'url': 'http://equilibreapp-cloudbruss.rhcloud.com/api'
    })
    .constant('SOCKET',{
        // 'url' : 'http://equilibresocket-cloudbruss.rhcloud.com:8000',
        'url' : 'http://localhost:8000',
        'instance' : null
    })
    .run(['$rootScope', '$window', '$ionicPlatform', 'FacebookService', 'SOCKET', function ($rootScope, $window, $ionicPlatform, FacebookService, SOCKET) {
        $ionicPlatform.ready(function () {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                cordova.plugins.Keyboard.disableScroll(true);

            }
            if (window.StatusBar) {
                // org.apache.cordova.statusbar required
                StatusBar.styleDefault();
            }
        });

        $rootScope.user = {};

        FacebookService.init();

        SOCKET.instance = io.connect(SOCKET.url);

        SOCKET.instance.on('connected', function(){
            console.log('You are connected !');
        });

        SOCKET.instance.on('disconnected', function(){
            console.log('You are disconnected !');
        });

    }])
    .config(function ($stateProvider, $urlRouterProvider) {

        // Ionic uses AngularUI Router which uses the concept of states
        // Learn more here: https://github.com/angular-ui/ui-router
        // Set up the various states which the app can be in.
        // Each state's controller can be found in controllers.js
        $stateProvider

        // setup an abstract state for the tabs directive
            .state('tab', {
                url: '/tab',
                abstract: true,
                templateUrl: 'templates/tabs.html'
            })
            .state('home', {
                url: '/',
                templateUrl: 'templates/pages/home.html',
                controller: 'HomeCtrl'
            })
            .state('login', {
                url: '/login',
                templateUrl: 'templates/pages/login.html',
                controller: 'LoginCtrl'
            })
            .state('logout', {
                url: '/logout',
                controller: 'LogoutCtrl'
            })

            // Each tab has its own nav history stack:

            .state('tab.question', {
                url: '/question',
                views: {
                    'tab-dash': {
                        templateUrl: 'templates/questions/question.html',
                        controller: 'QuestCtrl'
                    }
                }
            })

            .state('tab.game', {
                url: '/game',
                views: {
                    'tab-chats': {
                        templateUrl: 'templates/game/game.html',
                        controller: 'GameCtrl'
                    }
                }
            })
            //.state('tab.chat-detail', {
            //  url: '/chats/:chatId',
            //  views: {
            //    'tab-chats': {
            //      templateUrl: 'templates/chat-detail.html',
            //      controller: 'ChatDetailCtrl'
            //    }
            //  }
            //})

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
        $urlRouterProvider.otherwise('/');

    })
