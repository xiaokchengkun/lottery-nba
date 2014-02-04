'use strict';

var lotteryNBA = angular.module("lotteryNBA", []);

lotteryNBA.controller("checkNBAData", function($scope){
    $scope.checkData = [
        {
            "date": "2014-01-01",
            "name_0": "湖人",
            "name_1": "火箭",
            "score_0": 123,
            "score_1": 122
        }
    ]
});