angular.module('starter.socketService', [])

    .service('SocketService', ['$rootScope', 'UserService', '$ionicPopup', '$state', 'SOCKET', function ($rootScope, UserService, $ionicPopup, $state, SOCKET) {

        var socket;

        // [Socket] : initalisation
        function socketInit(instance, url) {
            SOCKET.instance = socket = io.connect(url);
        }

        // [Socket] : sending user's id to socket
        function onConnection(id){
            $rootScope.user.socketID = socket.id;
            socket.emit('send user ID', id);
            onGetUsers();
        }

        // [Socket] : waiting for friends' online status
        function onGetUsers(){
            socket.on('send all users', function(users){
                $rootScope.users = users;
                $rootScope.$apply();

                // Update friends' status
                UserService.updateUsersStatus();

            });
        }

        // [Socket] : get all users for ranking
        function getUsersRanking(){
            socket.emit('get users ranking');
        }

        // [Socket] : send invitation to socket
        function playGame(friends){
            socket.emit('want to play game', friends );
        }

        // [Socket] : waiting for an invitation
        function onInvit(){
            socket.on('send an invitation', function(data){
                var roomID = data[0];
                var participants = data[1];
                var host;
                var hostID = participants[participants.length - 1].userID;

                console.log(participants);

                $rootScope.user.friends.data.filter(function(obj){
                    if ( obj.id == hostID )
                        host = obj.name;
                })
                // open request invitation popin
                openPopin(roomID, host);

                $state.go('tab.game', {'question': true, 'participants': participants});
            });
        }

        // request invitation popin
        function openPopin(roomID, host) {

            var confirmPopup = $ionicPopup.confirm({
                title: ''+host+' want to play with you !',
                template: 'Confirm or decline the invitation'
            });

            // [Socket] : send a response to invitation
            confirmPopup.then(function(res) {
                if(res) {
                    socket.emit('play a game', [true, roomID])
                } else {
                    socket.emit('play a game', [false, roomID])
                }
           });
        }

        return {

            init: function(instance, url) {
                return socketInit(instance, url);
            },

            getRanking: function () {
              return getUsersRanking();
            },

            playGame: function(friends){
                return playGame(friends);
            },

            connection:function(id){
                return  onConnection(id);
            },

            onInvit: function(){
                return onInvit();
            }

        }

    }]);
