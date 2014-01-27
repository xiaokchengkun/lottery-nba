var mongodb = require("../db");
var http = require("http");
var url = require("url");
var queryString = require("querystring");

var checkData = {
    init: function(req, callback){
        this.url = url.parse(req.url);
        this.query = queryString.parse(this.url.query);
        this.callback = callback;
        if(this.queryLength(this.query)){
            this.getFromDb();
        }else{
            this.callback && this.callback({
                query: {}
            });
        }
    },
    queryLength: function(json){
        var i = 0;
        for(key in json){
            if(json.hasOwnProperty(key)){
                i ++;
            }
        }
        return i;
    },
    getFromDb: function(){
        var me = this;
        var query = this.query;
        //date: 日期 team: 球队名 not_home:客场
        var search = {};
        if(query.date){
            search.date = query.date;
        }

        search["result.name_" + query.not_home] = query.team;

        mongodb.open(function(err, db){
            db.collection("scores",function(err, collection){
                collection.find(search).toArray(function(err, docs){
                    mongodb.close();

                    var data = {
                        query: me.query
                    };
                    data.list = me.formatData(docs);
                    console.log(data);
                    me.callback && me.callback(data);
                });
            });
        })
    },
    formatData: function(docs){
        var me = this;
        for(var index=0; index<docs.length;index++){
            var item = docs[index];
            for(var i=0;i<item.result.length; i++){
                var u = item.result[i];
                if(u["name_"+me.query.not_home] == me.query.team){
                    u["is_show"] = true;
                }
            }
        }
        return docs;
    }
};

var check = function(req, callback){
  checkData.init(req, callback);
};

module.exports = check;