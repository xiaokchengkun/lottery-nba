var mongodb = require("../db");
var http = require("http");
var url = require("url");
var queryString = require("querystring");

var checkData = {
    init: function(req, callback){
        this.url = url.parse(req.url);
        this.query = queryString.parse(this.url.query);
        this.callback = callback;
        this.getFromDb();
    },
    getFromDb: function(){
        var me = this;
        var query = this.query;
        var date = query["date"];
        console.log(query);
        mongodb.open(function(err, db){
            db.collection("scores",function(err, collection){
                collection.findOne({date:date},function(err, doc){
                    mongodb.close();
                    console.log(doc);
                    me.callback && me.callback(doc);
                });
            });
        })
    }
};

var check = function(req, callback){
  checkData.init(req, callback);
};

module.exports = check;