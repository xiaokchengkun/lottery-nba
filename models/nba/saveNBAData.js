var http = require("http");
var cheerio = require("cheerio");
var mongodb = require("../db");
var moment = require("moment");

var getAndSave = {
    init: function(callback){
        this.callback = callback;
        this.dayIndex = -1;
        this.getData();
    },
    getData: function(){
        var me = this;
        var url = "http://nba.hupu.com/boxscore/boxscore.php?league=NBA&day=" + this.dayIndex;
        http.get(url,function(response){
            var source = "";
            response.on("data",function(data){
                source += data;
            });
            response.on("end",function(){
                var list = [];
                var json = JSON.parse(source);
                var $ = cheerio.load(json.html);
                //获取比分
                $(".bifen").each(function(){
                    list.push($(this).find("a").attr("title"));
                });
                var data = {
                    //date: date,
                    list: list
                };
                data = me.formatData(data);
                me.saveToDb(data);
            });
        }).on("error",function(){
                console.log("error");
            });
    },
    formatData: function(data){
        var now = moment().add('days', this.dayIndex);
        data.date = now.format("YYYY-MM-DD");
        data.result = [];

        for(var index=0; index<data.list.length; index++){
            var item = data.list[index];
            data["result"][index] = {};
            var result = item.split(":");
            for(var i=0; i<result.length; i++){
                var t = result[i];
                var score = t.replace(/76人/ig,"").replace(/[^0-9]/ig,"");
                var name = t.replace(score, "");
                data["result"][index]["name_" + i] = name;
                data["result"][index]["score_" + i] = score;
            }
        }
        delete data["list"];
        return data;
    },
    saveToDb: function(data){
        var me = this;
        mongodb.open(function(err,db){
            db.collection("scores",function(err, collection){
                //collection.update({"date":data.date},{$set: {"date":data.date, "results":data.result}},function(err){
                collection.update({"date":data.date},{"date":data.date, "result":data.result},{upsert:true},function(err){
                    if(err){
                        console.log(err);
                    }
                    mongodb.close();
                    me.saveDone();
                    me.callback && me.callback(data);
                });
            })
        });
    },
    saveDone: function(){
        this.dayIndex --;
        if(this.dayIndex > -51){
            this.getData();
        }
    }
};

var init = function(callback){
    getAndSave.init(callback);
};

module.exports.init = init;