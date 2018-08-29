//! DO NOT OVERWRITE THIS LINE!!!!!!! TOKEN 637534229:AAHRWDJbIoBFABuNzMXTfg-72328Aewefrk

const TOKEN = process.env.TELEGRAM_TOKEN || '637534229:AAHRWDJbIoBFABuNzMXTfg-72328Aewefrk'
const TelegramBot = require('node-telegram-bot-api')
const Agent = require('socks5-https-client/lib/Agent');
const options = {
    polling: true,
    request: {
        agentClass: Agent,
        agentOptions: {
            socksHost: "194.182.80.117",
            socksPort: 1080,
            // If authorization is needed:
            // socksUsername: process.env.PROXY_SOCKS5_USERNAME,
            // socksPassword: process.env.PROXY_SOCKS5_PASSWORD
        }
    }
}
const req = require('request-promise');

const Sequelize = require('sequelize');
// WE CONNECT TO !SMOLENSHINA
var connectSmolDB = new Sequelize('smol_v4', 'sa', '`1234qwe', {
    host: '10.0.0.250',
    dialect: 'mysql',
    insecureAuth: true,
    timezone: '+08:00',
    define: { freezeTableName: true }
    //logging: false
});
// WE CONNECT TO !OLIMPISKIY
var connectOlympDB = new Sequelize('olymp', 'sa', '`1234qwe', {
    host: '25.13.113.33',
    dialect: 'mysql',
    insecureAuth: true,
    timezone: '+08:00',
    define: { freezeTableName: true }
    //logging: false
});
const Op = Sequelize.Op;

// NOW THERE'S A LIST OF ADMINS
auth_users = [
    // Delete these and add your own user id
    468477832 // dats me
]

const KEYBOARD = {
    reply_markup: JSON.stringify({
        keyboard: [
            ['Ваш ID / Your ID', 'Помощь / Help'],
            ['Статистика Смоленщина / Stats Smol', 'Статистика Олимпийский / Stats Olymp'],
            ['Reboot 10.0.10.28']
        ]
    })
}
var fs = require('fs');
const bot = new TelegramBot(TOKEN, options)
console.log("Channel open. Comm-link online");
// WHEN BOT STARTS, THIS HAPPENS
bot.onText(/\/start/, (msg, match) => {
    console.log("Warning! A new user approaches with ID "+msg.chat.id);
    fs.appendFileSync(__dirname+"/users_id.txt", msg.chat.id+"\n");
    bot.sendMessage(msg.chat.id, "Добро пожаловать! Пожалуйста, сообщите свой Telegram-ID разработчику для правильной работы бота", KEYBOARD);
});
// NOW WE HEAR YOUR COMMANDS
bot.onText(/(.+)/, (msg, match) => {
    if (match[0] == 'Ваш ID / Your ID') {
        bot.sendMessage(msg.chat.id, 'ID: ' + msg.from.id + '\nЕсли вы еще не сообщили свой Telegram-ID разработчику, то лучше это сделать)', KEYBOARD);    
    }
    else if(match[0] == 'Помощь / Help'){
        bot.sendMessage(msg.chat.id, 'Выберите любую кнопку. Если что-то не работает, свяжитесь с разработчиком', KEYBOARD);
    }  
    else if (authenticate_users(msg.from.id)) {
        bot.sendMessage(msg.chat.id,KEYBOARD); 
        if(match[0] == 'Статистика Смоленщина / Stats Smol'){
            showStatsSmol(msg.chat.id);
            bot.sendMessage(msg.chat.id, KEYBOARD); 
        }
        else if(match[0] == 'Статистика Олимпийский / Stats Olymp'){
            showStatsOlymp(msg.chat.id);
            bot.sendMessage(msg.chat.id, KEYBOARD); 
        }
        else if(match[0] == 'Reboot 10.0.10.28'){
            reboot(msg.chat.id);
            bot.sendMessage(msg.chat.id, KEYBOARD); 
        }
    } 
    else {
        bot.sendMessage(msg.chat.id, 'ВАМ ТУТ НЕ РАДЫ / Unauthorized User', KEYBOARD);    
    }
});

function authenticate_users(id) {
    for(let i = 0; i < auth_users.length; i++) {
        if (auth_users[i] == id) {
            return true
        }
    }
    return false
}

