angular.module('starter.gameController', [])

    .controller('GameCtrl', ['SocketService', '$scope', '$rootScope', 'SocketService', '$state', 'SOCKET', function (SocketService, $scope, $rootScope, SocketService, $state, SOCKET) {

        $scope.friends = $rootScope.user.friends.data;
        $rootScope.users = [];
        $scope.question = null;
        $scope.room = [];

        startGame();

        // checking if an invitation has been send
        if ($state.params.question) {
            console.log('ready for receiving questions');
        }

        // add friend to play
        $scope.addFriend = function(friend, index){

            $scope.friends[index].selected = !$scope.friends[index].selected;

            // checking for friend connection
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
        };

        // [Socket]: Sending invitation
        $scope.playGame = function () {

            if ( $scope.room.length > 0 ) {
                //loader --
                SocketService.playGame($scope.room)
            }else {
                console.error('select users to play with')
            }

        };

        // [Socket] : waiting for new questions
        function startGame(){
            console.log('game created !');

            SOCKET.instance.on('invitation sent', function (nbr) {
                console.log('Vous avez reçu ' + nbr + ' réponse(s) à votre invitation');
            });
            //--- hide loader
            SOCKET.instance.on('game start', function (question) {
                console.log( 'game starts : ', question)
            })
        }

    }]);
