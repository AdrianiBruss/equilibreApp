angular.module('starter.gameController', [])

    .controller('GameCtrl', ['SocketService', '$scope', '$rootScope', 'SocketService', '$state', 'SOCKET', 'ApiService', 'UserService',
    function (SocketService, $scope, $rootScope, SocketService, $state, SOCKET, ApiService, UserService) {

        init();

        function init(){

            $scope.friends = $rootScope.user.friends.data;
            $scope.room = [];
            $scope.question = null;
            $scope.users = [];
            $scope.score = 0;
            $scope.timer = {
                'msec': 0,
                'sec': 0,
                'min': 0,
                'timestamp': 0
            };
            $scope.questionList = [];
            $scope.goodAnswer = 0;

            var start = 0;

        }

        // checking if an invitation has been send
        if ($state.params.question) {
            startGame();
            $scope.participants = $state.params.participants;
        }

        // add friend to play
        $scope.addFriend = function(friend, index){

            if(friend.online)
            {
                $scope.friends[index].selected = !$scope.friends[index].selected;
            }

            // checking for friend connection
            if ($scope.room.indexOf(friend.id) > -1)
            {
                $scope.room.splice($scope.room.indexOf(friend.id), 1);
            }
            else
            {
                if (friend.online && friend.selected)
                {
                    var exists = $scope.room.filter(function(obj) {
                        return obj.userID == friend.id;
                    })[0];

                    if(!exists)
                    {
                        $scope.room.push({
                            'socketID': friend.socketID,
                            'userID': friend.id
                        });
                    }

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

                SocketService.playGame($scope.room);
                startGame();

            }
            else
            {
                alert('Veuillez sélectionner un joueur');
            }


        };

        // [Socket] : waiting for new questions
        function startGame(){

            $('div.tab-nav.tabs').hide();

            SOCKET.instance.on('invitation sent', function (guests) {
                $rootScope.invitation = false;
                $rootScope.usersResponses.active = true;

                getFacebookProfile(guests, true);

                $scope.$apply();
            });

            SOCKET.instance.on('too many refuse', function (guests) {
                alert('Sorry but all guests decline your invitation !');
                $state.go('home');
            });

            SOCKET.instance.on('send question', function(data){

                // If it's the first question
                if (data[2]) {

                    $rootScope.usersResponses.active = false;
                    $rootScope.invitation = false;
                    $rootScope.game = true;

                    // Start timer
                    start = new Date();
                    startChrono();

                    // $('div.tab-nav.tabs').hide();
                }

                $scope.question = data[0];
                $rootScope.roomID = data[1];

                $scope.$apply();
            });

            SOCKET.instance.on('users updated', function(data){

                var users = data[1];

                ( $scope.game || $scope.gameEnded ) ? $scope.usersResponses.active = false : $scope.usersResponses.active = true;

                $rootScope.invitation = false;
                $scope.user = users.filter(function(obj) {
                    return obj.userID == $rootScope.user.id;
                })[0];

                // update users during game
                getFacebookProfile(users, data[0]);

            });

            SOCKET.instance.on('game stop', function(data){

                $('div.tab-nav.tabs').show();

                var score = data[1];
                var timestamp = $scope.timer.timestamp;

                $rootScope.game = false;
                $rootScope.gameEnded = true;
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
                }, 0)

                // [Socket] : send final score to socket
                SOCKET.instance.emit('submit question', [$rootScope.roomID, false, null, null, null, $scope.user.score])
            })
        }

        // [Socket] : send response to Socket
        $scope.sendResponse = function(response){

            // [roomID, [bool]true answer, pos, score]
            var sendResponse = [$rootScope.roomID, false, $scope.user.position, $scope.user.firstIndex, $scope.user.secondIndex, $scope.user.score];

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

        function getFacebookProfile(profiles, first){

            if ( first ) {
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
            }else {

                angular.forEach($scope.users, function(value, key){
                    angular.forEach(profiles, function(v, k){
                        if ( value.userID == v.userID ) {
                            $scope.users[key].firstIndex = v.firstIndex;
                            $scope.users[key].secondIndex = v.secondIndex;
                            $scope.users[key].position = v.position;
                            $scope.users[key].score = v.score;
                        }
                    })

                })

            }

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
