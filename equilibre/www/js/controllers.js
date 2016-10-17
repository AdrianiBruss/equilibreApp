
angular.module('starter.controllers', ['starter.gameController', 'starter.accountController', 'starter.questionController'])

    //.controller('ChatDetailCtrl', function ($scope, $stateParams, Chats) {
    //  $scope.chat = Chats.get($stateParams.chatId);
    //})

    // ------------- Login Controller
    .controller('LoginCtrl', ['$scope', 'FacebookService', function ($scope, FacebookService) {
        console.log('LoginCtrl');

        $scope.login = function () {
            console.log('fbLoginCtrl')
            FacebookService.login();
        }
    }])


    // ------------- Home page Controller
    .controller('HomeCtrl', ['$scope', '$rootScope', '$state', 'FacebookService', 'ApiService', function ($scope, $rootScope, $state, FacebookService, ApiService) {
        console.log('HomeCtrl');

        $scope.getFriends = function () {
            FacebookService.getFriends();
        };

        $scope.logout = function () {
            FacebookService.logout();
            $state.go('login')
        }


    }]);
