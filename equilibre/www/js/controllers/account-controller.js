angular.module('starter.accountController', [])

    .controller('AccountCtrl', ['$scope', '$rootScope', 'ApiService','FacebookService', 'SocketService', 'SOCKET',function ($scope, $rootScope, ApiService, FacebookService, SocketService, SOCKET) {

        SocketService.getRanking();

        console.log($rootScope.user)

        SOCKET.instance.on('send users ranking', function(users){
            $scope.usersRanking = users;

            users.filter(function ( obj ) {
                if( obj._id === $rootScope.user.userId )
                    console.log('scope expérience', obj.experience)
                    // $scope.experience = obj.experience;
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
            console.log('scope questions', $scope.questions)
        })

    }]);
