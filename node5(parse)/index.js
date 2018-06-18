var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');

fs.writeFileSync(__dirname+"/info.txt", '');
fs.writeFileSync(__dirname+"/info.json", '');

for(var i=0; i<255;i++){
    var options = {
        uri: "http://10.0.2."+i+"/cgi-bin/get_system_info.cgi/",
        auth: {
            user: 'root',
            pass: 'root',
            sendImmediately: false
        }
    };

    request(options, function(error, response, html){
        if (!error && response.statusCode == 200){
                //var $ = cheerio.load(html);
                //console.log('OUT of http://10.0.2.'+i+'/:\n'+html);
                fs.appendFileSync(__dirname+"/info.txt", "\nReceiving data from "+options.uri+"\n"+html+"\n", function (wrt_err){
                    if(wrt_err) throw wrt_err;
                });
            }
        else{
            //console.log('OUT of http://10.0.2.'+i+'/:\n'+html);
            //console.log('Code : ' + response.statusCode);
            //console.log('error : ' + error);
            //console.log('html : ' + html);
            fs.appendFileSync(__dirname+"/info.txt", "\n"+error+"\nHTML: "+html+"\n", function (wrt_err){
                if(wrt_err) throw wrt_err;
            });
        }
    });

    var item = 0;
    request(options, function(error, response, html){
        if (!error && response.statusCode == 200){
                fs.appendFileSync(__dirname+"/info/info"+item+1+".json", "\n"+html+"\n", function (wrt_err){
                    if(wrt_err) throw wrt_err;
                });
            }
        else{
            fs.appendFileSync(__dirname+"/info/info"+item+1+".json", "\n"+html+"\n", function (wrt_err){
                if(wrt_err) throw wrt_err;
            });
        }
    });
}

console.log("Done. See the info.txt");