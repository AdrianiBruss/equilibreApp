angular.module('starter.accountController', [])

    .controller('AccountCtrl', ['$scope', '$rootScope', 'ApiService','FacebookService', function ($scope, $rootScope, ApiService, FacebookService) {

        // [Facebook] Logout
        $scope.logout = function() {
            FacebookService.logout();
        }

        // [API] Get user's questions 
        ApiService.getQuestions($rootScope.user.accessToken).then(function(data){
            $scope.questions = data;
            console.log('scope questions', $scope.questions)
        })

    }]);
