angular.module('starter.gameController', [])

    .controller('GameCtrl', ['SocketService', '$scope', '$rootScope', 'SocketService', function (SocketService, $scope, $rootScope, SocketService) {
        // With the new view caching in Ionic, Controllers are only called
        // when they are recreated or on app start, instead of every page change.
        // To listen for when this page is active (for example, to refresh data),
        // listen for the $ionicView.enter event:
        //
        //$scope.$on('$ionicView.enter', function(e) {
        //});

        $scope.friends = $rootScope.user.friends.data;
        $rootScope.users = [];
        $scope.question = null;
        $scope.room = [];

        $scope.addFriend = function(friend, index){

            $scope.friends[index].selected = !$scope.friends[index].selected;

            if ($scope.room.indexOf(friend.id) > -1) {
                $scope.room.splice($scope.room.indexOf(friend.id), 1);
            }else {
                if ( friend.online ) {
                    $scope.room.push({
                        'socketID': friend.socketID,
                        'userID': friend.id
                    });
                }

            }
        }

        $scope.playGame = function () {

            if ( $scope.room.length > 0 ) {
            }else {
                console.error('select users to play with')
            }
            SocketService.playGame($scope.room)
        };

        $scope.checkAnswer = function(response){

        };

    }]);
