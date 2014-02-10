/*
 * GET home page.
 */
var crypto = require('crypto');
var path = require("path");
var User = require('../models/user');
var saveData = require('../models/lottery/dataSaveModel.js');
var getData = require('../models/lottery/dataGetModel.js');

module.exports = function(app) {
    app.get('/', function (req, res) {
        res.render("index",{
            title: "首页"
        });
    });

    //从虎扑获取每日比赛结果 并且存储到db
    app.get("/getdata", function(req, res){
        saveData.init(req, function(){
            res.render("data/saveData",{
                title: "抓取数据-NBA"
            });
        });
    });
    app.get("/ajax/getdata", function(req, res){
        saveData.init(req, function(){
            res.send({
                errno: 0
            });
        });
    });


    //异步查看数据
    app.get("/ajax/checkdata", function(req, res){
        getData(req, function(data){
            res.send({
                errno: 0,
                data: data
            })
        });
    });
    //同步查看数据
    app.get("/checkdata", function(req, res){
        getData(req, function(data){
            res.render("check",{
                title: "查看数据-NBA",
                content: data
            })
        });
    });
};

