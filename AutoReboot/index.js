const req = require('request-promise');
const fs = require('fs');
// IT'S WORKING FOR SMOLENSHINA ONLY! (just for now)
const Sequelize = require('sequelize');
var connectSmolDB = new Sequelize('smol_v5', 'sa', '`1234qwe', {
    host: '10.0.0.250',
    dialect: 'mysql',
    insecureAuth: true,
    timezone: '+08:00',
    define: { freezeTableName: true },
    logging: false
});

var connectOlympDB = new Sequelize('olymp_v2', 'sa', '`1234qwe', {
    host: 'localhost',
    dialect: 'mysql',
    insecureAuth: true,
    timezone: '+08:00',
    define: { freezeTableName: true },
    logging: false
});

setInterval(autoReboot, 3600000); // Reboots every hour

async function autoReboot(){
    // Получим список горячих майнеров (со средней температурой выше 80)
    var hotQuerySmol = await connectSmolDB.query("SELECT IpAddr FROM smol_v5.otherinfo WHERE IpAddr IN (SELECT IpAddr FROM smol_v5.minerstat WHERE Type<>'error') AND AvgTemperature>87 OR RtHashrate=0;", { type: connectSmolDB.QueryTypes.SELECT});
    var hotMinersSmol = [];
    for(var i=0; i<hotQuerySmol.length; i++){
        var ip = Object.values(hotQuerySmol[i]);
        hotMinersSmol.push(ip[0]);
    }

    /* var hotQueryOlymp = await connectOlympDB.query("SELECT IpAddr FROM olymp_v2.otherinfo WHERE IpAddr IN (SELECT IpAddr FROM olymp_v2.minerstat WHERE Type<>'error') AND AvgTemperature>87 OR RtHashrate=0;", { type: connectOlympDB.QueryTypes.SELECT});
    var hotMinersOlymp = [];
    for(var i=0; i<hotQueryOlymp.length; i++){
        var ip = Object.values(hotQueryOlymp[i]);
        hotMinersOlymp.push(ip[0]);
    } 
    */

    for(var j in hotMinersSmol){
        var entryID = "http://"+hotMinersSmol[j]+"/cgi-bin/get_system_info.cgi/";
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
                if (!error && resp.statusCode == 200){
                    entryID = "http://"+hotMinersSmol[j]+"/cgi-bin/reboot.cgi/"
                    try{
                        var curURL = hotMinersSmol[j];
                        await req(options, function(error, resp, body){
                            console.log('Succesfully rebooted ' + hotMinersSmol[j]);
                            fs.appendFileSync(__dirname+"/info.txt", "\r\n"+getCurrentDateString()+' Succesfully rebooted ' + hotMinersSmol[j]+"\r\n");
                            connectSmolDB.authenticate()
                                .then(() => {
                                    var rebootCountDB = connectSmolDB.define('rebootCount',{
                                        ipAddr: Sequelize.STRING,
                                        rebootCount: Sequelize.INTEGER
                                    });

                                    connectSmolDB.sync().then(function (){
                                        rebootCountDB.create({
                                            ipAddr: curURL,
                                            rebootCount: 1
                                        });
                                    });
                                })
                                .catch(err => {
                                    console.error('Unable to connect to the database:', err);
                                });
                        });
                    }
                    catch(e){
                        fs.appendFileSync(__dirname+"/info.txt", "\r\n"+getCurrentDateString()+' Failed rebooting ' + hotMinersSmol[j]+"\r\n");
                    }
                }
            });
        }
        catch(er){
            fs.appendFileSync(__dirname+"/info.txt", "\r\n"+getCurrentDateString()+" Can`t reach for " + hotMinersSmol[j]+"\r\n");
        }
    }

    /* for(var k in hotMinersOlymp){
        var entryID = "http://"+hotMinersOlymp[k]+"/cgi-bin/get_system_info.cgi/";
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
                if (!error && resp.statusCode == 200){
                    entryID = "http://"+hotMinersOlymp[k]+"/cgi-bin/reboot.cgi/"
                    try{
                        await req(options, function(error, resp, body){
                            console.log('Succesfully rebooted ' + hotMinersOlymp[k]);
                            fs.appendFileSync(__dirname+"/info.txt", "\r\n"+getCurrentDateString()+' Succesfully rebooted ' + hotMinersOlymp[k]+"\r\n");
                        });
                    }
                    catch(e){
                        fs.appendFileSync(__dirname+"/info.txt", "\r\n"+getCurrentDateString()+' Failed rebooting ' + hotMinersOlymp[k]+"\r\n");
                    }
                }
            });
        }
        catch(er){
            fs.appendFileSync(__dirname+"/info.txt", "\r\n"+getCurrentDateString()+' Can`t reach for ' + hotMinersOlymp[k]+"\r\n");
        }
    } */
}

function getCurrentDateString() {
    var date = new Date();
    var hour = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;
    var min  = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;
    var sec  = date.getSeconds();
    sec = (sec < 10 ? "0" : "") + sec;
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    month = (month < 10 ? "0" : "") + month;
    var day  = date.getDate();
    day = (day < 10 ? "0" : "") + day;
    var res = year + "-" + month + "-" + day + " " + hour + ":" + min + ":" + sec;
    return res;
}