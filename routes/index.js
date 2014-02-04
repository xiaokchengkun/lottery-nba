/*
 * GET home page.
 */
var crypto = require('crypto');
var path = require("path");
var User = require('../models/user');
var getAndSave = require('../models/nba/saveNBAData.js');
var checkData = require('../models/nba/checkNBAData.js');

module.exports = function(app) {
    app.get('/', function (req, res) {
        var html = path.normalize(__dirname + '/../views/index.html');
        res.sendfile(html,{
            title: "首页"
        });
        //res.render('index', { title: '首页-NBA' });
    });

    //从虎扑获取每日比赛结果 并且存储到db
    app.get("/getdata", function(req, res){
        getAndSave.init(req, function(){
            res.render("data/saveData",{
                title: "抓取数据-NBA"
            });
        });
    });
    app.get("/ajax/getdata", function(req, res){
        getAndSave.init(req, function(){
            res.send({
                errno: 0
            });
        });
    });


    //异步查看数据
    app.get("/ajax/checkdata", function(req, res){
        checkData(req, function(data){
            res.send({
                errno: 0,
                data: data
            })
        });
    });
    //同步查看数据
    app.get("/checkdata", function(req, res){
        checkData(req, function(data){
            res.render("check",{
                title: "查看数据-NBA",
                content: data
            })
        });
    });
};

