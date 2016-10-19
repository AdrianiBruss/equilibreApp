angular.module('starter.gameController', [])


    .controller('GameCtrl', ['SocketService', '$scope', '$rootScope', 'Chats', function (SocketService, $scope, $rootScope, Chats) {
        // With the new view caching in Ionic, Controllers are only called
        // when they are recreated or on app start, instead of every page change.
        // To listen for when this page is active (for example, to refresh data),
        // listen for the $ionicView.enter event:
        //
        //$scope.$on('$ionicView.enter', function(e) {
        //});

        $scope.friends = $rootScope.user.friends.data;
        $scope.question = null;
        $scope.room = [];

        $scope.addFriend = function(friend, index){

            $scope.friends[index].selected = !$scope.friends[index].selected;

            if ($scope.room.indexOf(friend.id) > -1)
                $scope.room.splice(index, 1);
            else
                $scope.room.push(friend.id);

            console.log($scope.room)
        }

        $scope.playGame = function () {
            console.log($scope.room);
            // SOCKET.instance.emit('play a game');
        };

        $scope.checkAnswer = function(response){

        };

    }]);
