angular.module('starter.questionController', [])

    .controller('QuestCtrl', ['$scope', '$rootScope', 'ApiService', function ($scope, $rootScope, ApiService) {

        $scope.newQuestion = {
            "questionText":     null,
            "questionPicture":  null,
            "description":      null,
            "answer":           [],
            "playerId":         $rootScope.user.userId
        };

        $scope.success = true;

        // [API] : Adding a new question
        $scope.addQuestion = function () {

            $scope.success = true;

            if (($scope.newQuestion.questionText != null) &&
                ($scope.newQuestion.description != null)  &&
                ($scope.newQuestion.answer != []))
            {
                ApiService.addQuestion($scope.newQuestion);

            } else {
                $scope.success = false;
            }
        };

    }]);
