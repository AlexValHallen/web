const req = require('request-promise');
const fs = require('fs');

const Sequelize = require('sequelize');
var connectSmolDB = new Sequelize('smol_v5', 'sa', '`1234qwe', {
    host: '10.0.0.250',
    dialect: 'mysql',
    insecureAuth: true,
    timezone: '+08:00',
    define: { freezeTableName: true },
    logging: false
});

/* var urls = "10.0.10.1-240,10.0.11.1-253";
var res = readURLs(urls); */

setInterval(autoReboot, 3600000);

async function autoReboot(){
    // Получим список горячих майнеров (со средней температурой выше 80)
    var hotQuerySmol = await connectSmolDB.query("SELECT IpAddr FROM smol_v5.otherinfo WHERE IpAddr IN (SELECT IpAddr FROM smol_v5.minerstat WHERE Type<>'error') AND AvgTemperature>89;", { type: connectSmolDB.QueryTypes.SELECT});
    var hotMinersSmol = [];
    for(var i=0; i<hotQuerySmol.length; i++){
        var ip = Object.values(hotQuerySmol[i]);
        hotMinersSmol.push(ip[0]);
    }

    /* var hotQueryOlymp = await connectOlympDB.query("SELECT IpAddr FROM olymp_v2.otherinfo WHERE IpAddr IN (SELECT IpAddr FROM olymp_v2.minerstat WHERE Type<>'error') AND AvgTemperature>80;", { type: connectOlympDB.QueryTypes.SELECT});
    var hotMinersOlymp = [];
    for(var i=0; i<hotQueryOlymp.length; i++){
        var ip = Object.values(hotQueryOlymp[i]);
        hotMinersOlymp.push(ip[0]);
    } 
    // Сконкатинируем это все в один массив
    var hotMiners = hotMinersSmol;
    */

    for(var j in hotMinersSmol){
        var entryID = "http://"+hotMinersSmol[j]+"/cgi-bin/reboot.cgi/";
        var options = {
            uri: entryID,
            auth: {
                user: 'root',
                pass: 'root',
                sendImmediately: false
            },
            timeout: 3000
        };
        
        try{
            await req(options, function(error, resp, body){
                console.log('Succesfully rebooted ' + hotMinersSmol[j]);
            });
        }
        catch(er){
            console.log('!Something went wrong ' + hotMinersSmol[j]);
        }
    }
}

readURLs = function(urls){
    var re = /\s*,\s*/;
    urls = urls.split(re);
    var resURL = [];
    for(var i=0; i<urls.length; i++){
            var lastInd = urls[i].lastIndexOf(".");
            var dashInd = urls[i].indexOf("-");
            if(dashInd==-1){
                resURL.push(urls[i]);
            }
            else{
                var subnet = urls[i].substring(0, lastInd+1);
                var startIP = parseInt(urls[i].substring(lastInd+1, dashInd));
                var endIP = parseInt(urls[i].substring(dashInd+1, urls[i].length))
                for(var j=startIP; j<=endIP; j++){
                    resURL.push(subnet+String(j));
                }
            }
    }
    return resURL;
}
