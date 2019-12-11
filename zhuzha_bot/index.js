//! DO NOT OVERWRITE THIS LINE!!!!!!! TOKEN 659774347:AAEfl_8UyhYbRi8hOhGyWmcbWSA7SFq9v34
// НЕ СМЕЙТЕ ПОТЕРЯТЬ СТРОЧКУ НИЖЕ, ТАМ УКАЗАН ТОКЕН БОТА
const TOKEN = process.env.TELEGRAM_TOKEN || '659774347:AAEfl_8UyhYbRi8hOhGyWmcbWSA7SFq9v34'
const TelegramBot = require('node-telegram-bot-api')
const Agent = require('socks5-https-client/lib/Agent');
const options = {
    polling: true,
    polling: {
        params:{
            timeout: 20
        }
    },
    // ЗДЕСЬ УКАЗЫВАЮТСЯ НАСТРОЙКИ ПРОКСИ ДЛЯ ДОСТУПА К СЕРВЕРАМ TELEGRAM
    /* request: {
        
        //proxy:'ddf12185293675262e106db157218a0b19@proxy.lyo.su:777' //this is for MTPROTO?
        proxy:'http://116.62.204.186:3128'
    } */
    request: {
        agentClass: Agent,
        agentOptions: {
            socksHost: "127.0.0.1",
            socksPort: 9150,
            // If authorization is needed:
            //socksUsername: 'user',
            //socksPassword: 'password'
        }
        //proxy:'cfd1400c8002cb3cec1da036f62f7b0e@paparoxy.me:443'
    }
}
// !! PASTE THE NAMES OF DBs HERE !! 
// !! ВСТАВЬТЕ В ПЕРЕМЕННЫЕ НАЗВАНИЯ РЕЛЕВАНТНЫХ БАЗ ДАННЫХ !!
var smolDB = 'smol2019_september';
var olympDB = 'olymp2019_september';

