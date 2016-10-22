angular.module('starter.questionController', [])

    .controller('QuestCtrl', ['$scope', '$rootScope', 'ApiService', function ($scope, $rootScope, ApiService) {

        $scope.newQuestion = {
            "questionText":     null,
            "questionPicture":  null,
            "description":      null,
            "answer":           [],
            "trueAnswer":       null,
            "stats":            [0, 0],
            "playerId":         $rootScope.user.userId
        };

        $scope.newQuestion.answer[1] = $scope.newQuestion.answer[2] = '';

        $scope.success = true;

        // [API] : Adding a new question
        $scope.addQuestion = function () {

            $scope.success = true;

            if (($scope.newQuestion.questionText != null) &&
                ($scope.newQuestion.description != null)  &&
                ($scope.newQuestion.answer != [])         &&
                ($scope.newQuestion.trueAnswer != null))
            {
                ApiService.addQuestion($scope.newQuestion);

            } else {
                $scope.success = false;
            }
        };

        $scope.clearAnswerFields = function(){
            $scope.newQuestion.answer[1] = '';
            $scope.newQuestion.answer[2] = '';
            $scope.trueAnswer = '';
            angular.element("input.radio").attr('checked', '');
        };

    }]);
