var http = require("http");
var url = require("url");
var queryString = require("querystring");
var getDataFromDb = require("../../daos/dataGetDao");

var getData = {
    init: function(req, callback){
        var me = this;
        this.url = url.parse(req.url);
        this.query = queryString.parse(this.url.query);
        this.callback = callback;
        if(this.queryLength(this.query)){
            getDataFromDb(this.query, function(docs){
                var data = {
                    query: me.query
                };
                data.list = me.formatData(docs);
                me.callback && me.callback(data);
            });
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
                    if(u["name_"+me.query.nothome] == me.query.team){
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
    getData.init(req, callback);
};

module.exports = check;