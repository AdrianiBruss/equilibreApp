angular.module('starter.questionController', [])

    .controller('QuestCtrl', ['$scope', 'ApiService', function ($scope, ApiService) {

        $scope.newQuestion = {
            "questionText":     null,
            "questionPicture":  null,
            "description":      null,
            "answerPictureOne": null,
            "answerPictureTwo": null,
            "answerTextOne":    null,
            "answerTextTwo":    null
        };
        $scope.success = true;


        $scope.addQuestion = function () {

            console.log($scope.newQuestion);

            if (($scope.newQuestion.questionText != null) &&
                ($scope.newQuestion.description != null)) {

                ApiService.addQuestion($scope.newQuestion);

            } else {
                $scope.success = false;
            }
        };

    }]);
