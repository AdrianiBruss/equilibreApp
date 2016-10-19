angular.module('starter.socketService', [])

    .service('SocketService', ['$rootScope', 'UserService', '$ionicPopup', function ($rootScope, UserService, $ionicPopup) {

        var socket;

        function socketInit(instance, url) {
            instance = io.connect(url);
            socket = instance;
        }

        function onConnection(id){
            socket.emit('send user ID', id);
            onGetUsers();
        }

        function onGetUsers(){
            socket.on('send all users', function(users){
                $rootScope.users = users;
                $rootScope.$apply();

                UserService.updateUsersStatus();

            });
        }

        function playGame(friends){
            socket.emit('want to play game', friends );
            console.log('friends send', friends);
        }

        function onInvit(response){
            console.log('onInvit')
            socket.on('send an invitation', function(roomID){
                console.log('On a recu linvitatoin de Ronald OKLLLLMMM', roomID)

                openPopin(roomID);
                onGame();

                // if(typeof response == 'boolean')
                //     socket.emit('respond to invitation', response);
                // else
                //     alert('Response is not a boolean');
            });
        }

        function onGame(){
            socket.on('game start', function (firstQuestion) {
                console.log('game starts : ', firstQuestion)
            })
        }

        function openPopin(roomID) {

            var confirmPopup = $ionicPopup.confirm({
                title: 'Joue avec moi !',
                template: 'Répond oui et tu auras des des bonbons'
            });

            confirmPopup.then(function(res) {
                console.log('roomID', roomID)
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

            playGame:function(friends){
                return playGame(friends);
            },

            connection:function(id){
                return onConnection(id);
            },

            getConnectedUsers: function(){
                return onGetUsers()
            },
            onInvit: function(){
                return onInvit();
            }

        }

    }]);
