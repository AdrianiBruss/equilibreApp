angular.module('starter.gameController', [])


    .controller('GameCtrl', ['SOCKET', '$scope', 'Chats', function (SOCKET, $scope, Chats) {
        // With the new view caching in Ionic, Controllers are only called
        // when they are recreated or on app start, instead of every page change.
        // To listen for when this page is active (for example, to refresh data),
        // listen for the $ionicView.enter event:
        //
        //$scope.$on('$ionicView.enter', function(e) {
        //});
        $scope.question = null;

        $scope.chats = Chats.all();

        $scope.remove = function (chat) {
            Chats.remove(chat);
        };

        $scope.playGame = function () {
            console.log('play', SOCKET.instance);
            SOCKET.instance.emit('play a game');
        };

        SOCKET.instance.on('start game', function(){
            console.log('start game');
            this.emit('want one question', true);
        });

        SOCKET.instance.on('provide one question', function(question){
            $scope.question = question;
            $scope.$apply();
        });

    }]);