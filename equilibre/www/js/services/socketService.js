angular.module('starter.socketService', [])

    .service('SocketService', ['$rootScope', 'UserService', function ($rootScope, UserService) {

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
        }

        function onInvit(response){
            socket.on('send an invitation', function(){
                if(typeof response == 'boolean')
                    socket.emit('respond to invitation', response);
                else
                    alert('Response is not a boolean');
            });
        }

        function onGame(){
            socket.on('game start', function () {
                alert('game begins');
            })
        }

        return {

            init: function(instance, url) {
                return socketInit(instance, url);
            },

            playGame:function(){
                return playGame();
            },

            connection:function(id){
                return onConnection(id);
            },

            getConnectedUsers: function(){
                return onGetUsers()
            }

        }


    }]);
