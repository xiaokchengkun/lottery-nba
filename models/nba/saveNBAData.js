var http = require("http");
var cheerio = require("cheerio");
var mongodb = require("../db");

var getAndSave = {
    init: function(date, callback){
        this.date = date;
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
                //获取时间
                var date = $("span.curTime").html();
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
        var _date = new Date();
        var today = {
            y: _date.getFullYear(),
            m: _date.getMonth() + 1,
            d: _date.getDate()
        };
        data.date = today.y + "-" + (today.m>9?today:("0"+today.m)) + "-" + ((today.d+this.dayIndex)>9?(today.d+this.dayIndex):("0"+today.d+this.dayIndex));
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
                collection.update({"date":data.date},{"date":data.date, "results":data.result},{upsert:true},function(err){
                    if(err){
                        console.log(err);
                    }
                    mongodb.close();
                    //me.saveDone();
                    me.callback && me.callback(data);
                });
            })
        });
    },
    saveDone: function(){
        this.dayIndex --;
        if(this.dayIndex > -10){
            this.getData();
        }
    },
    getFromDb: function(){

    }
};

var init = function(date, callback){
    getAndSave.init(date, callback);
}

module.exports.init = init;