async function showStatsSmol(chatId){
    try{
        var minerCountSmol = await connectSmolDB.query("SELECT COUNT(*) FROM smol_v4.minerstat WHERE Type<>'error';", { type: connectSmolDB.QueryTypes.SELECT});
        minerCountSmol = Object.values(minerCountSmol[0]);
        bot.sendMessage(chatId, "В Смоленщине на данный момент "+minerCountSmol+" майнеров в сети");

        var sumHrateSmol = await connectSmolDB.query("SELECT SUM(RtHashrate) FROM smol_v4.otherinfo WHERE IpAddr IN (SELECT IpAddr FROM smol_v4.minerstat WHERE Type<>'error');", { type: connectSmolDB.QueryTypes.SELECT});
        sumHrateSmol = Object.values(sumHrateSmol[0]);
        sumHrateSmol = sumHrateSmol.toLocaleString('ru');
        bot.sendMessage(chatId, "Общий RealTime хэшрейт:\n"+sumHrateSmol+" GH/S");
        
        var aliveChainsCountSmol = await connectSmolDB.query("SELECT SUM(AliveChains) FROM smol_v4.otherinfo WHERE IpAddr IN (SELECT IpAddr FROM smol_v4.minerstat WHERE Type<>'error');", { type: connectSmolDB.QueryTypes.SELECT});
        aliveChainsCountSmol = Object.values(aliveChainsCountSmol[0]);
        bot.sendMessage(chatId, "Общее количество плат в сети:\n"+aliveChainsCountSmol);
    }
    catch(error){
        bot.sendMessage(chatId, "ERROR!\n"+error);
    }
}

async function showStatsOlymp(chatId){
    try{
        var minerCountOlymp = await connectOlympDB.query("SELECT COUNT(*) FROM olymp.minerstat WHERE Type<>'error';", { type: connectOlympDB.QueryTypes.SELECT});
        minerCountOlymp = Object.values(minerCountOlymp[0]);
        bot.sendMessage(chatId, "В Олимпийском на данный момент "+minerCountOlymp+" майнеров в сети");

        var sumHrateOlymp = await connectOlympDB.query("SELECT SUM(RtHashrate) FROM olymp.otherinfo WHERE IpAddr IN (SELECT IpAddr FROM olymp.minerstat WHERE Type<>'error');", { type: connectOlympDB.QueryTypes.SELECT});
        sumHrateOlymp = Object.values(sumHrateOlymp[0]);
        sumHrateOlymp = sumHrateOlymp.toLocaleString('ru');
        bot.sendMessage(chatId, "Общий RealTime хэшрейт:\n"+sumHrateOlymp+" GH/S");
        
        var aliveChainsCountOlymp = await connectOlympDB.query("SELECT SUM(AliveChains) FROM olymp.otherinfo WHERE IpAddr IN (SELECT IpAddr FROM olymp.minerstat WHERE Type<>'error');", { type: connectOlympDB.QueryTypes.SELECT});
        aliveChainsCountOlymp = Object.values(aliveChainsCountOlymp[0]);
        bot.sendMessage(chatId, "Общее количество плат в сети:\n"+aliveChainsCountOlymp);
    }
    catch(error){
        bot.sendMessage(chatId, "ERROR!\n"+error);
    }
}
    // Requesting all for one time when the app starts
    alert();    

    // and then we fight, like men in tights
    setInterval(alert, 480000);

Array.prototype.diff = function(a) {
    return this.filter(function(i){return a.indexOf(i) < 0;});
};

    var olympMiners, smolMiners, olympRate, smolRate, smolChains, olympChains;
    var resOlymp0 = []; 
    var resSmol0 = [];

