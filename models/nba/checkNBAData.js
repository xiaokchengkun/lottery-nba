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

        if(query.team){
            search["result.name_" + query.not_home] = query.team;
        }

        mongodb.open(function(err, db){
            db.collection("scores",function(err, collection){
                collection.find(search).sort({date:-1}).toArray(function(err, docs){
                    mongodb.close();
                    var data = {
                        query: me.query
                    };
                    data.list = me.formatData(docs);
                    me.callback && me.callback(data);
                });
            });
        })
    },
    formatData: function(docs){
        var me = this;
        if(docs.length == 0){
            return docs;
        }
        var temp = [];
        //对只有date的数据做处理
        if(!me.query.team){
            for(var j=0; j<docs[0].result.length;j++){
                temp[j] = docs[0].result[j];
                temp[j]._id = docs[0]._id;
                temp[j].date = docs[0].date;
            }
        }else{
            for(var index=0; index<docs.length;index++){
                var item = docs[index];

                for(var i=0;i<item.result.length; i++){
                    var u = item.result[i];
                    if(u["name_"+me.query.not_home] == me.query.team){
                        temp[index] = u;
                        temp[index]._id = item._id;
                        temp[index].date = item.date;
                    }
                }
            }
        }
        return temp;
    }
};

var check = function(req, callback){
  checkData.init(req, callback);
};

module.exports = check;