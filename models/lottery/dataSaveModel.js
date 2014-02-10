var http = require("http");
var cheerio = require("cheerio");
var moment = require("moment");
var url = require("url");
var queryString = require("querystring");
var saveDataToDb = require("../../daos/dataSaveDao");

var getAndSave = {
    init: function(req, callback){
        this.url = url.parse(req.url);
        this.query = queryString.parse(this.url.query);
        this.dayLimit = this.query.day?parseInt(this.query.day,10) : -60;
        this.callback = callback;
        this.dayIndex = 0;
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
                var $gameListComing = $(".gamespace_list");
                var $gameListDone = $(".gamespace_list_no");
                var $gameList = ($gameListDone.length>0)?$gameListDone:$gameListComing;
                $gameList.each(function(index,item){
                    var $nameWrapper = $(this).find(".nameText");
                    var name_0 = $nameWrapper.eq(0).find("a").text();
                    var name_1 = $nameWrapper.eq(1).find("a").text();
                    var $scoreWrapper = $(this).find(".bifen").find("a");
                    var score = ($scoreWrapper.length>0)?$scoreWrapper.text():"vs";
                    list.push((name_0 + score + name_1).replace(/ /g,""));
                });
                var data = {
                    list: list
                };

                data = me.formatData(data);
                saveDataToDb(data, function(){
                    me.saveDone();
                });
            });
        }).on("error",function(){
                console.log("error");
            });
    },
    formatData: function(data){
        if(data.list.length == 0){
            return data;
        }
        var now = moment().add('days', this.dayIndex);
        data.date = now.format("YYYY-MM-DD");
        data.result = [];

        for(var index=0; index<data.list.length; index++){
            var item = data.list[index];
            data["result"][index] = {};
            var result = (item.indexOf("vs")!=-1) ? item.split("vs") : item.split(":");
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
                collection.update({"date":data.date},{"date":data.date, "result":data.result},{upsert:true},function(err){
                    if(err){
                        console.log(err);
                    }
                    mongodb.close();
                    me.saveDone();
                });
            })
        });
    },
    saveDone: function(){
        if(this.dayLimit > 0){
            this.dayIndex ++;
            if(this.dayIndex <= this.dayLimit){
                this.getData();
            }else{
                this.callback && this.callback();
            }
        }else{
            this.dayIndex --;
            if(this.dayIndex >= this.dayLimit){
                this.getData();
            }else{
                this.callback && this.callback();
            }
        }


    }
};

var init = function(dayLimit, callback){
    getAndSave.init(dayLimit, callback);
};

module.exports.init = init;