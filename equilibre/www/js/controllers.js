
angular.module('starter.controllers', ['starter.gameController', 'starter.accountController', 'starter.questionController'])

    //.controller('ChatDetailCtrl', function ($scope, $stateParams, Chats) {
    //  $scope.chat = Chats.get($stateParams.chatId);
    //})

    // ------------- Login Controller
    .controller('LoginCtrl', ['$scope', 'FacebookService', function ($scope, FacebookService) {
        console.log('LoginCtrl');

        $scope.login = function () {
            FacebookService.login();
        }
    }])


    // ------------- Home page Controller
    .controller('HomeCtrl', ['$scope', '$state', 'FacebookService', function ($scope, $state, FacebookService) {
        console.log('HomeCtrl');
        $scope.getFriends = function () {
            FacebookService.getFriends();
        };

        $scope.logout = function () {
            FacebookService.logout();
            $state.go('login')
        }


    }]);
