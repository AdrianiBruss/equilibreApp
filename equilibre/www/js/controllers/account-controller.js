angular.module('starter.accountController', [])

    .controller('AccountCtrl', ['$scope', '$rootScope', 'ApiService','FacebookService', function ($scope, $rootScope, ApiService, FacebookService) {

        $scope.logout = function() {
            FacebookService.logout();
        }

        ApiService.getQuestions($rootScope.user.accessToken).then(function(data){
            $scope.questions = data;
            console.log('scope questions', $scope.questions)
        })

    }]);
