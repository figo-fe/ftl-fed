'use strict';

//===========freemarker FED system========================

var fs = require('fs');
var path = require('path');
var config = JSON.parse(fs.readFileSync('./mock/config.json'));
var ftlRoot = config.ftlRoot || path.join(__dirname,'../demo');
console.log(ftlRoot);
var commonMock = config.globalData;
var querystring = require('querystring');
var Freemarker = require('freemarker.js');
var fm = new Freemarker({
    viewRoot: ftlRoot
});
var figoapi = require('./figoapi');
var port = process.env.PORT || 80;

var server = {
    options: {
        port: port,
        open: 'http://localhost:'+ port + '/mock/',
        keepalive: true,
        middleware: function(connect, options, middlewares) {
            middlewares.unshift(function (req, res, next) {
                var url = req.url;
                var urlMap = JSON.parse(fs.readFileSync('./mock/urlmap.json'));
                if(/^\/(static|mock|build)\//.test(url)){
                    return next();
                }else if(/^\/_figoapi\//.test(url)){
                    var func = url.match(/\/_figoapi\/(\w+)/)[1];
                    var data;
                    if(req.method == 'GET'){
                        var args = url.split('?')[1];
                        if(args){
                            data = figoapi[func](ftlRoot,args);
                        }else{
                            data = 'Missing parameters';
                        }
                        res.end(data);
                    }else{
                        var str = '';
                        req.on('data',function(chunk){
                            str += chunk;
                        });
                        req.on('end',function(){
                            figoapi[func](ftlRoot,querystring.parse(str),function (ret){
                                res.end(ret);
                            });
                        });
                    }
                }else{
                    if(urlMap['ajax'].indexOf(url) != -1){
                        var fileName = 'data' + url.replace(/[\.\?\/\=\-\&]/g,'_') + '.json';
                        fs.readFile('./mock/ajax/' + fileName,function (err, data){
                            if(err){
                                console.log(err);
                            }
                            res.end(data || 'null');
                        });
                    }else{
                        var ftl = '';
                        url = url.split('?')[0];
                        url = urlMap['route'][url] || url;
                        ftl = url == '/' ? '/index.ftl' : url.replace(/\.html$/,'.ftl');
                        fm.render(ftl,commonMock,function (err, data, out){
                            if(err){
                                res.end(out);
                            }else{
                                res.end(data);
                            }
                        });
                    }
                }
            });
            return middlewares;
        }
    }
}

module.exports = {
    server: server
};