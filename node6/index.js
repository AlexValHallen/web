//deprecated
//var request = require('request');
var fs = require('fs');

var urls = [];
for(var i=0; i<255; i++){
    urls[i] = "http://10.0.2."+i+"/cgi-bin/get_system_info.cgi/";
}
const req = require('request-promise');

async function foo (){
    for(var j in urls){
            var entryID = urls[j];
            var options = {
                uri: entryID,
                auth: {
                    user: 'root',
                    pass: 'root',
                    sendImmediately: false
                }
            };

            try{
                //console.log(j+". Now trying to connect to: "+entryID+"\n");
                await req(options, function(error, resp, body){
                    if (!error && resp.statusCode == 200){
                        console.log(j+". Connected to "+entryID+"\n");
                        fs.writeFile(__dirname+"/info/info"+j+".json", "\n"+body+"\n", function (wrt_err){
                            if(wrt_err) throw wrt_err;
                        });
                    }
                    else{
                        fs.writeFile(__dirname+"/info.txt", "\n"+error+"\nHTML: "+body+"\n", function (wrt_err){
                            if(wrt_err) throw wrt_err;
                        });
                    }
                });
            }
            catch(e){
                console.error(e);
            }
        }
}

foo();
