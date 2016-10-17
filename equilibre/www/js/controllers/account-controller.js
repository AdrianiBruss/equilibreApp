angular.module('starter.accountController', [])

    .controller('AccountCtrl', function ($scope) {

        $scope.logout = function() {
            console.log('logout fb')
        }
    });
