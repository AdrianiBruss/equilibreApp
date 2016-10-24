
angular.module('starter.controllers', ['starter.gameController', 'starter.accountController', 'starter.questionController'])

    // ------------- Login Controller
    .controller('LoginCtrl', ['$scope', 'FacebookService', function ($scope, FacebookService) {

        $scope.login = function () {
            FacebookService.login();
        };
        $scope.register = function () {
            FacebookService.register();
        }
    }])


    // ------------- Home page Controller
    .controller('HomeCtrl', ['$scope', '$rootScope', '$state', 'FacebookService', 'ApiService', function ($scope, $rootScope, $state, FacebookService, ApiService) {

        $scope.getFriends = function () {
            FacebookService.getFriends();
        };

        $scope.logout = function () {
            FacebookService.logout();
            $state.go('login')
        }

    }]);
