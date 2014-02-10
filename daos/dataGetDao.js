var mongodb = require("../models/db");

var getDataFromDb = {
    init: function(query, callback){
        this.query = query;
        this.callback = callback;
        this.getFromDb();
    },
    getFromDb: function(){
        var me = this;
        var query = this.query;
        //date: 日期 team: 球队名 nothome:客场
        var search = {};

        if(query.date){
            search.date = query.date;
        }

        if(query.team){
            search["result.name_" + query.nothome] = query.team;
        }

        mongodb.open(function(err, db){
            if(err){
                return;
            }
            db.collection("scores",function(err, collection){
                collection.find(search).sort({date:-1}).toArray(function(err, docs){
                    mongodb.close();
                    me.callback && me.callback(docs);
                });
            });
        })
    }

};

var get = function(query, callback){
    getDataFromDb.init(query, callback);
};

module.exports = get;