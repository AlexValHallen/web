// WELCOME!
// ЧТОБЫ СМЕНИТЬ КОШЕЛЬКИ НА МАЙНЕРАХ:
// 1. ВВЕДИТЕ СЮДА ДИАПАЗОН IP-АДРЕСОВ (напр., 10.0.10.1-254, 10.0.11.1-254)
var subnetw = "10.0.10.5, 10.0.10.6, 10.0.10.25, 10.0.10.27, 10.0.10.28, 10.0.10.32, 10.0.10.35, 10.0.10.34, 10.0.10.36, 10.0.10.38, 10.0.10.41, 10.0.10.51, 10.0.10.52, 10.0.10.54, 10.0.10.53, 10.0.10.57, 10.0.10.58, 10.0.10.61, 10.0.10.62, 10.0.10.64, 10.0.10.65, 10.0.10.66, 10.0.10.67, 10.0.10.73, 10.0.10.71, 10.0.10.72, 10.0.10.74, 10.0.10.75, 10.0.10.77, 10.0.10.81, 10.0.10.84, 10.0.10.87, 10.0.10.90, 10.0.10.89, 10.0.10.92, 10.0.10.94, 10.0.10.97, 10.0.10.96, 10.0.10.100, 10.0.10.103, 10.0.10.110, 10.0.10.112, 10.0.10.113, 10.0.10.111, 10.0.10.114, 10.0.10.115, 10.0.10.117, 10.0.10.120, 10.0.10.122, 10.0.10.125, 10.0.10.129, 10.0.10.130, 10.0.10.135, 10.0.10.139, 10.0.10.142, 10.0.10.143, 10.0.10.146, 10.0.10.148, 10.0.10.149, 10.0.10.150, 10.0.10.151, 10.0.10.153, 10.0.10.154, 10.0.10.155, 10.0.10.156, 10.0.10.161, 10.0.10.164, 10.0.10.163, 10.0.10.165, 10.0.10.170, 10.0.10.172, 10.0.10.173, 10.0.10.175, 10.0.10.176, 10.0.10.179, 10.0.10.180, 10.0.10.178, 10.0.10.189, 10.0.10.190, 10.0.10.196, 10.0.10.203, 10.0.10.205, 10.0.10.204, 10.0.10.211, 10.0.10.210, 10.0.10.212, 10.0.10.213, 10.0.10.221, 10.0.10.223, 10.0.10.224, 10.0.10.225, 10.0.10.228, 10.0.10.229, 10.0.10.230, 10.0.10.231, 10.0.10.232, 10.0.10.233, 10.0.10.235, 10.0.10.237, 10.0.10.239, 10.0.10.240, 10.0.11.3, 10.0.11.2, 10.0.11.8, 10.0.11.6, 10.0.11.9, 10.0.11.11, 10.0.11.10, 10.0.11.12, 10.0.11.14, 10.0.11.16, 10.0.11.15, 10.0.11.18, 10.0.11.20, 10.0.11.22, 10.0.11.23, 10.0.11.25, 10.0.11.24, 10.0.11.26, 10.0.11.27, 10.0.11.29, 10.0.11.33, 10.0.11.35, 10.0.11.36, 10.0.11.38, 10.0.11.47, 10.0.11.56, 10.0.11.57, 10.0.11.67, 10.0.11.75, 10.0.11.77, 10.0.11.87, 10.0.11.88, 10.0.11.99, 10.0.11.100, 10.0.11.110, 10.0.11.106, 10.0.11.154, 10.0.11.169, 10.0.11.168, 10.0.11.174, 10.0.11.175, 10.0.10.31, 10.0.10.157, 10.0.10.174, 10.0.10.144, 10.0.10.145, 10.0.10.133, 10.0.10.160, 10.0.10.218, 10.0.11.46, 10.0.11.126";
// 2. ВВЕДИТЕ СЮДА СТРАТУМЫ (pool1-pool3), КОШЕЛЬКИ (wallet1-wallet3) и ПАРОЛЬ
const pool1 = 'cn.ss.btc.com:1800';
const pool2 = 'cn.ss.btc.com:443';
const pool3 = 'cn.ss.btc.com:25';
const wallet1 = 'lsd1488';
const wallet2 = 'lsd1488';
const wallet3 = 'lsd1488';
const password = '';
// 3. ЗАПУСКАЕТЕ ПРОГУ ЧЕРЕЗ ТЕРМИНАЛ (node index) ИЛИ СОХРАНЯЕТЕ ЭТОТ ФАЙЛ И ЗАПУСКАЕТЕ ПРОГРАММУ ЧЕРЕЗ .bat ФАЙЛ
// 4. МОЖНО ПРОЧЕКАТЬ ЛОГ-ФАЙЛ, ГДЕ РЕГИСТРИРУЮТСЯ ВСЕ ИЗМЕНЕНИЯ ПО КОШЕЛЬКАМ
// 5. ???
// 6. PROFIT!
const req = require('request-promise');
const fs = require('fs');
var res = readURLs(subnetw);

sendMinerConfig(res, pool1, pool2, pool3, wallet1, wallet2, wallet3, password);
//readMinerConfig(res, wallet1);

