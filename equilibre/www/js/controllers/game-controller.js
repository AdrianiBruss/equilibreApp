angular.module('starter.gameController', [])

    .controller('GameCtrl', ['SocketService', '$scope', '$rootScope', 'SocketService', '$state', 'SOCKET', 'ApiService', 'UserService',
    function (SocketService, $scope, $rootScope, SocketService, $state, SOCKET, ApiService, UserService) {

        $scope.friends = $rootScope.user.friends.data;
        $scope.room = [];
        $scope.invitation = true;
        $scope.roomId = null;
        $scope.question = null;
        $scope.users = [];
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
            $scope.participants = $state.params.participants;
        }

        // add friend to play
        $scope.addFriend = function(friend, index){

            if(friend.online){
                $scope.friends[index].selected = !$scope.friends[index].selected;
            }

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
                alert('Veuillez sélectionner un joueur');
            }

            startGame();

        };

        // [Socket] : waiting for new questions
        function startGame(){

            $('div.tab-nav.tabs').hide();

            //--- hide loader
            SOCKET.instance.on('invitation sent', function (guests) {
                $scope.invitation = false;
                $scope.usersResponses.active = true;

                getFacebookProfile(guests);

                $scope.$apply();
            });

            SOCKET.instance.on('send question', function(data){

                // If it's the first question
                if (data[2]) {

                    $scope.usersResponses.active = false;
                    $scope.invitation = false;
                    $scope.game = true;

                    // Start timer
                    start = new Date();
                    startChrono();

                    $('div.tab-nav.tabs').hide();
                }

                $scope.question = data[0];
                $scope.roomID = data[1];

                $scope.$apply();
            });

            SOCKET.instance.on('users updated', function(data){


                var users = data[1];

                ( $scope.game || $scope.gameEnded ) ? $scope.usersResponses.active = false : $scope.usersResponses.active = true;

                $scope.invitation = false;
                $scope.user = users.filter(function(obj) {
                    return obj.userID == $rootScope.user.id;
                })[0];

                // update users during game
                getFacebookProfile(users);

            });

            SOCKET.instance.on('game stop', function(data){

                $('div.tab-nav.tabs').show();

                var score = data[1];
                var timestamp = $scope.timer.timestamp;

                $scope.game = false;
                $scope.gameEnded = true;
                $scope.questionList = data[0];
                $scope.user.score = Math.round( (1 / (timestamp * score + timestamp)) * 100000000);

                // update user experience
                ApiService.getUser($rootScope.user.accessToken).then(function (data) {
                    data.experience += $scope.user.score;
                    ApiService.updateUser($rootScope.user.accessToken, {"experience":data.experience}).then(function (data) {
                    });
                });

                // Stop timer
                stopChrono();

                setTimeout(function(){
                    $('.template-ranking .questions').slick({
                        dots: true,
                        arrows: false
                    })
                    $('div.tab-nav.tabs').show();
                }, 0)


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

        function getFacebookProfile(profiles){

            $scope.users = [];

            angular.forEach(profiles, function(value, key){

                if ( value.userID == $rootScope.user.id )
                {
                    $rootScope.user.initials = getInitals($rootScope.user.name);
                    $scope.users.push(angular.extend({}, value, $rootScope.user));
                }

                angular.forEach($rootScope.user.friends.data, function(v, k){
                    if ( value.userID === v.id ){
                        v.initials = getInitals(v.name);
                        $scope.users.push(angular.extend({}, value, v))
                    }
                })

            });

            $scope.$apply();

        }

        function getInitals(name) {
            var initials = name.split(' '), output = "";
            angular.forEach(initials, function(v, k){
                output += v.charAt(0);
            })
            return output;
        }

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
