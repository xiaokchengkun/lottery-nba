var mongodb = require("../models/db");

var saveDataToDb = {
    init: function(data, callback){
        this.saveToDb(data, callback);
    },
    saveToDb: function(data, callback){
        var me = this;
        mongodb.open(function(err,db){
            db.collection("scores",function(err, collection){
                collection.update({"date":data.date},{"date":data.date, "result":data.result},{upsert:true},function(err){
                    if(err){
                        console.log(err);
                    }
                    mongodb.close();
                    callback();
                });
            })
        });
    }
};

var save = function(data, callback){
    saveDataToDb.init(data, callback);
};

module.exports = save;