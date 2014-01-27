/*
 * GET home page.
 */
var crypto = require('crypto');
var User = require('../models/user');
var getAndSave = require('../models/nba/saveNBAData.js');
var checkData = require('../models/nba/checkNBAData.js');

module.exports = function(app) {
    app.get('/', function (req, res) {
        res.render('index', { title: '首页-NBA' });
    });

    app.get('/reg', function (req, res) {
        res.render('register', { title: '注册-NBA' });
    });

    app.post('/reg', function (req, res) {
        var name = req.body.name,
                password = req.body.password,
                password_re = req.body['password-repeat'];

        if (password_re != password) {
            req.flash('error', '两次输入的密码不一致!');
            return res.redirect('/reg');
        }

        var md5 = crypto.createHash('md5'),
            password = md5.update(req.body.password).digest('hex');
        var newUser = new User({
            name: req.body.name,
            password: password,
            email: req.body.email
        });
        User.get(newUser.name, function (err, user) {
            if (user) {
                req.flash('error', '用户已存在!');
                return res.redirect('/reg');
            }
            //如果不存在则新增用户
            newUser.save(function (err, user) {
                if (err) {
                    req.flash('error', err);
                    return res.redirect('/reg');//注册失败返回主册页
                }
                req.session.user = user;//用户信息存入 session
                req.flash('success', '注册成功!');
                res.redirect('/');//注册成功后返回主页
            });
        });
    });

    //从虎扑获取每日比赛结果 并且存储到db
    app.get("/getdata", function(req, res){
        getAndSave.init(50, function(data){
            res.render("nba",{
                title: "抓取以往数据-NBA",
                content: data
            })
        });
    });
    app.get("/getdata?yesterday", function(req, res){
        getAndSave.init(1, function(data){
            res.render("nba",{
                title: "获取前一天数据-NBA",
                content: data
            })
        });
    });
    app.get("/getdata?today", function(req, res){
        getAndSave.init(1, function(data){
            res.render("nba",{
                title: "获取前一天数据-NBA",
                content: data
            })
        });
    });
    app.get("/getdata?tomorrow", function(req, res){
        getAndSave.init(1, function(data){
            res.render("nba",{
                title: "获取前一天数据-NBA",
                content: data
            })
        });
    });
    //从db中获取以往比赛结果
    app.get("/checkdata", function(req, res){
        checkData(req, function(data){
            res.render("check",{
                title: "查看以往数据-NBA",
                content: data
            })
        });
    });
};

