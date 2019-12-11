//! DO NOT OVERWRITE THIS LINE!!!!!!! TOKEN 637534229:AAHRWDJbIoBFABuNzMXTfg-72328Aewefrk

const TOKEN = process.env.TELEGRAM_TOKEN || '637534229:AAHRWDJbIoBFABuNzMXTfg-72328Aewefrk';
const TelegramBot = require('node-telegram-bot-api');
const Agent = require('socks5-https-client/lib/Agent');
const options = {
    polling: true,
    polling: {
        params:{
            timeout: 20
        }
    },
    /* request: {
        agentClass: Agent,
        agentOptions: {
            socksHost: "tgproxy.audd.io",
            socksPort: 1080,
            // If authorization is needed:
            socksUsername: 'user',
            socksPassword: 'password'
        }
        //proxy:'cfd1400c8002cb3cec1da036f62f7b0e@paparoxy.me:443'
    } */
    request: {
        agentClass: Agent,
        agentOptions: {
            socksHost: "104.238.97.129",
            socksPort: 42252//,
            // If authorization is needed:
            //socksUsername: '468477832',
            //socksPassword: 'TSfl3u6y'
        }
    }
}
const req = require('request-promise');

const Sequelize = require('sequelize');
var smolDB = 'smol2019_may';
var olympDB = 'olymp2019_may';
// WE CONNECT TO !SMOLENSHINA
var connectSmolDB = new Sequelize(smolDB, 'sa', '`1234qwe', {
    host: '25.0.10.252',
    dialect: 'mysql',
    insecureAuth: true,
    timezone: '+08:00',
    define: { freezeTableName: true },
    logging: false
});
// WE CONNECT TO !OLIMPISKIY
var connectOlympDB = new Sequelize(olympDB, 'sa', '`1234qwe', {
    host: '25.13.113.33',
    dialect: 'mysql',
    insecureAuth: true,
    timezone: '+08:00',
    define: { freezeTableName: true },
    logging: false
});
const Op = Sequelize.Op;

// NOW THERE'S A LIST OF ADMINS
auth_users = [
    // Delete these and add your own user id
    468477832, // dats my ass
    493911936 // batowha
]

const KEYBOARD = {
    reply_markup: JSON.stringify({
        keyboard: [
            ['Статистика / Stats', 'Перезапустить / Reboot'],
            ['Ваш ID / Your ID', 'Помощь / Help']
        ]
    })
};

const newbieKbrd = {
    reply_markup: JSON.stringify({
        keyboard: [
            ['Ваш ID / Your ID', 'Помощь / Help']
        ]
    })
};

const confirmKbrd = {
    reply_markup: JSON.stringify({
        inline_keyboard: [
            [{ text: 'Да / Yes', callback_data: 'y' }],
            [{ text: 'Нет / No', callback_data: 'n' }]
        ]
    })
};

var fs = require('fs');
const bot = new TelegramBot(TOKEN, options)
console.log("Channel open. Comm-link online");
// WHEN BOT STARTS, THIS HAPPENS

bot.onText(/\/start/, (msg, match) => {
    console.log("Warning! A new user approaches with ID "+msg.chat.id);
    fs.appendFileSync(__dirname+"/users_id.txt", msg.chat.id+"\n");
    if (authenticate_users(msg.from.id)) {
        bot.sendMessage(msg.chat.id, "Добро пожаловать! Вы можете нажать на любую кнопку, либо вручную ввести нужную вам команду. Наберите символ слэш, чтобы лицезреть список команд.", KEYBOARD);
    }
    else{
        bot.sendMessage(msg.chat.id, "Добро пожаловать! Пожалуйста, сообщите свой Telegram-ID техподдержке для правильной работы бота", newbieKbrd);
    }
});

bot.onText(/\/help/, (msg, match) => {
    if (authenticate_users(msg.from.id)) {
        bot.sendMessage(msg.chat.id, "Вы можете нажать на любую кнопку, либо вручную ввести нужную вам команду. Наберите символ слэш, чтобы лицезреть список комманд. \r\nЗЫ \"Горячие\" майнеры - майнеры, средняя температура которых превышает 85 градусов", KEYBOARD);
    }
    else{
        bot.sendMessage(msg.chat.id, "Чтобы начать работу, сообщите свой Telegram-ID техподдержке", newbieKbrd);
    }
});

