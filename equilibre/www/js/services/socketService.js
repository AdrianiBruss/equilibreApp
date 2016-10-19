angular.module('starter.socketService', [])

    .service('SocketService',
    function () {

        var socket;

        function socketInit(instance, url) {
            instance = io.connect(url);
            socket = instance;
        }

        function addSocketIOEvents() {

            onConnection();
            onGetUsers();
            onInvit();
            onGame();

        }

        function onConnection(){

            socket.on('connected', function(){
                console.log('You are connected !');
                var nombre = Math.round(Math.random() * 1000);
                this.emit('send user ID', nombre);
            });

        }

        function onGetUsers(){
            socket.on('send all users', function(users){
                console.log(users);
            });
        }

        function playGame(friends){
            if(Array.isArray(friends))
                socket.emit('want to play game', friends );
            else
                alert('Your list is not an array');
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

            addEvents: function(){
                return addSocketIOEvents();
            },

            playGame:function(){
                return playGame();
            }

        }


    });
