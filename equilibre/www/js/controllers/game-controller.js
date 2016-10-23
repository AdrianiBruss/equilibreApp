angular.module('starter.gameController', [])

    .controller('GameCtrl', ['SocketService', '$scope', '$rootScope', 'SocketService', '$state', 'SOCKET', 'ApiService', 'UserService',
    function (SocketService, $scope, $rootScope, SocketService, $state, SOCKET, ApiService, UserService) {

        $scope.friends = $rootScope.user.friends.data;
        $scope.room = [];
        $scope.invitation = true;
        $scope.roomId = null;
        $scope.question = null;
        $scope.users = null;
        $scope.game = false;
        $scope.gameEnded = false;
        $scope.score = 0;
        $scope.waiting = false;
        $scope.timer = {
            'msec': 0,
            'sec': 0,
            'min': 0,
            'timestamp': 0
        };
        $scope.questionList = [];
        $scope.goodAnswer = 0;
        $scope.usersResponses = {
            'active': false
        };

        var start = 0;

        // checking if an invitation has been send
        if ($state.params.question) {
            startGame();
            // // $scope.waiting = true;
            $scope.invitation = false;
            $scope.participants = $state.params.participants;
            $scope.usersResponses.active = true;
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
                });
                SocketService.playGame($scope.room)
            }else {
                console.error('select users to play with')
            }

            $scope.usersResponses.active = true;

            startGame();

        };

        // [Socket] : waiting for new questions
        function startGame(){

            //--- hide loader
            SOCKET.instance.on('invitation sent', function (guests) {
                $scope.participants = guests;
                $scope.invitation = false;
                $scope.$apply();
            });

            SOCKET.instance.on('send question', function(data){
                // console.log('Question received', data[0], data[1], data[2])

                // If it's the first question
                if (data[2]) {

                    // $scope.waiting = false;
                    $scope.usersResponses.active = false;
                    $scope.invitation = false;
                    $scope.game = true;

                    // Start timer
                    start = new Date();
                    startChrono();
                }

                $scope.question = data[0];
                $scope.roomID = data[1];

                $scope.$apply();
            });

            SOCKET.instance.on('users position updated', function(users){

                // console.log('users received', users)

                $scope.user = users.filter(function(obj) {
                    return obj.userID == $rootScope.user.id;
                })[0];

                // update users during game
                $scope.users = [];

                angular.forEach(users, function(value, key){

                    if ( value.userID == $rootScope.user.id )
                    {
                        $scope.users.push(angular.extend({}, value, $rootScope.user));
                    }

                    angular.forEach($rootScope.user.friends.data, function(v, k){
                        if ( value.userID === v.id ){
                            $scope.users.push(angular.extend({}, value, v))
                        }
                    })

                });

                $scope.$apply();
            });

            SOCKET.instance.on('game stop', function(data){

                var score = data[1];
                var timestamp = $scope.timer.timestamp;

                $scope.game = false;
                $scope.gameEnded = true;
                $scope.questionList = data[0];
                $scope.user.score = Math.round( (1 / (timestamp * score + timestamp)) * 100000000);
                console.log('votre score est', $scope.user.score);

                // update user experience
                ApiService.getUser($rootScope.user.accessToken).then(function (data) {
                    data.experience += $scope.user.score;
                    console.log(data.experience);
                    ApiService.updateUser($rootScope.user.accessToken, {"experience":data.experience}).then(function (data) {
                        console.log(data)
                    });
                });

                // Stop timer
                stopChrono();

                console.log('scope.user.position', $scope.user.position)
                // [Socket] : send final score to socket
                SOCKET.instance.emit('submit question', [$scope.roomID, false, null, null, null, $scope.user.score])
            })
        }

        // [Socket] : send response to Socket
        $scope.sendResponse = function(response){

            // [roomID, [bool]true answer, pos, score]
            var sendResponse = [$scope.roomID, false, $scope.user.position, $scope.user.firstIndex, $scope.user.secondIndex, $scope.user.score];

            if ( parseInt($scope.question.trueAnswer) == response ) {

                // good response !
                sendResponse[1] = true;

                // update player position +1
                sendResponse[2] = sendResponse[2] + 1;

            }else {

                // update player position +1
                sendResponse[2] = sendResponse[2] - 1;
                if ( sendResponse[2] < 0 )
                    sendResponse[2] = 0;
            }

            // [API] : send good or bad answer to api
            ApiService.getStatsQuestion(sendResponse[1], $scope.question._id);

            SOCKET.instance.emit('submit question', sendResponse)
        };

        var end = 0, diff = 0, timer = null;

        function startChrono() {

            end = new Date();
            diff = end - start;
            diff = new Date(diff);

            $scope.timer.msec = diff.getMilliseconds();
            $scope.timer.sec = diff.getSeconds();
            $scope.timer.min = diff.getMinutes();

            $scope.timer.timestamp = diff.getTime();

            $scope.$apply();

            timer = setTimeout(function(){
                startChrono()
            }, 10)

        }

        function stopChrono() {
            clearTimeout(timer)
        }
    }]);
