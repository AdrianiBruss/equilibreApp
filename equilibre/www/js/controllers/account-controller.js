angular.module('starter.accountController', [])

    .controller('AccountCtrl', ['$scope', '$rootScope', 'ApiService','FacebookService', 'SocketService', 'SOCKET', '$ionicLoading',
    function ($scope, $rootScope, ApiService, FacebookService, SocketService, SOCKET, $ionicLoading) {

        $ionicLoading.show();

        SocketService.getRanking();

        SOCKET.instance.on('send users ranking', function(users){
            $scope.usersRanking = users;

            console.log(users);

            users.filter(function ( obj ) {
                if( obj._id === $rootScope.user.userId )
                    $scope.experience = obj.experience;
            })[0];

            $scope.$apply();
        });

        // [Facebook] Logout
        $scope.logout = function() {
            FacebookService.logout();
        };

        // [API] Get user's questions
        ApiService.getQuestions($rootScope.user.accessToken).then(function(data){
            $scope.questions = data;

            setTimeout(function(){
                $('.template-account #questions').slick({
                    dots: true,
                    arrows: false
                })
            }, 0)


            $ionicLoading.hide();
        })

    }]);
