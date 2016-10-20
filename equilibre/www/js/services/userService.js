angular.module('starter.userService', [])

    .service('UserService', ['$rootScope', function ($rootScope) {

        // Update Facebook status
        function updateUsersStatus() {

            // connected users  : $rootScope.users
            // Facebook Friends : $rootScope.user.friends.data

            var onlineUsers = [];
            var variable = null;

            angular.forEach($rootScope.users, function(v, k){
                onlineUsers.push(v.userID)

            })

            angular.forEach($rootScope.user.friends.data, function(value, key) {
                variable = onlineUsers.indexOf(value.id)
                if ( variable > -1 ) {
                    $rootScope.user.friends.data[key].online = true;
                    $rootScope.user.friends.data[key].socketID = $rootScope.users[variable].socketID;
                }else {
                    $rootScope.user.friends.data[key].online = false;
                }
            });

            $rootScope.$apply();

        }


        return {
            updateUsersStatus: function(){
                return updateUsersStatus();
            }

        }


    }]);
