var fs = require('fs');
var ftlToJson = function(data){
    data = data.replace(/"(.*?)"\?datetime\("yyyy-MM-dd HH:mm"\)/g,'"Date_$1"');
    var arr = data.match(/<#assign [\s\S]+? \/>/g) || [];
    var ret = [];
    var l;
    for(l = arr.length;l;l--){
        ret.unshift(arr[l - 1].replace('<#assign ','"').replace(' =','":').replace(' />',''));
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
var jsonToFtl = function(data){
    data = JSON.parse(data);
    var cont = '',key,i,v,ins,len;
    for(key in data){
        value = JSON.stringify(data[key]);
        if(key == 'includeFTL'){
            ins = value.replace(/"/g,'').split(';');
            for(len = ins.length;len;len--){
                cont += '<#include "'+ ins[len - 1] +'" />\r\n';
            }
        }else{
            cont += '<#assign ' + key + ' = ' + value + ' />\r\n';
        }
    }
    cont = cont.replace(/"Date_(.*?)"/g,'"$1"?datetime("yyyy-MM-dd HH:mm")');
    return cont;
};
var utils = {
    readFtl: function(path,args){
        var file = args.match(/ftl=([\w\/\.]+)/)[1];
        try{
            var cont = fs.readFileSync(path + 'mock/' + file,'utf-8');
            return ftlToJson(cont);
        }catch(e){
            return '{"errcode":"fail"}';
        }
    },
    saveFtl: function(path,args,fn){
        var cont = args.cont;
        if(cont == '{}'){
            fn && fn('数据为空无法写入ftl');
        }else{
            cont = jsonToFtl(cont);
            fs.writeFile(path + 'mock/' + args.ftl,cont,function (err){
                var ret = '';
                if(err){
                    ret = err;
                }else{
                    ret = 'success';
                }
                fn && fn(ret);
            });
        }
    }
};

module.exports = utils;