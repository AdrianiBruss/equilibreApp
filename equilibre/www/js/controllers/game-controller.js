angular.module('starter.gameController', [])

    .controller('GameCtrl', ['SocketService', '$scope', '$rootScope', 'SocketService', '$state', 'SOCKET', function (SocketService, $scope, $rootScope, SocketService, $state, SOCKET) {

        $scope.friends = $rootScope.user.friends.data;
        $scope.room = [];

        $scope.question = null;
        $scope.users = null;
        $scope.game = false;

        startGame()

        // checking if an invitation has been send
        if ($state.params.question) {
            console.log('ready for receiving questions')

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
        }

        // [Socket]: Sending invitation
        $scope.playGame = function () {

            if ( $scope.room.length > 0 ) {
                //loader --
                $scope.room.push({
                    'socketID': $rootScope.user.socketID,
                    'userID': $rootScope.user.id
                })
                SocketService.playGame($scope.room)
            }else {
                console.error('select users to play with')
            }

        };

        // [Socket] : waiting for new questions
        function startGame(){
            //--- hide loader
            console.log('startGame')
            SOCKET.instance.on('game start', function (response) {
                console.log('game starts : ', response)
                $scope.game = true;
                $scope.question = response[0];
                $scope.users = response[1];
                console.log('fb friends : ', $rootScope.user.friends.data)

                $scope.$apply();

            })
        }

        // [Socket] : send response to Socket
        $scope.sendResponse = function(response){
            // var response = [$scope.user.green, $scope.user.red]
            var sendResponse = [0, 0];
            console.log('la bonne response est : ', $scope.question.trueAnswer, typeof(parseInt($scope.question.trueAnswer)))
            console.log(' la reponse émise est : ', response, typeof(response))
            if ( parseInt($scope.question.trueAnswer) == response ) {
                console.log('bien repondu')
                sendResponse = [1, 0]
            }else {
                console.log('mauvaise réponse')
                sendResponse = [0, 1]
            }
            console.log('goodAnswer', $scope.question.goodAnswer)
            console.log('emit to socket : ', sendResponse)

            // [API] : send good or bad answer to api

            // SOCKET.instance.emit('')
        }

    }]);
