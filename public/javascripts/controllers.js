'use strict';

var lotteryControllers = angular.module("lotteryControllers", []);


lotteryControllers.controller("lotteryCheckController", [
    "$scope",
    "$routeParams",
    "lotteryGetData",
    function($scope, $routeParams, lotteryGetData){
        var json = lotteryGetData.get({
            date: $routeParams.date,
            team: $routeParams.team,
            nothome:$routeParams.nothome
        }, function(response) {
            $scope.lotteryData = response.data;
        });

        $scope.lotteryOptions = [{"value":0,"text":"主场"},{"value":1,"text":"客场"},{"value":-1,"text":"置空"}];
    }
]);