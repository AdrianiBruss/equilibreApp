angular.module('starter.gameController', [])

    .controller('GameCtrl', ['SocketService', '$scope', '$rootScope', 'SocketService', '$state', 'SOCKET', 'ApiService', function (SocketService, $scope, $rootScope, SocketService, $state, SOCKET, ApiService) {

        $scope.friends = $rootScope.user.friends.data;
        $scope.room = [];
        $scope.roomId = null;
        $scope.question = null;
        $scope.users = null;
        $scope.game = false;
        $scope.usersResponses = {
            'active': false,
            'responses': 0
        };

        // checking if an invitation has been send
        if ($state.params.question) {
            console.log('ready for receiving questions');
            startGame()
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
                $scope.room.push({
                    'socketID': $rootScope.user.socketID,
                    'userID': $rootScope.user.id
                })
                SocketService.playGame($scope.room)
            }else {
                console.error('select users to play with')
            }

            $scope.usersResponses.active = true;
            $scope.usersResponses.responses = $scope.room.length - 1;

            startGame();

        };

        // [Socket] : waiting for new questions
        function startGame(){
            console.log('game created !');

            //--- hide loader

            SOCKET.instance.on('invitation sent', function (nbr) {
                console.log('Vous avez reçu ' + nbr + ' réponse(s) à votre invitation');
                $scope.usersResponses.responses = $scope.usersResponses.responses - nbr;
                $scope.$apply();
            });


            SOCKET.instance.on('send question', function(question, roomID){
                console.log('Question received', question, roomID)
                $scope.game = true;
                $scope.question = question;
                $scope.roomID = roomID;

                $scope.$apply();
            });

            SOCKET.instance.on('users position updated', function(users){
                $scope.users = users;
                $scope.user = users.filter(function(obj) {
                    return obj.userID == $rootScope.user.id
                })[0];

                console.log('fb friends : ', $rootScope.user.friends.data)
                console.log('owner user', $scope.user);

                $scope.$apply();
            })
        }

        // [Socket] : send response to Socket
        $scope.sendResponse = function(response){

            // [roomID, [bool]true answer, indexV, indexR, pos]
            var sendResponse = [$scope.roomID, false, $scope.user.firstIndex, $scope.user.secondIndex, $scope.user.position];
            var stat = {
                "goodAnswer": $scope.question.goodAnswer,
                "badAnswer": $scope.question.goodAnswer
            }
            if ( parseInt($scope.question.trueAnswer) == response ) {
                console.log('bien repondu')
                sendResponse[1] = true;

                sendResponse[2] = sendResponse[2] + 1;
                sendResponse[4] = sendResponse[4] + 1;

                stat['goodAnswer'] = stat['goodAnswer'] + 1;
            }else {
                console.log('mauvaise réponse')

                sendResponse[3] = sendResponse[3] + 1;
                sendResponse[4] = sendResponse[4] - 1;
                if ( sendResponse[4] < 0 )
                    sendResponse[4] = 0;

                stat['badAnswer'] = stat['badAnswer'] + 1;
            }

            console.log('emit to socket : ', sendResponse)

            // [API] : send good or bad answer to api
            console.log('stat', stat, $scope.question._id)
            // ApiService.answerQuestion(stat, $scope.question._id)

            SOCKET.instance.emit('submit question', sendResponse)
        }

    }]);
