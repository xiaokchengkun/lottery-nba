var services = angular.module("lottery.services",[]);

services.factory("lotteryData",["$route", "$http", function($route, $http){
    var url = "/ajax/checkdata";
    var data = {};
    var location = $route.current.params;
    console.log(location);

    //$http.get();
}]);