const Sequelize = require('sequelize');
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
// WE CONNECT TO !MELNICHNAYA_PAD
var connectMelnDB = new Sequelize('LyaMEv6kJL', 'LyaMEv6kJL', 'musQiYd7DI', {
    host: 'remotemysql.com',
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
    158076861, // kolyan pc
    507622032, // moar kolyan
    453184045, // slava
    // !INSERT NEW USERS HERE!

    // HERE!
    493911936 // batowha
]

const KEYBOARD = {
    reply_markup: JSON.stringify({
        keyboard: [
            ['Stats Smol', 'Stats Olymp', 'Stats Meln_pad'],
            ['Help', 'Your ID']
        ]
    })
};

const newbieKbrd = {
    reply_markup: JSON.stringify({
        keyboard: [
            ['Your ID', 'Help']
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
        bot.sendMessage(msg.chat.id, "Добро пожаловать! Вы можете нажать на любую кнопку, либо вручную ввести нужную вам команду. Наберите символ слэш, чтобы лицезреть список комманд.", KEYBOARD);
    }
    else{
        bot.sendMessage(msg.chat.id, "Добро пожаловать! Пожалуйста, сообщите свой Telegram-ID техподдержке для правильной работы бота", newbieKbrd);
    }
});
bot.onText(/\/help/, (msg, match) => {
    if (authenticate_users(msg.from.id)) {
        bot.sendMessage(msg.chat.id, "Вы можете нажать на любую кнопку, либо вручную ввести нужную вам команду. Наберите символ слэш, чтобы лицезреть список комманд", KEYBOARD);
    }
    else{
        bot.sendMessage(msg.chat.id, "Чтобы начать работу, сообщите свой Telegram-ID техподдержке", newbieKbrd);
    }
});

bot.onText(/\/myid/, (msg, match) => {
    if (authenticate_users(msg.from.id)) {
        bot.sendMessage(msg.chat.id, 'ID: ' + msg.from.id, KEYBOARD);
    }
    else{
        bot.sendMessage(msg.chat.id, 'ID: ' + msg.from.id, newbieKbrd);
    }
});

// NOW WE HEAR YOUR COMMANDS
bot.onText(/(.+)/, (msg, match) => {
    if (match[0] == 'Your ID') {
        bot.sendMessage(msg.chat.id, 'ID: ' + msg.from.id, KEYBOARD);    
    }
    else if(match[0] == 'Help'){
        if (authenticate_users(msg.from.id)) {
            bot.sendMessage(msg.chat.id, "Вы можете нажать на любую кнопку, либо вручную ввести нужную вам команду. Наберите символ слэш, чтобы лицезреть список комманд", KEYBOARD);
        }
        else{
            bot.sendMessage(msg.chat.id, "Чтобы начать работу, сообщите свой Telegram-ID техподдержке", newbieKbrd);
        }
    }  
    else if (authenticate_users(msg.from.id)) {
        bot.sendMessage(msg.chat.id,KEYBOARD); 
        if(match[0] == 'Stats Smol'){
            showStatsSmol(msg.chat.id);
        }
        else if(match[0] == 'Stats Olymp'){
            showStatsOlymp(msg.chat.id);
        }
        else if(match[0] == 'Stats Meln_pad'){
            showStatsMeln(msg.chat.id);
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
// Функция для вывода статистики в Смоленщине 
async function showStatsSmol(chatId){
    console.log('Someone is requesting for Stats in Smol: '+chatId);
    try{
        // Количество машинок в Смоленщине
        var fssSmolMiners = await connectSmolDB.query("SELECT COUNT(*) FROM " + smolDB + ".OnlineMiners WHERE OnlineStatus<>0;", { type: connectSmolDB.QueryTypes.SELECT });
        fssSmolMiners = Object.values(fssSmolMiners[0]);
        fssSmolMiners = parseInt(fssSmolMiners[0], 10);

        // Количество живых плат в Смоленщине
        var fssSmolChains = await connectSmolDB.query("SELECT SUM(AliveChains) FROM " + smolDB + ".OtherInfo WHERE IpAddr IN (SELECT IpAddr FROM " + smolDB + ".OnlineMiners WHERE OnlineStatus<>0);", { type: connectSmolDB.QueryTypes.SELECT });
        fssSmolChains = Object.values(fssSmolChains[0]);
        fssSmolChains = parseInt(fssSmolChains, 10);

        // Хешрейт в Смоленщине
        var fssSmolRate = await connectSmolDB.query("SELECT SUM(RtHashrate) FROM " + smolDB + ".OtherInfo WHERE IpAddr IN (SELECT IpAddr FROM " + smolDB + ".OnlineMiners WHERE OnlineStatus<>0);", { type: connectSmolDB.QueryTypes.SELECT });
        fssSmolRate = Object.values(fssSmolRate[0]);
        fssSmolRate = parseFloat(fssSmolRate[0], 10);

        // Прочекаем немайнящие майнеры
        var fssUselessSmol = await connectSmolDB.query("SELECT IpAddr FROM " + smolDB + ".OtherInfo WHERE IpAddr IN (SELECT IpAddr FROM " + smolDB + ".OnlineMiners WHERE OnlineStatus<>0) AND RtHashrate=0;", { type: connectSmolDB.QueryTypes.SELECT});
        var resUselessSmol = [];
        for(var i=0; i<fssUselessSmol.length; i++){
            var ip = Object.values(fssUselessSmol[i]);
            resUselessSmol.push(ip[0]);
        }

        // Прочекаем суммарную температуру по майнерам (>0)
        var fssSumTemper = await connectSmolDB.query("SELECT SUM(AvgTemperature) FROM " + smolDB + ".OtherInfo WHERE IpAddr IN (SELECT IpAddr FROM " + smolDB + ".OnlineMiners WHERE OnlineStatus<>0) AND AvgTemperature>0;", { type: connectSmolDB.QueryTypes.SELECT });
        fssSumTemper = Object.values(fssSumTemper[0]);
        fssSumTemper = parseFloat(fssSumTemper[0], 10);
        var fssSumTempCount = await connectSmolDB.query("SELECT COUNT(*) FROM " + smolDB + ".OtherInfo WHERE IpAddr IN (SELECT IpAddr FROM " + smolDB + ".OnlineMiners WHERE OnlineStatus<>0) AND AvgTemperature>0;", { type: connectSmolDB.QueryTypes.SELECT });
        fssSumTempCount = Object.values(fssSumTempCount[0]);
        fssSumTempCount = parseFloat(fssSumTempCount[0], 10);
        fssSumTemper=fssSumTemper/fssSumTempCount;

        // Проверим время последнего апдейта в БД
        var fssLUpdSmol = await connectSmolDB.query("SELECT updatedAt FROM " + smolDB + ".MinerStat LIMIT 1");
        fssLUpdSmol = Object.values(fssLUpdSmol[0]);
        fssLUpdSmol = Object.values(fssLUpdSmol[0]);
        fssLUpdSmol = String(fssLUpdSmol[0]);
       
        bot.sendMessage(chatId, "В Смоленщине: " + "\nМайнеров в сети: " + fssSmolMiners + "\nПлат в сети: " + fssSmolChains + "\nRT-HashRate: " + fssSmolRate.toLocaleString('ru') + " GH/S" +"\nМайнеров с нулевым Rt-HRate: "+resUselessSmol.length+"\n"+resUselessSmol+"\nСредняя температура по ферме: "+fssSumTemper+" °С"+ "\nДата последнего обновления:\n" + fssLUpdSmol);
        
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
// Функция для вывода статистики в Олимпийском (здесь есть осн ферма, контейнер и миниконтейнер)
async function showStatsOlymp(chatId){
    console.log('Someone is requesting for Stats in Olymp: '+chatId);
    try{
        // Количество машинок в Олимпийском
        var fssOlympMiners = await connectOlympDB.query("SELECT COUNT(*) FROM " + olympDB + ".OnlineMiners WHERE OnlineStatus<>0;", { type: connectOlympDB.QueryTypes.SELECT});
        fssOlympMiners = Object.values(fssOlympMiners[0]);
        fssOlympMiners = parseInt(fssOlympMiners[0], 10);

        // Количество живых плат в Олимпийском
        var fssOlympChains = await connectOlympDB.query("SELECT SUM(AliveChains) FROM " + olympDB + ".OtherInfo WHERE IpAddr IN (SELECT IpAddr FROM " + olympDB + ".OnlineMiners WHERE OnlineStatus<>0);", { type: connectOlympDB.QueryTypes.SELECT});
        fssOlympChains = Object.values(fssOlympChains[0]);
        fssOlympChains = parseInt(fssOlympChains, 10);

        // Хешрейт в Олимпийском
        var fssOlympRate = await connectOlympDB.query("SELECT SUM(RtHashrate) FROM " + olympDB + ".OtherInfo WHERE IpAddr IN (SELECT IpAddr FROM " + olympDB + ".OnlineMiners WHERE OnlineStatus<>0);", { type: connectOlympDB.QueryTypes.SELECT});
        fssOlympRate = Object.values(fssOlympRate[0]);
        fssOlympRate = parseFloat(fssOlympRate[0], 10);

        // Прочекаем немайнящие майнеры
        var fssUselessOlymp = await connectOlympDB.query("SELECT IpAddr FROM " + olympDB + ".OtherInfo WHERE IpAddr IN (SELECT IpAddr FROM " + olympDB + ".OnlineMiners WHERE OnlineStatus<>0) AND RtHashrate=0;", { type: connectOlympDB.QueryTypes.SELECT});
        var resUselessOlymp = [];
        for(var i=0; i<fssUselessOlymp.length; i++){
            var ip = Object.values(fssUselessOlymp[i]);
            resUselessOlymp.push(ip[0]);
        }
        
        // Прочекаем суммарную температуру по майнерам в контейнере (>0)
        var fssSumTemperCont = await connectOlympDB.query("SELECT SUM(AvgTemperature) FROM " + olympDB + ".OtherInfo WHERE IpAddr IN (SELECT IpAddr FROM " + olympDB + ".OnlineMiners WHERE OnlineStatus<>0) AND AvgTemperature>0 AND User LIKE '%cont%' AND User NOT LIKE '%mini%';", { type: connectOlympDB.QueryTypes.SELECT });
        fssSumTemperCont = Object.values(fssSumTemperCont[0]);
        fssSumTemperCont = parseFloat(fssSumTemperCont[0], 10);
        var fssTempCountCont = await connectOlympDB.query("SELECT COUNT(*) FROM " + olympDB + ".OtherInfo WHERE IpAddr IN (SELECT IpAddr FROM " + olympDB + ".OnlineMiners WHERE OnlineStatus<>0) AND AvgTemperature>0 AND User LIKE '%cont%' AND User NOT LIKE '%mini%';", { type: connectOlympDB.QueryTypes.SELECT });
        fssTempCountCont = Object.values(fssTempCountCont[0]);
        fssTempCountCont = parseFloat(fssTempCountCont[0], 10);
        fssSumTemperCont=fssSumTemperCont/fssTempCountCont;

        // Прочекаем суммарную температуру по майнерам в мини-контейнере/будочке (>0)
        var fssSumTemperMCont = await connectOlympDB.query("SELECT SUM(AvgTemperature) FROM " + olympDB + ".OtherInfo WHERE IpAddr IN (SELECT IpAddr FROM " + olympDB + ".OnlineMiners WHERE OnlineStatus<>0) AND AvgTemperature>0 AND User LIKE '%mini%';", { type: connectOlympDB.QueryTypes.SELECT });
        fssSumTemperMCont = Object.values(fssSumTemperMCont[0]);
        fssSumTemperMCont = parseFloat(fssSumTemperMCont[0], 10);
        var fssTempCountMCont = await connectOlympDB.query("SELECT COUNT(*) FROM " + olympDB + ".OtherInfo WHERE IpAddr IN (SELECT IpAddr FROM " + olympDB + ".OnlineMiners WHERE OnlineStatus<>0) AND AvgTemperature>0 AND User LIKE '%mini%';", { type: connectOlympDB.QueryTypes.SELECT });
        fssTempCountMCont = Object.values(fssTempCountMCont[0]);
        fssTempCountMCont = parseFloat(fssTempCountMCont[0], 10);
        fssSumTemperMCont=fssSumTemperMCont/fssTempCountMCont;

        // Прочекаем суммарную температуру по майнерам в основной ферме (>0)
        var fssSumTemper = await connectOlympDB.query("SELECT SUM(AvgTemperature) FROM " + olympDB + ".OtherInfo WHERE IpAddr IN (SELECT IpAddr FROM " + olympDB + ".OnlineMiners WHERE OnlineStatus<>0) AND AvgTemperature>0 AND User LIKE '%OM%';", { type: connectOlympDB.QueryTypes.SELECT });
        fssSumTemper = Object.values(fssSumTemper[0]);
        fssSumTemper = parseFloat(fssSumTemper[0], 10);
        var fssTempCount= await connectOlympDB.query("SELECT COUNT(*) FROM " + olympDB + ".OtherInfo WHERE IpAddr IN (SELECT IpAddr FROM " + olympDB + ".OnlineMiners WHERE OnlineStatus<>0) AND AvgTemperature>0 AND User LIKE '%OM%';", { type: connectOlympDB.QueryTypes.SELECT });
        fssTempCount = Object.values(fssTempCount[0]);
        fssTempCount = parseFloat(fssTempCount[0], 10);
        fssSumTemper=fssSumTemper/fssTempCount;

        // Проверим время последнего апдейта в БД
        var fssLUpdOlymp = await connectOlympDB.query("SELECT updatedAt FROM " + olympDB + ".OnlineMiners LIMIT 1");
        fssLUpdOlymp = Object.values(fssLUpdOlymp[0]);
        fssLUpdOlymp = Object.values(fssLUpdOlymp[0]);
        fssLUpdOlymp = String(fssLUpdOlymp[0]);
        
        bot.sendMessage(chatId, 'В Олимпийском: '+'\nМайнеров в сети: '+fssOlympMiners+'\nПлат в сети: '+fssOlympChains+'\nRT-HashRate: ' + fssOlympRate.toLocaleString('ru')+' GH/S' +'\nМайнеров с нулевым Rt-HRate: '+resUselessOlymp.length+'\n'+resUselessOlymp+"\nСредняя температура по ферме: "+fssSumTemper+" °С"+"\nСредняя температура по контейнеру: "+fssSumTemperCont+" °С"+"\nСредняя температура по мини-контейнеру: "+fssSumTemperMCont+" °С"+'\nДата последнего обновления:\n'+fssLUpdOlymp); 
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

// Функция для вывода статистики в Мельничной Пади
async function showStatsMeln(chatId){
    console.log('Someone is requesting for Stats in Meln: '+chatId);
    try{
        // Количество машинок 
        var fssMelnMiners = await connectMelnDB.query("SELECT COUNT(*) FROM OnlineMiners WHERE OnlineStatus<>0;", { type: connectMelnDB.QueryTypes.SELECT });
        fssMelnMiners = Object.values(fssMelnMiners[0]);
        fssMelnMiners = parseInt(fssMelnMiners[0], 10);

        // Количество живых плат
        var fssMelnChains = await connectMelnDB.query("SELECT SUM(AliveChains) FROM OtherInfo WHERE IpAddr IN (SELECT IpAddr FROM OnlineMiners WHERE OnlineStatus<>0);", { type: connectMelnDB.QueryTypes.SELECT });
        fssMelnChains = Object.values(fssMelnChains[0]);
        fssMelnChains = parseInt(fssMelnChains, 10);

        // Хешрейт 
        var fssMelnRate = await connectMelnDB.query("SELECT SUM(RtHashrate) FROM OtherInfo WHERE IpAddr IN (SELECT IpAddr FROM OnlineMiners WHERE OnlineStatus<>0);", { type: connectMelnDB.QueryTypes.SELECT });
        fssMelnRate = Object.values(fssMelnRate[0]);
        fssMelnRate = parseFloat(fssMelnRate[0], 10);

        // Прочекаем немайнящие майнеры
        var fssUselessMeln = await connectMelnDB.query("SELECT IpAddr FROM OtherInfo WHERE IpAddr IN (SELECT IpAddr FROM OnlineMiners WHERE OnlineStatus<>0) AND RtHashrate=0;", { type: connectMelnDB.QueryTypes.SELECT});
        var resUselessMeln = [];
        for(var i=0; i<fssUselessMeln.length; i++){
            var ip = Object.values(fssUselessMeln[i]);
            resUselessMeln.push(ip[0]);
        }

        // Прочекаем суммарную температуру по майнерам (>0)
        var fssSumTemper = await connectMelnDB.query("SELECT SUM(AvgTemperature) FROM OtherInfo WHERE IpAddr IN (SELECT IpAddr FROM OnlineMiners WHERE OnlineStatus<>0) AND AvgTemperature>0;", { type: connectMelnDB.QueryTypes.SELECT });
        fssSumTemper = Object.values(fssSumTemper[0]);
        fssSumTemper = parseFloat(fssSumTemper[0], 10);
        var fssSumTempCount = await connectMelnDB.query("SELECT COUNT(*) FROM OtherInfo WHERE IpAddr IN (SELECT IpAddr FROM OnlineMiners WHERE OnlineStatus<>0) AND AvgTemperature>0;", { type: connectMelnDB.QueryTypes.SELECT });
        fssSumTempCount = Object.values(fssSumTempCount[0]);
        fssSumTempCount = parseFloat(fssSumTempCount[0], 10);
        fssSumTemper=fssSumTemper/fssSumTempCount;

        // Проверим время последнего апдейта в БД
        var fssLUpdMeln = await connectMelnDB.query("SELECT updatedAt FROM MinerStat LIMIT 1");
        fssLUpdMeln = Object.values(fssLUpdMeln[0]);
        fssLUpdMeln = Object.values(fssLUpdMeln[0]);
        fssLUpdMeln = String(fssLUpdMeln[0]);
       
        bot.sendMessage(chatId, "В Мельничной: " + "\nМайнеров в сети: " + fssMelnMiners + "\nПлат в сети: " + fssMelnChains + "\nRT-HashRate: " + fssMelnRate.toLocaleString('ru') + " GH/S" +"\nМайнеров с нулевым Rt-HRate: "+resUselessMeln.length+"\n"+resUselessMeln+"\nСредняя температура по ферме: "+fssSumTemper+" °С"+ "\nДата последнего обновления:\n" + fssLUpdMeln);
        
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

    // Requesting all for one time when the app starts
    setTimeout(alert, 10000);
    // and then we repeat
    setInterval(alert, 480000);
    //forceShowStats();
    setInterval(forceShowStats, 7200000);

    var HRateOlympOld, HRateSmolOld, HRateMelnOld;
    var resOlymp0 = []; 
    var resSmol0 = [];
    var resMeln0 = [];

async function alert(){
    // Текущее время вызова в миллисекундах
    var currDate = getCurrentDate();
    
    // Олимпийский
    try{
        // Получим список этих машинок и выведем вышедших из сети
        var minerListOlymp = await connectOlympDB.query("SELECT IpAddr FROM " + olympDB + ".OnlineMiners WHERE OnlineStatus<>0", { type: connectOlympDB.QueryTypes.SELECT});
        var resOlymp = [];
        var absentOlymp = [];
        for(var i=0; i<minerListOlymp.length; i++){
            var ip = Object.values(minerListOlymp[i]);
            resOlymp.push(ip[0]);
        }
        for(var j=0; j<resOlymp0.length; j++){
            if(resOlymp.indexOf(resOlymp0[j])==-1){
                absentOlymp.push(resOlymp0[j]);
            }
        }
        // Если из сети вышел хоть 1, (сигналим) записываем в лог
        if(absentOlymp.length>=1){
            fs.appendFileSync(__dirname+"/info.txt", "\r\n"+getCurrentDateString()+' Олимпийский: из сети вышло ' + (absentOlymp.length)+" майнеров:"+ absentOlymp+"\r\n");
            for(var i=1; i<auth_users.length-1; i++){
                bot.sendMessage(auth_users[i], "\r\n"+getCurrentDateString()+' Олимпийский: из сети вышло ' + (absentOlymp.length)+" майнеров:"+ absentOlymp+"\r\n");
            }
        } 
        /* if(absentOlymp.length>=3){ DEPRECATED
            for(authUser in auth_users){
                bot.sendMessage(auth_users[authUser], 'Олимпийский: из сети вышло ' + (absentOlymp.length) + ' майнеров:\n'+ absentOlymp);
            }
        } */   
        resOlymp0 = resOlymp;

        // Хешрейт в Олимпийском
        var HRateOlymp = await connectOlympDB.query("SELECT SUM(RtHashrate) FROM " + olympDB + ".OtherInfo WHERE IpAddr IN (SELECT IpAddr FROM " + olympDB + ".OnlineMiners WHERE OnlineStatus<>0);", { type: connectOlympDB.QueryTypes.SELECT});
        HRateOlymp = Object.values(HRateOlymp[0]);
        HRateOlymp = parseFloat(HRateOlymp[0], 10);
        var decreaseOlymp = HRateOlympOld-HRateOlymp;
        if((decreaseOlymp/HRateOlympOld)*100>=5){
            for(authUser in auth_users){
                bot.sendMessage(auth_users[authUser], 'WARNING! Хешрейт упал на ' + (decreaseOlymp).toLocaleString('ru') + ' GH/S в Олимпийском');
            }
            fs.appendFileSync(__dirname+"/info.txt", "\r\n"+getCurrentDateString()+" WARNING! Хешрейт упал на " + (decreaseOlymp).toLocaleString('ru') + " GH/S в Олимпийском"+"\r\n");
        }
        HRateOlympOld = HRateOlymp;
        
        // Проверим время последнего апдейта в БД (тоже в миллисекундах)
        var lastUpdOlymp = await connectOlympDB.query("SELECT updatedAt FROM " + olympDB + ".OnlineMiners LIMIT 1");
        lastUpdOlymp = Object.values(lastUpdOlymp[0]);
        lastUpdOlymp = Object.values(lastUpdOlymp[0]);
        lastUpdOlymp = String(lastUpdOlymp[0]);
        lastUpdOlymp = lastUpdOlymp.substring(0,10)+" "+lastUpdOlymp.substring(11,19);
        lastUpdOlymp = Date.parse(lastUpdOlymp);

        // Если с последнего апдейта прошло полдня (12 часов), то сигналим
        if(currDate-lastUpdOlymp>=43200000){
            for(authUser in auth_users){
                bot.sendMessage(auth_users[authUser], 'WARNING! C последнего обновления в БД Олимпийского прошло больше полудня. Проверьте БД и опросчик');
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

    // Смоленщина
    try{
        // Получим список этих машинок и выведем вышедших из сети
        var minerListSmol = await connectSmolDB.query("SELECT IpAddr FROM " + smolDB + ".OnlineMiners WHERE OnlineStatus<>0", { type: connectSmolDB.QueryTypes.SELECT});
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
        // Если вышел из сети хотя б 1, пишем в лог
        if(absentSmol.length>=1){
            fs.appendFileSync(__dirname+"/info.txt", "\r\n"+getCurrentDateString()+' Смоленщина: из сети вышло ' + (absentSmol.length)+" майнеров:"+ absentSmol+"\r\n");
            for(var i=1; i<auth_users.length-1; i++){
                bot.sendMessage(auth_users[i], "\r\n"+getCurrentDateString()+' Смоленщина: из сети вышло ' + (absentSmol.length)+" майнеров:"+ absentSmol+"\r\n");
            }
        } 
        /* // Если вышел из сети хотя б 3, сигналим
        if(absentSmol.length>=3){
            for(authUser in auth_users){
                bot.sendMessage(auth_users[authUser], 'Смоленщина: из сети вышло ' + (absentSmol.length) + ' майнеров:\n'+ absentSmol);
            }
        }    */
        resSmol0 = resSmol;

        // Хешрейт в Смоленщине
        var HRateSmol = await connectSmolDB.query("SELECT SUM(RtHashrate) FROM " + smolDB + ".OtherInfo WHERE IpAddr IN (SELECT IpAddr FROM " + smolDB + ".OnlineMiners WHERE OnlineStatus<>0);", { type: connectSmolDB.QueryTypes.SELECT });
        HRateSmol = Object.values(HRateSmol[0]);
        HRateSmol = parseFloat(HRateSmol[0], 10);
        var decreaseSmol = HRateSmolOld-HRateSmol;
        if((decreaseSmol/HRateSmolOld)*100>=5){
            for(authUser in auth_users){
                bot.sendMessage(auth_users[authUser], 'WARNING! Хешрейт упал на ' + decreaseSmol.toLocaleString('ru') + ' GH/S в Смоленщине');
            }
            fs.appendFileSync(__dirname+"/info.txt", "\r\n"+getCurrentDateString()+" WARNING! Хешрейт упал на " + (decreaseSmol).toLocaleString('ru') + " GH/S в Смоленщине"+"\r\n");
        }
        HRateSmolOld = HRateSmol;
        
        // Проверим время последнего апдейта в БД (тоже в миллисекундах)
        var lastUpdSmol = await connectSmolDB.query("SELECT updatedAt FROM " + smolDB + ".OnlineMiners LIMIT 1");
        lastUpdSmol = Object.values(lastUpdSmol[0]);
        lastUpdSmol = Object.values(lastUpdSmol[0]);
        lastUpdSmol = String(lastUpdSmol[0]);
        lastUpdSmol = Date.parse(lastUpdSmol);
        
        // Если с последнего апдейта прошло полдня (12 часов), то сигналим
        if(currDate-lastUpdSmol>=43200000){
            for(authUser in auth_users){
                bot.sendMessage(auth_users[authUser], 'WARNING! С последнего обновления в БД Смоленщины прошло больше полудня. Проверьте БД и опросчик');
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

    // Мельничная
    try{
        // Получим список этих машинок и выведем вышедших из сети
        var minerListMeln = await connectMelnDB.query("SELECT IpAddr FROM OnlineMiners WHERE OnlineStatus<>0", { type: connectMelnDB.QueryTypes.SELECT});
        var resMeln = [];
        var absentMeln = [];
        for(var i=0; i<minerListMeln.length; i++){
            var ip = Object.values(minerListMeln[i]);
            resMeln.push(ip[0]);
        }
        for(var j=0; j<resMeln0.length; j++){
            if(resMeln.indexOf(resMeln0[j])==-1){
                absentMeln.push(resMeln0[j]);
            }
        }
        // Если вышел из сети хотя б 1, пишем в лог
        if(absentMeln.length>=1){
            fs.appendFileSync(__dirname+"/info.txt", "\r\n"+getCurrentDateString()+' Мельничная: из сети вышло ' + (absentMeln.length)+" майнеров:"+ absentMeln+"\r\n");
            for(var i=1; i<auth_users.length-1; i++){
                bot.sendMessage(auth_users[i], "\r\n"+getCurrentDateString()+' Мельничная: из сети вышло ' + (absentMeln.length)+" майнеров:"+ absentMeln+"\r\n");
            }
        } 
         // Если вышел из сети хотя б 3, сигналим
        if(absentMeln.length>=3){
            for(authUser in auth_users){
                bot.sendMessage(auth_users[authUser], 'Мельничная: из сети вышло ' + (absentMeln.length) + ' майнеров:\n'+ absentMeln);
            }
        }    
       resMeln0 = resMeln;

        // Хешрейт
        var HRateMeln = await connectMelnDB.query("SELECT SUM(RtHashrate) FROM OtherInfo WHERE IpAddr IN (SELECT IpAddr FROM OnlineMiners WHERE OnlineStatus<>0);", { type: connectMelnDB.QueryTypes.SELECT });
        HRateMeln = Object.values(HRateMeln[0]);
        HRateMeln = parseFloat(HRateMeln[0], 10);
        var decreaseMeln = HRateMelnOld-HRateMeln;
        if((decreaseMeln/HRateMelnOld)*100>=5){
            for(authUser in auth_users){
                bot.sendMessage(auth_users[authUser], 'WARNING! Хешрейт упал на ' + decreaseMeln.toLocaleString('ru') + ' GH/S в Мельничной');
            }
            fs.appendFileSync(__dirname+"/info.txt", "\r\n"+getCurrentDateString()+" WARNING! Хешрейт упал на " + (decreaseMeln).toLocaleString('ru') + " GH/S в Мельничной"+"\r\n");
        }
        HRateMelnOld = HRateMeln;
        
        // Проверим время последнего апдейта в БД (тоже в миллисекундах)
        var lastUpdMeln = await connectMelnDB.query("SELECT updatedAt FROM OnlineMiners LIMIT 1");
        lastUpdMeln = Object.values(lastUpdMeln[0]);
        lastUpdMeln = Object.values(lastUpdMeln[0]);
        lastUpdMeln = String(lastUpdMeln[0]);
        lastUpdMeln = Date.parse(lastUpdMeln);
        
        // Если с последнего апдейта прошло полдня (12 часов), то сигналим
        if(currDate-lastUpdMeln>=43200000){
            for(authUser in auth_users){
                bot.sendMessage(auth_users[authUser], 'WARNING! С последнего обновления в БД Мельничной прошло больше полудня. Проверьте БД и опросчик');
            }
        }
    }
    catch(er){
        if(er=="SequelizeConnectionError: connect ETIMEDOUT"){
            for(authUser in auth_users){
                bot.sendMessage(auth_users[authUser], 'WARNING! Нет подключения к БД в Мельничной Пади. Проверьте БД и опросник\n'+er);
            }
        }
        else{
            for(authUser in auth_users){
                bot.sendMessage(auth_users[authUser], 'Error Meln:\n'+er);
            }
        }
    }
}

async function forceShowStats(){
    // Olymp
    try{
        // Количество машинок в Олимпийском
        var fssOlympMiners = await connectOlympDB.query("SELECT COUNT(*) FROM " + olympDB + ".OnlineMiners WHERE OnlineStatus<>0;", { type: connectOlympDB.QueryTypes.SELECT});
        fssOlympMiners = Object.values(fssOlympMiners[0]);
        fssOlympMiners = parseInt(fssOlympMiners[0], 10);

        // Количество живых плат в Олимпийском
        var fssOlympChains = await connectOlympDB.query("SELECT SUM(AliveChains) FROM " + olympDB + ".OtherInfo WHERE IpAddr IN (SELECT IpAddr FROM " + olympDB + ".OnlineMiners WHERE OnlineStatus<>0);", { type: connectOlympDB.QueryTypes.SELECT});
        fssOlympChains = Object.values(fssOlympChains[0]);
        fssOlympChains = parseInt(fssOlympChains, 10);

        // Хешрейт в Олимпийском
        var fssOlympRate = await connectOlympDB.query("SELECT SUM(RtHashrate) FROM " + olympDB + ".OtherInfo WHERE IpAddr IN (SELECT IpAddr FROM " + olympDB + ".OnlineMiners WHERE OnlineStatus<>0);", { type: connectOlympDB.QueryTypes.SELECT});
        fssOlympRate = Object.values(fssOlympRate[0]);
        fssOlympRate = parseFloat(fssOlympRate[0], 10);

        //Выведем машинки с нулевым хешрейтом
        var fssUselessOlymp = await connectOlympDB.query("SELECT IpAddr FROM " + olympDB + ".OtherInfo WHERE IpAddr IN (SELECT IpAddr FROM " + olympDB + ".OnlineMiners WHERE OnlineStatus<>0) AND RtHashrate=0;", { type: connectOlympDB.QueryTypes.SELECT});
        var resUselessOlymp = [];
        for(var i=0; i<fssUselessOlymp.length; i++){
            var ip = Object.values(fssUselessOlymp[i]);
            resUselessOlymp.push(ip[0]);
        }

        // Прочекаем суммарную температуру по майнерам в контейнере (>0)
        var fssSumTemperCont = await connectOlympDB.query("SELECT SUM(AvgTemperature) FROM " + olympDB + ".OtherInfo WHERE IpAddr IN (SELECT IpAddr FROM " + olympDB + ".OnlineMiners WHERE OnlineStatus<>0) AND AvgTemperature>0 AND User LIKE '%cont%' AND User NOT LIKE '%mini%';", { type: connectOlympDB.QueryTypes.SELECT });
        fssSumTemperCont = Object.values(fssSumTemperCont[0]);
        fssSumTemperCont = parseFloat(fssSumTemperCont[0], 10);
        var fssTempCountCont = await connectOlympDB.query("SELECT COUNT(*) FROM " + olympDB + ".OtherInfo WHERE IpAddr IN (SELECT IpAddr FROM " + olympDB + ".OnlineMiners WHERE OnlineStatus<>0) AND AvgTemperature>0 AND User LIKE '%cont%' AND User NOT LIKE '%mini%';", { type: connectOlympDB.QueryTypes.SELECT });
        fssTempCountCont = Object.values(fssTempCountCont[0]);
        fssTempCountCont = parseFloat(fssTempCountCont[0], 10);
        fssSumTemperCont=fssSumTemperCont/fssTempCountCont;

        // Прочекаем суммарную температуру по майнерам в мини-контейнере/будочке (>0)
        var fssSumTemperMCont = await connectOlympDB.query("SELECT SUM(AvgTemperature) FROM " + olympDB + ".OtherInfo WHERE IpAddr IN (SELECT IpAddr FROM " + olympDB + ".OnlineMiners WHERE OnlineStatus<>0) AND AvgTemperature>0 AND User LIKE '%mini%';", { type: connectOlympDB.QueryTypes.SELECT });
        fssSumTemperMCont = Object.values(fssSumTemperMCont[0]);
        fssSumTemperMCont = parseFloat(fssSumTemperMCont[0], 10);
        var fssTempCountMCont = await connectOlympDB.query("SELECT COUNT(*) FROM " + olympDB + ".OtherInfo WHERE IpAddr IN (SELECT IpAddr FROM " + olympDB + ".OnlineMiners WHERE OnlineStatus<>0) AND AvgTemperature>0 AND User LIKE '%mini%';", { type: connectOlympDB.QueryTypes.SELECT });
        fssTempCountMCont = Object.values(fssTempCountMCont[0]);
        fssTempCountMCont = parseFloat(fssTempCountMCont[0], 10);
        fssSumTemperMCont=fssSumTemperMCont/fssTempCountMCont;

        // Прочекаем суммарную температуру по майнерам в основной ферме (>0)
        var fssSumTemper = await connectOlympDB.query("SELECT SUM(AvgTemperature) FROM " + olympDB + ".OtherInfo WHERE IpAddr IN (SELECT IpAddr FROM " + olympDB + ".OnlineMiners WHERE OnlineStatus<>0) AND AvgTemperature>0 AND User LIKE '%OM%';", { type: connectOlympDB.QueryTypes.SELECT });
        fssSumTemper = Object.values(fssSumTemper[0]);
        fssSumTemper = parseFloat(fssSumTemper[0], 10);
        var fssTempCount= await connectOlympDB.query("SELECT COUNT(*) FROM " + olympDB + ".OtherInfo WHERE IpAddr IN (SELECT IpAddr FROM " + olympDB + ".OnlineMiners WHERE OnlineStatus<>0) AND AvgTemperature>0 AND User LIKE '%OM%';", { type: connectOlympDB.QueryTypes.SELECT });
        fssTempCount = Object.values(fssTempCount[0]);
        fssTempCount = parseFloat(fssTempCount[0], 10);
        fssSumTemper=fssSumTemper/fssTempCount;
        
        // Проверим время последнего апдейта в БД
        var fssLUpdOlymp = await connectOlympDB.query("SELECT updatedAt FROM " + olympDB + ".MinerStat LIMIT 1");
        fssLUpdOlymp = Object.values(fssLUpdOlymp[0]);
        fssLUpdOlymp = Object.values(fssLUpdOlymp[0]);
        fssLUpdOlymp = String(fssLUpdOlymp[0]);
        
        for(var i=0; i<auth_users.length-1; i++){
            bot.sendMessage(auth_users[i], 'В Олимпийском: '+'\nМайнеров в сети: '+fssOlympMiners+'\nПлат в сети: '+fssOlympChains+'\nRT-HashRate: ' + fssOlympRate.toLocaleString('ru')+' GH/S' +'\nМайнеров с нулевым Rt-HRate: '+resUselessOlymp.length+'\n'+resUselessOlymp+"\nСредняя температура по ферме: "+fssSumTemper+" °С"+"\nСредняя температура по контейнеру: "+fssSumTemperCont+" °С"+"\nСредняя температура по мини-контейнеру: "+fssSumTemperMCont+" °С"+'\nДата последнего обновления:\n'+fssLUpdOlymp);
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
    // Smol
    try{
        // Количество машинок в Смоленщине
        var fssSmolMiners = await connectSmolDB.query("SELECT COUNT(*) FROM " + smolDB + ".OnlineMiners WHERE OnlineStatus<>0;", { type: connectSmolDB.QueryTypes.SELECT});
        fssSmolMiners = Object.values(fssSmolMiners[0]);
        fssSmolMiners = parseInt(fssSmolMiners[0], 10);

        // Количество живых плат в Смоленщине
        var fssSmolChains = await connectSmolDB.query("SELECT SUM(AliveChains) FROM " + smolDB + ".OtherInfo WHERE IpAddr IN (SELECT IpAddr FROM " + smolDB + ".OnlineMiners WHERE OnlineStatus<>0);", { type: connectSmolDB.QueryTypes.SELECT});
        fssSmolChains = Object.values(fssSmolChains[0]);
        fssSmolChains = parseInt(fssSmolChains, 10);

        // Хешрейт в Смоленщине
        var fssSmolRate = await connectSmolDB.query("SELECT SUM(RtHashrate) FROM " + smolDB + ".OtherInfo WHERE IpAddr IN (SELECT IpAddr FROM " + smolDB + ".OnlineMiners WHERE OnlineStatus<>0);", { type: connectSmolDB.QueryTypes.SELECT});
        fssSmolRate = Object.values(fssSmolRate[0]);
        fssSmolRate = parseFloat(fssSmolRate[0], 10);

        // Прочекаем немайнящие майнеры
        var fssUselessSmol = await connectSmolDB.query("SELECT IpAddr FROM " + smolDB + ".OtherInfo WHERE IpAddr IN (SELECT IpAddr FROM " + smolDB + ".OnlineMiners WHERE OnlineStatus<>0) AND RtHashrate=0;", { type: connectSmolDB.QueryTypes.SELECT});
        var resUselessSmol = [];
        for(var i=0; i<fssUselessSmol.length; i++){
            var ip = Object.values(fssUselessSmol[i]);
            resUselessSmol.push(ip[0]);
        }

        // Прочекаем суммарную температуру по майнерам (>0)
        var fssSumTemperSm = await connectSmolDB.query("SELECT SUM(AvgTemperature) FROM " + smolDB + ".OtherInfo WHERE IpAddr IN (SELECT IpAddr FROM " + smolDB + ".OnlineMiners WHERE OnlineStatus<>0) AND AvgTemperature>0;", { type: connectSmolDB.QueryTypes.SELECT });
        fssSumTemperSm = Object.values(fssSumTemperSm[0]);
        fssSumTemperSm = parseFloat(fssSumTemperSm[0], 10);
        var fssSumTempCountSm = await connectSmolDB.query("SELECT COUNT(*) FROM " + smolDB + ".OtherInfo WHERE IpAddr IN (SELECT IpAddr FROM " + smolDB + ".OnlineMiners WHERE OnlineStatus<>0) AND AvgTemperature>0;", { type: connectSmolDB.QueryTypes.SELECT });
        fssSumTempCountSm = Object.values(fssSumTempCountSm[0]);
        fssSumTempCountSm = parseFloat(fssSumTempCountSm[0], 10);
        fssSumTemperSm=fssSumTemperSm/fssSumTempCountSm;
        
        // Проверим время последнего апдейта в БД
        var fssLUpdSmol = await connectSmolDB.query("SELECT updatedAt FROM " + smolDB + ".OnlineMiners LIMIT 1");
        fssLUpdSmol = Object.values(fssLUpdSmol[0]);
        fssLUpdSmol = Object.values(fssLUpdSmol[0]);
        fssLUpdSmol = String(fssLUpdSmol[0]);
        
        for(var i=0; i<auth_users.length-1; i++){
            bot.sendMessage(auth_users[i], "В Смоленщине: " + "\nМайнеров в сети: " + fssSmolMiners + "\nПлат в сети: " + fssSmolChains + "\nRT-HashRate: " + fssSmolRate.toLocaleString('ru') + " GH/S" +"\nМайнеров с нулевым Rt-HRate: "+resUselessSmol.length+"\n"+resUselessSmol+"\nСредняя температура по ферме: "+fssSumTemperSm+" °С"+ "\nДата последнего обновления:\n" + fssLUpdSmol);
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
    // Meln
    try{
        // Количество машинок 
        var fssMelnMiners = await connectMelnDB.query("SELECT COUNT(*) FROM OnlineMiners WHERE OnlineStatus<>0;", { type: connectMelnDB.QueryTypes.SELECT });
        fssMelnMiners = Object.values(fssMelnMiners[0]);
        fssMelnMiners = parseInt(fssMelnMiners[0], 10);

        // Количество живых плат
        var fssMelnChains = await connectMelnDB.query("SELECT SUM(AliveChains) FROM OtherInfo WHERE IpAddr IN (SELECT IpAddr FROM OnlineMiners WHERE OnlineStatus<>0);", { type: connectMelnDB.QueryTypes.SELECT });
        fssMelnChains = Object.values(fssMelnChains[0]);
        fssMelnChains = parseInt(fssMelnChains, 10);

        // Хешрейт 
        var fssMelnRate = await connectMelnDB.query("SELECT SUM(RtHashrate) FROM OtherInfo WHERE IpAddr IN (SELECT IpAddr FROM OnlineMiners WHERE OnlineStatus<>0);", { type: connectMelnDB.QueryTypes.SELECT });
        fssMelnRate = Object.values(fssMelnRate[0]);
        fssMelnRate = parseFloat(fssMelnRate[0], 10);

        // Прочекаем немайнящие майнеры
        var fssUselessMeln = await connectMelnDB.query("SELECT IpAddr FROM OtherInfo WHERE IpAddr IN (SELECT IpAddr FROM OnlineMiners WHERE OnlineStatus<>0) AND RtHashrate=0;", { type: connectMelnDB.QueryTypes.SELECT});
        var resUselessMeln = [];
        for(var i=0; i<fssUselessMeln.length; i++){
            var ip = Object.values(fssUselessMeln[i]);
            resUselessMeln.push(ip[0]);
        }

        // Прочекаем суммарную температуру по майнерам (>0)
        var fssSumTemper = await connectMelnDB.query("SELECT SUM(AvgTemperature) FROM OtherInfo WHERE IpAddr IN (SELECT IpAddr FROM OnlineMiners WHERE OnlineStatus<>0) AND AvgTemperature>0;", { type: connectMelnDB.QueryTypes.SELECT });
        fssSumTemper = Object.values(fssSumTemper[0]);
        fssSumTemper = parseFloat(fssSumTemper[0], 10);
        var fssSumTempCount = await connectMelnDB.query("SELECT COUNT(*) FROM OtherInfo WHERE IpAddr IN (SELECT IpAddr FROM OnlineMiners WHERE OnlineStatus<>0) AND AvgTemperature>0;", { type: connectMelnDB.QueryTypes.SELECT });
        fssSumTempCount = Object.values(fssSumTempCount[0]);
        fssSumTempCount = parseFloat(fssSumTempCount[0], 10);
        fssSumTemper=fssSumTemper/fssSumTempCount;

        // Проверим время последнего апдейта в БД
        var fssLUpdMeln = await connectMelnDB.query("SELECT updatedAt FROM MinerStat LIMIT 1");
        fssLUpdMeln = Object.values(fssLUpdMeln[0]);
        fssLUpdMeln = Object.values(fssLUpdMeln[0]);
        fssLUpdMeln = String(fssLUpdMeln[0]);
       
        for(var i=0; i<auth_users.length-1; i++){
            bot.sendMessage(auth_users[i], "В Мельничной: " + "\nМайнеров в сети: " + fssMelnMiners + "\nПлат в сети: " + fssMelnChains + "\nRT-HashRate: " + fssMelnRate.toLocaleString('ru') + " GH/S" +"\nМайнеров с нулевым Rt-HRate: "+resUselessMeln.length+"\n"+resUselessMeln+"\nСредняя температура по ферме: "+fssSumTemper+" °С"+ "\nДата последнего обновления:\n" + fssLUpdMeln);
        }
    }
    catch(er){
        if(er=="SequelizeConnectionError: connect ETIMEDOUT"){
            for(authUser in auth_users){
                bot.sendMessage(auth_users[authUser], 'WARNING! Нет подключения к БД в Мельничной. Проверьте БД и опросник\n'+er);
            }
        }
        else{
            for(authUser in auth_users){
                bot.sendMessage(auth_users[authUser], 'Error Meln:\n'+er);
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