angular.module('starter.questionController', [])

    .controller('QuestCtrl', ['$scope', 'ApiService', function ($scope, ApiService) {

        $scope.newQuestion = {
            "questionText":     null,
            "questionPicture":  null,
            "description":      null,
            "answer":           []
        };

        $scope.success = true;

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
