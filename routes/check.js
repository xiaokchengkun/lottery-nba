var crypto = require('crypto');
var checkData = require('../models/nba/checkNBAData.js');

module.exports = function(app){
    //从db中获取以往比赛结果
    app.get("/checkdata", function(req, res){
        checkData(req, function(data){
            res.render("check",{
                title: "查看以往数据-NBA",
                content: data
            })
        });
    });

    app.get("/checkdata?format=ajax", function(req, res){
        checkData(req, function(data){
            res.render("data/ajax",{
                title: "查看以往数据-NBA",
                content: data
            })
        });
    });
};