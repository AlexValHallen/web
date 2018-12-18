// WELCOME!
// ЧТОБЫ СМЕНИТЬ КОШЕЛЬКИ НА МАЙНЕРАХ:
// 1. ВВЕДИТЕ СЮДА ДИАПАЗОН IP-АДРЕСОВ (напр., 10.0.10.1-254, 10.0.11.1-254)
var subnetw = "10.0.11.77";
// 2. ВВЕДИТЕ СЮДА СТРАТУМЫ (pool1-pool3), КОШЕЛЬКИ (wallet1-wallet3) и ПАРОЛЬ
const pool1 = 'stratum+tcp://ass';
const pool2 = '';
const pool3 = '';
const wallet1 = 'reykhan';
const wallet2 = '';
const wallet3 = '';
const password = 'h';
// 3. ЗАПУСКАЕТЕ ПРОГУ ЧЕРЕЗ ТЕРМИНАЛ (node index) ИЛИ СОХРАНЯЕТЕ ЭТОТ ФАЙЛ И ЗАПУСКАЕТЕ ПРОГРАММУ ЧЕРЕЗ .bat ФАЙЛ
// 4. МОЖНО ПРОЧЕКАТЬ ЛОГ-ФАЙЛ, ГДЕ РЕГИСТРИРУЮТСЯ ВСЕ ИЗМЕНЕНИЯ ПО КОШЕЛЬКАМ
// 5. ???
// 6. PROFIT!
const req = require('request-promise');
const fs = require('fs');
var res = readURLs(subnetw);

sendMinerConfig(res, pool1, pool2, pool3, wallet1, wallet2, wallet3, password);
//readMinerConfig(res);

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
            timeout: 3500
        }

        try {
            var CURL = urls[j];
            await req(options, function (error, resp, body) {
                if (!error && resp.statusCode == 200) {
                    var indexPool0 = body.indexOf("{\n\"pools\" : ");  
                    var indexPool1 = body.indexOf("\n,\n\"api-listen");

                    var antData = body.substring(indexPool0, indexPool1);
                    antData = antData+"}";
                    antData = antData.replace(/(\r\n\t|\n|\r\t)/gm,"");
                    antData = JSON.parse(antData);
                    var minerPosInd0 = antData.pools[0].user.indexOf(".")+1;
                    var minerPosInd1 = antData.pools[0].user.length;
                    var minerPos = "."+antData.pools[0].user.substring(minerPosInd0, minerPosInd1);
                    console.log('Found miner '+minerPos+' with IP: '+CURL);
                    fs.appendFile(__dirname + "/" + "log.txt", "\r\n "+getCurrentDateString()+" Changed: "+CURL+" "+antData.pools[0].user+ "  to => " + newUser + "\r\n");
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