// NOW WE HEAR YOUR COMMANDS
bot.onText(/(.+)/, (msg, match) => {
    if (match[0] == 'Ваш ID / Your ID') {
        bot.sendMessage(msg.chat.id, 'ID: ' + msg.from.id, KEYBOARD);    
    }
    else if(match[0] == 'Помощь / Help'){
        if (authenticate_users(msg.from.id)) {
            bot.sendMessage(msg.chat.id, "Вы можете нажать на любую кнопку, либо вручную ввести нужную вам команду. Наберите символ слэш, чтобы лицезреть список комманд. \r\nЗЫ \"Горячие\" майнеры - майнеры, средняя температура которых превышает 85 градусов", KEYBOARD);
        }
        else{
            bot.sendMessage(msg.chat.id, "Чтобы начать работу, сообщите свой Telegram-ID техподдержке", newbieKbrd);
        }
    }  
    else if (authenticate_users(msg.from.id)) {
        bot.sendMessage(msg.chat.id,KEYBOARD); 
        if(match[0] == 'Статистика / Stats'){
            showStats(msg.chat.id);
        }
        else if(match[0] == 'Перезапустить / Reboot'){
            bot.sendMessage(msg.chat.id, "Будут перезапущены \"горячие\" майнеры, а также майнеры с низким хешрейтом. Продолжить?", confirmKbrd);
            var ass = msg.message_id;
            bot.on('callback_query', function (msg) {
                if (msg.data == 'y'){
                    console.log('User '+msg.chat.id+' is rebooting his miners');
                }
                else if (msg.data == 'n'){
                    console.log('User '+msg.chat.id+' canceled rebooting');
                }
            });
        }
    } 
    else {
        bot.sendMessage(msg.chat.id, 'ВАМ ТУТ НЕ РАДЫ / Unauthorized User', newbieKbrd);    
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

async function showStats(chatId){
    console.log('Someone is requesting for Stats: '+chatId);
    var userWallet;

    // ДОБАВЛЯЕМ ЮЗЕРОВ ЗДЕСЬ И ЕЩЕ НИЖЕ

    switch(chatId){
        case 468477832:
            userWallet = '\'%1Cwtc%\'';
            break;
        case 493911936: // batowha
            userWallet = '\'%1Cwtc%\'';
    }
    try{
        // Количество машинок в Смоленщине клиента
        var smolMiners = await connectSmolDB.query("SELECT COUNT(*) FROM " + smolDB + ".otherinfo WHERE IpAddr IN (SELECT ipAddr FROM " + smolDB + ".onlineminers WHERE OnlineStatus<>0) AND User LIKE "+userWallet, { type: connectSmolDB.QueryTypes.SELECT });
        smolMiners = Object.values(smolMiners[0]);
        smolMiners = parseInt(smolMiners[0], 10);
        // Количество машинок в Олимпийском клиента
        var olympMiners = await connectOlympDB.query("SELECT COUNT(*) FROM " + olympDB + ".otherinfo WHERE IpAddr IN (SELECT ipAddr FROM " + olympDB + ".onlineminers WHERE OnlineStatus<>0) AND User LIKE "+userWallet, { type: connectOlympDB.QueryTypes.SELECT });
        olympMiners = Object.values(olympMiners[0]);
        olympMiners = parseInt(olympMiners[0], 10);
        // Хешрейт в Олимпийском
        var olympRate = await connectOlympDB.query("SELECT SUM(RtHashrate) FROM " + olympDB + ".otherinfo WHERE IpAddr IN (SELECT ipAddr FROM " + olympDB + ".onlineminers WHERE OnlineStatus<>0) AND User LIKE "+userWallet, { type: connectOlympDB.QueryTypes.SELECT });
        olympRate = Object.values(olympRate[0]);
        olympRate = parseFloat(olympRate[0], 10);
        if(olympRate/1!=olympRate) olympRate=0;
        console.log(olympRate);
        // Хешрейт в Смоленщине
        var smolRate = await connectSmolDB.query("SELECT SUM(RtHashrate) FROM " + smolDB + ".otherinfo WHERE IpAddr IN (SELECT ipAddr FROM " + smolDB + ".onlineminers WHERE OnlineStatus<>0) AND User LIKE "+userWallet, { type: connectSmolDB.QueryTypes.SELECT });
        smolRate = Object.values(smolRate[0]);
        smolRate = parseFloat(smolRate[0], 10);
        if(smolRate/1!=smolRate) smolRate=0;
        console.log(smolRate);
        // Получим количество горячих майнеров (со средней температурой выше 84)
        var hotMinersSmolCount = await connectSmolDB.query("SELECT COUNT(*) FROM " + smolDB + ".otherinfo WHERE IpAddr IN (SELECT ipAddr FROM " + smolDB + ".onlineminers WHERE OnlineStatus<>0) AND User LIKE "+userWallet+" AND AvgTemperature>84;", { type: connectSmolDB.QueryTypes.SELECT});
        hotMinersSmolCount = Object.values(hotMinersSmolCount[0]);
        hotMinersSmolCount = parseInt(hotMinersSmolCount[0], 10);

        var hotMinersOlympCount = await connectOlympDB.query("SELECT COUNT(*) FROM " + olympDB + ".otherinfo WHERE IpAddr IN (SELECT ipAddr FROM " + olympDB + ".onlineminers WHERE OnlineStatus<>0) AND User LIKE "+userWallet+" AND AvgTemperature>84;", { type: connectOlympDB.QueryTypes.SELECT});
        hotMinersOlympCount = Object.values(hotMinersOlympCount[0]);
        hotMinersOlympCount = parseInt(hotMinersOlympCount[0], 10);
        // Получим майнеры с нулевым хешрейтом
        var uselessSmol = await connectSmolDB.query("SELECT IpAddr FROM " + smolDB + ".otherinfo WHERE IpAddr IN (SELECT ipAddr FROM " + smolDB + ".onlineminers WHERE OnlineStatus<>0) AND User LIKE "+userWallet+" AND RtHashrate=0", { type: connectSmolDB.QueryTypes.SELECT});
        var resUselessSmol = [];
        for(var i=0; i<uselessSmol.length; i++){
            var ip = Object.values(uselessSmol[i]);
            resUselessSmol.push(ip[0]);
        }

        // Получим майнеры с нулевым хешрейтом
        var uselessOlymp = await connectOlympDB.query("SELECT IpAddr FROM " + olympDB + ".otherinfo WHERE IpAddr IN (SELECT IpAddr FROM " + olympDB + ".minerstat WHERE Type<>'error') AND User LIKE "+userWallet+" AND RtHashrate=0", { type: connectOlympDB.QueryTypes.SELECT});
        var resUselessOlymp = [];
        for(var i=0; i<uselessOlymp.length; i++){
            var ip = Object.values(uselessOlymp[i]);
            resUselessOlymp.push(ip[0]);
        }

        // Проверим время последнего апдейта в БД
        var fssLUpdSmol = await connectSmolDB.query("SELECT updatedAt FROM " + smolDB + ".minerstat LIMIT 1");
        fssLUpdSmol = Object.values(fssLUpdSmol[0]);
        fssLUpdSmol = Object.values(fssLUpdSmol[0]);
        fssLUpdSmol = String(fssLUpdSmol[0]);
        
        // Резалт слаживаем
        var resMiners = smolMiners+olympMiners;
        var resHRate = smolRate+olympRate;
        var resHotMiners = hotMinersSmolCount+hotMinersOlympCount;
       
        bot.sendMessage(chatId, 'Ваших майнеров в сети: ' + resMiners + '\nRT-HashRate: ' + resHRate.toLocaleString('ru') + ' GH/S' +'\n\"Горячих\" майнеров: '+resHotMiners+'\nМайнеров с нормальным хешрейтом: '+(resMiners-(uselessOlymp.length+uselessSmol.length))+'\nМайнеров с низким хешрейтом: '+(uselessOlymp.length+uselessSmol.length)+ '\nДата последнего обновления в БД:\n' + fssLUpdSmol, KEYBOARD);
        
    }
    catch(error){
        if(error=="SequelizeConnectionError: connect ETIMEDOUT"){
            bot.sendMessage(chatId, "Ошибка: нет подключения к БД\n"+error);
        }
        else{
            bot.sendMessage(chatId, "ERROR!\n"+error);
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
    var userWallet;
    // И ЗДЕСЬ МЕНЯЕМ
    switch(chatId){
        case 468477832:
            userWallet = '\'%1Cwtc%\'';
            break;
        case 493911936: // batowha
            userWallet = '\'%1Cwtc%\'';
    }
    // Получим список майнеров со средней температурой выше 84 или нулевым хешрейтом
    var hotQuerySmol = await connectSmolDB.query("SELECT IpAddr FROM " + smolDB + ".otherinfo WHERE IpAddr IN (SELECT IpAddr FROM " + smolDB + ".minerstat WHERE Type<>'error') AND User LIKE "+userWallet+" AND AvgTemperature>84 OR RtHashrate=0;", { type: connectSmolDB.QueryTypes.SELECT});
    var hotMinersSmol = [];
    for(var i=0; i<hotQuerySmol.length; i++){
        var ip = Object.values(hotQuerySmol[i]);
        hotMinersSmol.push(ip[0]);
    }

    var hotQueryOlymp = await connectOlympDB.query("SELECT IpAddr FROM " + olympDB + ".otherinfo WHERE IpAddr IN (SELECT IpAddr FROM " + olympDB + ".minerstat WHERE Type<>'error') AND User LIKE "+userWallet+" AND AvgTemperature>84 OR RtHashrate=0;", { type: connectOlympDB.QueryTypes.SELECT});
    var hotMinersOlymp = [];
    for(var i=0; i<hotQueryOlymp.length; i++){
        var ip = Object.values(hotQueryOlymp[i]);
        hotMinersOlymp.push(ip[0]);
    }
    // Сконкатинируем это все в один массив
    var hotMiners = hotMinersSmol;
    hotMiners = hotMiners.concat(hotMinersOlymp);
    
    for(var j in hotMiners){
            try{
                entryID = "http://"+hotMiners[j]+"/cgi-bin/reboot.cgi";
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
                    console.log('zbs');
                    bot.sendMessage(chatId, 'Succesfully rebooted '+hotMiners[j]);
                });
            }
            catch(e){
                console.log('ERROR '+hotMiners[j]);
                //bot.sendMessage(chatId, e);
            }
    }
}