async function alert(){
    // Текущее время вызова в миллисекундах
    var currDate = getCurrentDate();
    
    try{
        // Количество машинок в Олимпийском
        var minerCountOlymp = await connectOlympDB.query("SELECT COUNT(*) FROM olymp.minerstat WHERE Type<>'error';", { type: connectOlympDB.QueryTypes.SELECT});
        minerCountOlymp = Object.values(minerCountOlymp[0]);
        minerCountOlymp = parseInt(minerCountOlymp[0], 10);
        // Получим список этих машинок и выведем вышедших из сети
        var minerListOlymp = await connectOlympDB.query("SELECT IpAddr FROM olymp.minerstat WHERE Type<>'error'", { type: connectOlympDB.QueryTypes.SELECT});
        var resOlymp = [];
        var absentOlymp = [];
        for(var i=0; i<minerListOlymp.length; i++){
            var ip = Object.values(minerListOlymp[i]);
            resOlymp.push(ip[0]);
        }
        // Количество живых плат в Олимпийском
        var aliveChainsCountOlymp = await connectOlympDB.query("SELECT SUM(AliveChains) FROM olymp.otherinfo WHERE IpAddr IN (SELECT IpAddr FROM olymp.minerstat WHERE Type<>'error');", { type: connectOlympDB.QueryTypes.SELECT});
        aliveChainsCountOlymp = Object.values(aliveChainsCountOlymp[0]);
        aliveChainsCountOlymp = parseInt(aliveChainsCountOlymp, 10);
        olympChains = aliveChainsCountOlymp;
        // Если разница между проходами в 3 майнера, сигналим
        if(olympMiners-minerCountOlymp>=3){
            for(var j=0; j<resOlymp0.length; j++){
                if(resOlymp.indexOf(resOlymp0[j])==-1){
                    absentOlymp.push(resOlymp0[j]);
                }
            }
            for(authUser in auth_users){
                bot.sendMessage(auth_users[authUser], 'Из сети вышло ' + (olympMiners-minerCountOlymp) + ' майнеров в Олимпийском');
            }
            for(authUser in auth_users){
                bot.sendMessage(auth_users[authUser], 'Из сети вышло ' + (olympChains-aliveChainsCountOlymp) + ' плат в Олимпийском');
            }
            if(absentOlymp.length!=0){
                for(authUser in auth_users){
                    bot.sendMessage(auth_users[authUser], 'Список вышедших: ' + absentOlymp + ' майнеров в Олимпийском');
                }
            }
        }
        resOlymp0 = resOlymp;
        olympMiners = minerCountOlymp;

        // Хешрейт в Олимпийском
        var sumHrateOlymp = await connectOlympDB.query("SELECT SUM(RtHashrate) FROM olymp.otherinfo WHERE IpAddr IN (SELECT IpAddr FROM olymp.minerstat WHERE Type<>'error');", { type: connectOlympDB.QueryTypes.SELECT});
        sumHrateOlymp = Object.values(sumHrateOlymp[0]);
        sumHrateOlymp = parseFloat(sumHrateOlymp[0], 10);
        if(sumHrateOlymp/olympRate<=0.95){
            for(authUser in auth_users){
                bot.sendMessage(auth_users[authUser], 'WARNING! Хешрейт упал на' + (olympRate-sumHrateOlymp) + ' в Олимпийском');
            }
        }
        olympRate = sumHrateOlymp;
        
        // Проверим время последнего апдейта в БД (тоже в миллисекундах)
        var lastUpdOlymp = await connectOlympDB.query("SELECT updatedAt FROM olymp.minerstat LIMIT 1");
        lastUpdOlymp = Object.values(lastUpdOlymp[0]);
        lastUpdOlymp = Object.values(lastUpdOlymp[0]);
        lastUpdOlymp = String(lastUpdOlymp[0]);
        lastUpdOlymp = lastUpdOlymp.substring(0,10)+" "+lastUpdOlymp.substring(11,19);
        lastUpdOlymp = Date.parse(lastUpdOlymp);

        // Если с последнего апдейта прошло полдня (12 часов), то сигналим
        if(currDate-lastUpdOlymp>=43200000){
            for(authUser in auth_users){
                bot.sendMessage(auth_users[authUser], 'WARNING! C полследнего обновления в БД Олимпийского прошло больше полудня. Проверьте БД и опросчик');
            }
        }
    }
    catch(er){
        if(er=="SequelizeConnectionError: connect ETIMEDOUT"){
            for(authUser in auth_users){
                bot.sendMessage(auth_users[authUser], 'WARNING! Нет подключения к БД в Олимпийском. Проверьте БД и опросник\n'+er);
            }
        }
        else{
            for(authUser in auth_users){
                bot.sendMessage(auth_users[authUser], 'Error Olymp:\n'+er);
            }
        }
    }
    try{
        // Количество машинок в Смоленщине
        var minerCountSmol = await connectSmolDB.query("SELECT COUNT(*) FROM smol_v4.minerstat WHERE Type<>'error';", { type: connectSmolDB.QueryTypes.SELECT });
        minerCountSmol = Object.values(minerCountSmol[0]);
        minerCountSmol = parseInt(minerCountSmol[0], 10);
        // Получим список этих машинок и выведем вышедших из сети
        var minerListSmol = await connectSmolDB.query("SELECT IpAddr FROM smol_v4.minerstat WHERE Type<>'error'", { type: connectSmolDB.QueryTypes.SELECT});
        var resSmol = [];
        var absentSmol = [];
        for(var i=0; i<minerListSmol.length; i++){
            var ip = Object.values(minerListSmol[i]);
            resSmol.push(ip[0]);
        }
        for(var j=0; j<resSmol0.length; j++){
            if(resSmol.indexOf(resSmol0[j])==-1){
                absentSmol.push(resSmol0[j]);
            }
        }
        // Количество живых плат в Смоленщине
        var aliveChainsCountSmol = await connectSmolDB.query("SELECT SUM(AliveChains) FROM smol_v4.otherinfo WHERE IpAddr IN (SELECT IpAddr FROM smol_v4.minerstat WHERE Type<>'error');", { type: connectSmolDB.QueryTypes.SELECT });
        aliveChainsCountSmol = Object.values(aliveChainsCountSmol[0]);
        aliveChainsCountSmol = parseInt(aliveChainsCountSmol, 10);
        if(smolChains-aliveChainsCountSmol>=8){
            for(authUser in auth_users){
                bot.sendMessage(auth_users[authUser], 'Из сети вышло ' + (smolChains-aliveChainsCountSmol) + ' плат в Смоленщине');
            }
        }
        smolChains = aliveChainsCountSmol;
        // Если разница между проходами в 3 майнера, сигналим
        if(smolMiners-minerCountSmol>=3){
            for(authUser in auth_users){
                bot.sendMessage(auth_users[authUser], 'Из сети вышло ' + (smolMiners-minerCountSmol) + ' майнеров в Смоленщине');
            }
            if(absentSmol.length!=0){
                for(authUser in auth_users){
                    bot.sendMessage(auth_users[authUser], 'Список вышедших: ' + absentSmol + ' майнеров в Смоленщине');
                }
            }
        }
        smolMiners = minerCountSmol;
        resSmol0 = resSmol;
        // Хешрейт в Смоленщине
        var sumHrateSmol = await connectSmolDB.query("SELECT SUM(RtHashrate) FROM smol_v4.otherinfo WHERE IpAddr IN (SELECT IpAddr FROM smol_v4.minerstat WHERE Type<>'error');", { type: connectSmolDB.QueryTypes.SELECT });
        sumHrateSmol = Object.values(sumHrateSmol[0]);
        sumHrateSmol = parseFloat(sumHrateSmol[0], 10);
        if(sumHrateSmol/smolRate<=0.95){
            for(authUser in auth_users){
                bot.sendMessage(auth_users[authUser], 'WARNING! Хешрейт упал на' + (smolRate-sumHrateSmol) + ' в Смоленщине');
            }
        }
        smolRate = sumHrateSmol;
        
        // Проверим время последнего апдейта в БД (тоже в миллисекундах)
        var lastUpdSmol = await connectSmolDB.query("SELECT updatedAt FROM smol_v4.minerstat LIMIT 1");
        lastUpdSmol = Object.values(lastUpdSmol[0]);
        lastUpdSmol = Object.values(lastUpdSmol[0]);
        lastUpdSmol = String(lastUpdSmol[0]);
        lastUpdSmol = lastUpdSmol.substring(0,10)+" "+lastUpdSmol.substring(11,19);
        lastUpdSmol = Date.parse(lastUpdSmol);
        
        // Если с последнего апдейта прошло полдня (12 часов), то сигналим
        if(currDate-lastUpdSmol>=43200000){
            for(authUser in auth_users){
                bot.sendMessage(auth_users[authUser], 'WARNING! С последнее обновление в БД Смоленщины прошло больше полудня. Проверьте БД и опросчик');
            }
        }
    }
    catch(er){
        if(er=="SequelizeConnectionError: connect ETIMEDOUT"){
            for(authUser in auth_users){
                bot.sendMessage(auth_users[authUser], 'WARNING! Нет подключения к БД в Смоленщине. Проверьте БД и опросник\n'+er);
            }
        }
        else{
            for(authUser in auth_users){
                bot.sendMessage(auth_users[authUser], 'Error Smol:\n'+er);
            }
        }
    }
}

function getCurrentDate() {
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
    return Date.parse(res);
}

async function reboot(chatId){
            try{
                entryID = "http://10.0.10.28/cgi-bin/reboot.cgi";
                var options = {
                    method: 'GET',
                    uri: entryID,
                    auth: {
                        user: 'root',
                        pass: 'root',
                        sendImmediately: false,
                    },
                    timeout: 3000
                };
                await req(options, function (error, resp, body) {
                    if (!error && resp.statusCode == 200) {
                        console.log('zbs');
                        bot.sendMessage(chatId, 'Succesfully rebooted');
                    }
                    else{
                        console.log('niet');
                        bot.sendMessage(chatId, 'Reboot failed');
                    }
                });
            }
            catch(e){
                console.log('ERROR');
                bot.sendMessage(chatId, e);
            }
}