async function readMinerConfig(urls, newUser) {
    var positions = [];
    for (var j in urls) {
        var entryID = "http://" + urls[j] + "/cgi-bin/minerConfiguration.cgi";
        var options = {
            method: 'GET',
            uri: entryID,
            auth: {
                user: 'root',
                pass: 'root',
                sendImmediately: false
            },
            timeout: 5000
        }

        try {
            var CURL = urls[j];
            await req(options, function (error, resp, body) {
                if (!error && resp.statusCode == 200) {
                    if(body.indexOf("\"pools\" : [")!=-1){
                        //var indexPool0 = body.indexOf("{\n\"pools\" : ");
                        var indexPool0 = body.indexOf("ant_data = {")+11; 
                        var indexPool1 = body.indexOf("\n,\n\"api-listen");
                    }
                    else if(body.indexOf("	\"pools\":	[{")!=-1){
                        //var indexPool0 = body.indexOf("{\"pools\" : ");
                        var indexPool0 = body.indexOf("ant_data = {")+11;   
                        var indexPool1 = body.indexOf(",\n	\"api-listen");
                    }
                    /* var indexPool0 = body.indexOf("{\n\"pools\" : ");  
                    var indexPool1 = body.indexOf("\n,\n\"api-listen"); */

                    var antData = body.substring(indexPool0, indexPool1);
                    antData = antData+"}";
                    antData = antData.replace(/(\r\n\t|\n|\r\t)/gm,"");
                    antData = JSON.parse(antData);
                    var minerPosInd0 = antData.pools[0].user.indexOf(".")+1;
                    var minerPosInd1 = antData.pools[0].user.length;
                    var minerPos = "."+antData.pools[0].user.substring(minerPosInd0, minerPosInd1);
                    console.log('Found miner '+minerPos+' with IP: '+CURL);
                    fs.appendFile(__dirname + "/" + "log.txt", "\r\n "+getCurrentDateString()+" Changed: "+CURL+" "+antData.pools[0].user+ "  => " + newUser + "\r\n");
                    positions.push(minerPos);
                }
                else {
                    var minerPos="";
                    console.log('Can\'t find miner '+CURL);
                    positions.push(minerPos);
                }
            });
        }
        catch (e) {
            console.error(CURL+" : "+e);
            var minerPos="";
            positions.push(minerPos);
        }
    }
    return positions;
}

async function sendMinerConfig(urls, url1, url2, url3, user1, user2, user3, passw) {
    var receivedData = await readMinerConfig(urls,user1);

    for (var j in urls) {
        var entryID = "http://" + urls[j] + "/cgi-bin/set_miner_conf.cgi";
        var options = {
            method: 'POST',
            uri: entryID,
            form: {
                _ant_pool1url: url1, _ant_pool1user: user1+receivedData[j], _ant_pool1pw: passw, _ant_pool2url: url2, _ant_pool2user: user2+receivedData[j], _ant_pool2pw: passw, _ant_pool3url: url3, _ant_pool3user: user3+receivedData[j], _ant_pool3pw: passw, _ant_nobeeper: false, _ant_notempoverctrl: false, _ant_fan_customize_switch: false, _ant_freq: 550
            },
            auth: {
                user: 'root',
                pass: 'root',
                sendImmediately: false
            },
            timeout: 3500
        };
        try {
            await req(options, function (error, resp, body) {
                
            });
        }
        catch (e) {
            console.error(e);
        }
    }
}

function readURLs(urls) {
    var re = /\s*,\s*/;
    urls = urls.split(re);
    var resURL = [];
    for (var i = 0; i < urls.length; i++) {
        var lastInd = urls[i].lastIndexOf(".");
        var dashInd = urls[i].indexOf("-");
        if (dashInd == -1) {
            resURL.push(urls[i]);
        }
        else {
            var subnet = urls[i].substring(0, lastInd + 1);
            var startIP = parseInt(urls[i].substring(lastInd + 1, dashInd));
            var endIP = parseInt(urls[i].substring(dashInd + 1, urls[i].length))
            for (var j = startIP; j <= endIP; j++) {
                resURL.push(subnet + String(j));
            }
        }
    }
    return resURL;
}

function getCurrentDateString() {
    var date = new Date();
    var hour = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;
    var min = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;
    var sec = date.getSeconds();
    sec = (sec < 10 ? "0" : "") + sec;
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    month = (month < 10 ? "0" : "") + month;
    var day = date.getDate();
    day = (day < 10 ? "0" : "") + day;
    var res = year + "-" + month + "-" + day + " " + hour + ":" + min + ":" + sec;
    return res;
}

/* var postQuery =
    "_ant_pool1url=" + url1 + "&" +
    "_ant_pool1user=" + user1 + "&" +
    "_ant_pool1pw=" + passw + "&" +
    "_ant_pool2url=" + url2 + "&" +
    "_ant_pool2user=" + user2 + "&" +
    "_ant_pool2pw=" + passw + "&" +
    "_ant_pool3url=" + url3 + "&" +
    "_ant_pool3user=" + user3 + "&" +
    "_ant_pool3pw=" + passw + "&" +
    "_ant_nobeeper=false&_ant_notempoverctrl=false&_ant_fan_customize_switch=false&_ant_fan_customize_value=&_ant_freq=550&_ant_voltage=0706";

    //postQuery = postQuery.replace("+", "%2B");
    //postQuery = postQuery.replace(" ", "+");
 */