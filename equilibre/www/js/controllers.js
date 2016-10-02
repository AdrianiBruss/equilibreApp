angular.module('starter.controllers', [])


    .controller('LoginCtrl', ['$scope', 'FacebookService', function ($scope, FacebookService) {
        console.log('LoginCtrl');

        $scope.login = function () {
            FacebookService.login();
        }
    }])

    .controller('HomeCtrl', ['$scope', '$state', 'FacebookService', function ($scope, $state, FacebookService) {
        console.log('HomeCtrl')
        $scope.getFriends = function () {
            FacebookService.getFriends();
        };

        $scope.logout = function () {
            FacebookService.logout();
            $state.go('login')
        }


    }])

    .controller('QuestCtrl', function ($scope) {
        console.log('QuesrCtrl')
    })

    .controller('GameCtrl', function ($scope, Chats) {
        // With the new view caching in Ionic, Controllers are only called
        // when they are recreated or on app start, instead of every page change.
        // To listen for when this page is active (for example, to refresh data),
        // listen for the $ionicView.enter event:
        //
        //$scope.$on('$ionicView.enter', function(e) {
        //});

        $scope.chats = Chats.all();
        $scope.remove = function (chat) {
            Chats.remove(chat);
        };
    })

    //.controller('ChatDetailCtrl', function ($scope, $stateParams, Chats) {
    //  $scope.chat = Chats.get($stateParams.chatId);
    //})

    .controller('AccountCtrl', function ($scope) {
        $scope.settings = {
            enableFriends: true
        };
    });
