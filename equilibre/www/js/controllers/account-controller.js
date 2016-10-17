angular.module('starter.accountController', [])

    .controller('AccountCtrl', ['$scope', '$rootScope', 'ApiService', function ($scope, $rootScope, ApiService) {

        $scope.logout = function() {
            console.log('logout fb')
        }

        $scope.getQuestions = function(){
            ApiService.getQuestions($rootScope.user.accessToken);
        }


    }]);
