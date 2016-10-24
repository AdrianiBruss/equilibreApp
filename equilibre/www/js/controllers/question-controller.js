angular.module('starter.questionController', [])

    .controller('QuestCtrl', ['$scope', '$rootScope', 'ApiService', '$cordovaCamera', '$cordovaImagePicker',
    function ($scope, $rootScope, ApiService, $cordovaCamera, $cordovaImagePicker) {

        $scope.image = null;
        $scope.newQuestion = {};
        $scope.success = true;
        initNewQuestion();

        // [API] : Adding a new question
        $scope.addQuestion = function () {

            $scope.success = true;

            if (($scope.newQuestion.questionText != null) &&
                ($scope.newQuestion.description != null)  &&
                ($scope.newQuestion.answer != [])         &&
                ($scope.newQuestion.trueAnswer != null))
            {
                ApiService.addQuestion($scope.newQuestion);
                initNewQuestion();

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

        $scope.openCamera = function(step, method) {
            console.log('getPicture')

            document.addEventListener("deviceready", function () {

                var sourceType;
                (method == 'openCamera') ? sourceType = Camera.PictureSourceType.CAMERA : sourceType = Camera.PictureSourceType.PHOTOLIBRARY;

                var options = {
                    quality: 50,
                    destinationType: Camera.DestinationType.DATA_URL,
                    sourceType: sourceType,
                    encodingType: Camera.EncodingType.JPEG,
                    targetWidth: 200,
                    targetHeight: 200,
                    popoverOptions: CameraPopoverOptions,
                    saveToPhotoAlbum: false,
                    correctOrientation:true
                };

                $cordovaCamera.getPicture(options).then(function(imageData) {

                    $scope.image = 'data:image/jpeg;base64,'+imageData;

                    setImage($scope.image, step)

                }, function(err) {
                    console.log('err my image', err)
                  // error
                });

            }, false);
        }

        function setImage(image, step) {

            switch (step) {
                case 'questionPicture':
                    $scope.newQuestion.questionPicture = image;
                    break;
                case 'answer1':
                    $scope.newQuestion.answer[1] = image;
                    break;
                case 'answer2':
                    $scope.newQuestion.answer[2] = image;
                    break;
                default:
                    console.log('myImage', image);
                    break;
            }

        }

        function initNewQuestion() {
            $scope.newQuestion = {
                "questionText":     null,
                "questionPicture":  null,
                "description":      null,
                "answer":           ['', ''],
                "trueAnswer":       null,
                "stats":            [0, 0],
                "playerId":         $rootScope.user.userId
            };
        }

    }]);
