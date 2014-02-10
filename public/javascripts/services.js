var lotteryServices = angular.module("lotteryServices",[
    "ngResource"
]);

lotteryServices.factory("lotteryGetData",["$resource", "$route", function($resource, $route){
    var url = "/ajax/checkdata";
    var data = {};
    var location = $route.current.params;
    console.log(location);
    return $resource("/ajax/checkdata", {}, {
        query: {method:'POST', isArray:false}
    });
}]);