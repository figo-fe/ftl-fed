var fs = require('fs');
var ftlToJson = function(data){
    data = data.replace(/"(.*?)"\?datetime\("yyyy-MM-dd HH:mm"\)/g,'"Date_$1"');
    var arr = data.match(/<#assign [\s\S]+? \/>/g);
    var ret = [];
    var l;
    for(l = arr.length;l;l--){
        ret.push(arr[l - 1].replace('<#assign ','"').replace(' =','":').replace(' />',''));
    }
    if(/<#include "/.test(data)){
        var arr2 = data.match(/<#include ".*" \/>/g);
        var ins = [];
        for(l = arr2.length;l;l--){
            ins.push(arr2[l - 1].match(/<#include "(.*)" \/>/)[1]);
        }
        ret.unshift('"includeFTL":"' + ins.join(';') + '"');
    }
    return '{' + ret.join(',') + '}';
};
var utils = {
    readFtl: function(path,args){
        var file = args.match(/ftl=([\w\/\.]+)/)[1];
        var cont = fs.readFileSync(path + 'mock/' + file,'utf-8');
        return ftlToJson(cont);
    },
    saveFtl: function(path,args,fn){
        fs.writeFile(path + 'mock/' + args.ftl,args.cont,function (err){
            var ret = '';
            if(err){
                ret = err;
            }else{
                ret = 'success';
            }
            fn && fn(ret);
        });
    }
};

module.exports = utils;