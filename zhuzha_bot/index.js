//! DO NOT OVERWRITE THIS LINE!!!!!!! TOKEN 659774347:AAEfl_8UyhYbRi8hOhGyWmcbWSA7SFq9v34

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
    request: {
        agentClass: Agent,
        agentOptions: {
            socksHost: "tgproxy.audd.io",
            socksPort: 1080,
            // If authorization is needed:
            socksUsername: 'user',
            socksPassword: 'password'
        }
        //proxy:'secret@papaproxy.me:443' this is for MTPROTO?
        //proxy:'http://54.38.142.180:54321'
    }
}

const Sequelize = require('sequelize');
// WE CONNECT TO !SMOLENSHINA
var connectSmolDB = new Sequelize('smol2018', 'sa', '`1234qwe', {
    host: '10.0.0.250',
    dialect: 'mysql',
    insecureAuth: true,
    timezone: '+08:00',
    define: { freezeTableName: true },
    logging: false
});
// WE CONNECT TO !OLIMPISKIY
var connectOlympDB = new Sequelize('olymp2018', 'sa', '`1234qwe', {
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
    158076861, // kolyan pc
    507622032, // moar kolyan
    // !INSERT NEW USERS HERE!

    // HERE!
    493911936 // batowha
]

const KEYBOARD = {
    reply_markup: JSON.stringify({
        keyboard: [
            ['Статистика Смоленщина / Stats Smol', 'Статистика Олимпийский / Stats Olymp'],
            ['Помощь / Help', 'Ваш ID / Your ID']
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
    if (match[0] == 'Ваш ID / Your ID') {
        bot.sendMessage(msg.chat.id, 'ID: ' + msg.from.id, KEYBOARD);    
    }
    else if(match[0] == 'Помощь / Help'){
        if (authenticate_users(msg.from.id)) {
            bot.sendMessage(msg.chat.id, "Вы можете нажать на любую кнопку, либо вручную ввести нужную вам команду. Наберите символ слэш, чтобы лицезреть список комманд", KEYBOARD);
        }
        else{
            bot.sendMessage(msg.chat.id, "Чтобы начать работу, сообщите свой Telegram-ID техподдержке", newbieKbrd);
        }
    }  
    else if (authenticate_users(msg.from.id)) {
        bot.sendMessage(msg.chat.id,KEYBOARD); 
        if(match[0] == 'Статистика Смоленщина / Stats Smol'){
            showStatsSmol(msg.chat.id);
        }
        else if(match[0] == 'Статистика Олимпийский / Stats Olymp'){
            showStatsOlymp(msg.chat.id);
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

async function showStatsSmol(chatId){
    console.log('Someone is requesting for Stats in Smol: '+chatId);
    try{
        // Количество машинок в Смоленщине
        var fssSmolMiners = await connectSmolDB.query("SELECT COUNT(*) FROM smol2018.onlineminers WHERE OnlineStatus<>0;", { type: connectSmolDB.QueryTypes.SELECT });
        fssSmolMiners = Object.values(fssSmolMiners[0]);
        fssSmolMiners = parseInt(fssSmolMiners[0], 10);

        // Количество живых плат в Смоленщине
        var fssSmolChains = await connectSmolDB.query("SELECT SUM(AliveChains) FROM smol2018.otherinfo WHERE IpAddr IN (SELECT IpAddr FROM smol2018.onlineminers WHERE OnlineStatus<>0);", { type: connectSmolDB.QueryTypes.SELECT });
        fssSmolChains = Object.values(fssSmolChains[0]);
        fssSmolChains = parseInt(fssSmolChains, 10);

        // Хешрейт в Смоленщине
        var fssSmolRate = await connectSmolDB.query("SELECT SUM(RtHashrate) FROM smol2018.otherinfo WHERE IpAddr IN (SELECT IpAddr FROM smol2018.onlineminers WHERE OnlineStatus<>0);", { type: connectSmolDB.QueryTypes.SELECT });
        fssSmolRate = Object.values(fssSmolRate[0]);
        fssSmolRate = parseFloat(fssSmolRate[0], 10);

        // Прочекаем немайнящие майнеры
        var fssUselessSmol = await connectSmolDB.query("SELECT IpAddr FROM smol2018.otherinfo WHERE IpAddr IN (SELECT IpAddr FROM smol2018.onlineminers WHERE OnlineStatus<>0) AND RtHashrate=0;", { type: connectSmolDB.QueryTypes.SELECT});
        var resUselessSmol = [];
        for(var i=0; i<fssUselessSmol.length; i++){
            var ip = Object.values(fssUselessSmol[i]);
            resUselessSmol.push(ip[0]);
        }

        // Прочекаем суммарную температуру по майнерам (>0)
        var fssSumTemper = await connectSmolDB.query("SELECT SUM(AvgTemperature) FROM smol2018.otherinfo WHERE IpAddr IN (SELECT IpAddr FROM smol2018.onlineminers WHERE OnlineStatus<>0) AND AvgTemperature>0;", { type: connectSmolDB.QueryTypes.SELECT });
        fssSumTemper = Object.values(fssSumTemper[0]);
        fssSumTemper = parseFloat(fssSumTemper[0], 10);
        var fssSumTempCount = await connectSmolDB.query("SELECT COUNT(*) FROM smol2018.otherinfo WHERE IpAddr IN (SELECT IpAddr FROM smol2018.onlineminers WHERE OnlineStatus<>0) AND AvgTemperature>0;", { type: connectSmolDB.QueryTypes.SELECT });
        fssSumTempCount = Object.values(fssSumTempCount[0]);
        fssSumTempCount = parseFloat(fssSumTempCount[0], 10);
        fssSumTemper=fssSumTemper/fssSumTempCount;

        // Проверим время последнего апдейта в БД
        var fssLUpdSmol = await connectSmolDB.query("SELECT updatedAt FROM smol2018.minerstat LIMIT 1");
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

async function showStatsOlymp(chatId){
    console.log('Someone is requesting for Stats in Olymp: '+chatId);
    try{
        // Количество машинок в Олимпийском
        var fssOlympMiners = await connectOlympDB.query("SELECT COUNT(*) FROM olymp2018.onlineminers WHERE OnlineStatus<>0;", { type: connectOlympDB.QueryTypes.SELECT});
        fssOlympMiners = Object.values(fssOlympMiners[0]);
        fssOlympMiners = parseInt(fssOlympMiners[0], 10);

        // Количество живых плат в Олимпийском
        var fssOlympChains = await connectOlympDB.query("SELECT SUM(AliveChains) FROM olymp2018.otherinfo WHERE IpAddr IN (SELECT IpAddr FROM olymp2018.onlineminers WHERE OnlineStatus<>0);", { type: connectOlympDB.QueryTypes.SELECT});
        fssOlympChains = Object.values(fssOlympChains[0]);
        fssOlympChains = parseInt(fssOlympChains, 10);

        // Хешрейт в Олимпийском
        var fssOlympRate = await connectOlympDB.query("SELECT SUM(RtHashrate) FROM olymp2018.otherinfo WHERE IpAddr IN (SELECT IpAddr FROM olymp2018.onlineminers WHERE OnlineStatus<>0);", { type: connectOlympDB.QueryTypes.SELECT});
        fssOlympRate = Object.values(fssOlympRate[0]);
        fssOlympRate = parseFloat(fssOlympRate[0], 10);

        // Прочекаем немайнящие майнеры
        var fssUselessOlymp = await connectOlympDB.query("SELECT IpAddr FROM olymp2018.otherinfo WHERE IpAddr IN (SELECT IpAddr FROM olymp2018.onlineminers WHERE OnlineStatus<>0) AND RtHashrate=0;", { type: connectOlympDB.QueryTypes.SELECT});
        var resUselessOlymp = [];
        for(var i=0; i<fssUselessOlymp.length; i++){
            var ip = Object.values(fssUselessOlymp[i]);
            resUselessOlymp.push(ip[0]);
        }
        
        // Прочекаем суммарную температуру по майнерам в контейнере (>0)
        var fssSumTemperCont = await connectOlympDB.query("SELECT SUM(AvgTemperature) FROM olymp2018.otherinfo WHERE IpAddr IN (SELECT IpAddr FROM olymp2018.onlineminers WHERE OnlineStatus<>0) AND AvgTemperature>0 AND User LIKE '%OL-CONT%';", { type: connectOlympDB.QueryTypes.SELECT });
        fssSumTemperCont = Object.values(fssSumTemperCont[0]);
        fssSumTemperCont = parseFloat(fssSumTemperCont[0], 10);
        var fssTempCountCont = await connectOlympDB.query("SELECT COUNT(*) FROM olymp2018.otherinfo WHERE IpAddr IN (SELECT IpAddr FROM olymp2018.onlineminers WHERE OnlineStatus<>0) AND AvgTemperature>0 AND User LIKE '%OL-CONT%';", { type: connectOlympDB.QueryTypes.SELECT });
        fssTempCountCont = Object.values(fssTempCountCont[0]);
        fssTempCountCont = parseFloat(fssTempCountCont[0], 10);
        fssSumTemperCont=fssSumTemperCont/fssTempCountCont;

        // Прочекаем суммарную температуру по майнерам в мини-контейнере/будочке (>0)
        var fssSumTemperMCont = await connectOlympDB.query("SELECT SUM(AvgTemperature) FROM olymp2018.otherinfo WHERE IpAddr IN (SELECT IpAddr FROM olymp2018.onlineminers WHERE OnlineStatus<>0) AND AvgTemperature>0 AND User LIKE '%OLmini%';", { type: connectOlympDB.QueryTypes.SELECT });
        fssSumTemperMCont = Object.values(fssSumTemperMCont[0]);
        fssSumTemperMCont = parseFloat(fssSumTemperMCont[0], 10);
        var fssTempCountMCont = await connectOlympDB.query("SELECT COUNT(*) FROM olymp2018.otherinfo WHERE IpAddr IN (SELECT IpAddr FROM olymp2018.onlineminers WHERE OnlineStatus<>0) AND AvgTemperature>0 AND User LIKE '%OLmini%';", { type: connectOlympDB.QueryTypes.SELECT });
        fssTempCountMCont = Object.values(fssTempCountMCont[0]);
        fssTempCountMCont = parseFloat(fssTempCountMCont[0], 10);
        fssSumTemperMCont=fssSumTemperMCont/fssTempCountMCont;

        // Прочекаем суммарную температуру по майнерам в основной ферме (>0)
        var fssSumTemper = await connectOlympDB.query("SELECT SUM(AvgTemperature) FROM olymp2018.otherinfo WHERE IpAddr IN (SELECT IpAddr FROM olymp2018.onlineminers WHERE OnlineStatus<>0) AND AvgTemperature>0 AND User NOT LIKE '%CONT%';", { type: connectOlympDB.QueryTypes.SELECT });
        fssSumTemper = Object.values(fssSumTemper[0]);
        fssSumTemper = parseFloat(fssSumTemper[0], 10);
        var fssTempCount= await connectOlympDB.query("SELECT COUNT(*) FROM olymp2018.otherinfo WHERE IpAddr IN (SELECT IpAddr FROM olymp2018.onlineminers WHERE OnlineStatus<>0) AND AvgTemperature>0 AND User NOT LIKE '%CONT%';", { type: connectOlympDB.QueryTypes.SELECT });
        fssTempCount = Object.values(fssTempCount[0]);
        fssTempCount = parseFloat(fssTempCount[0], 10);
        fssSumTemper=fssSumTemper/fssTempCount;

        // Проверим время последнего апдейта в БД
        var fssLUpdOlymp = await connectOlympDB.query("SELECT updatedAt FROM olymp2018.onlineminers LIMIT 1");
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
    // Requesting all for one time when the app starts
    setTimeout(alert, 10000);
    // and then we repeat
    setInterval(alert, 480000);
    //forceShowStats();
    setInterval(forceShowStats, 7200000);

    var HRateOlympOld, HRateSmolOld;
    var resOlymp0 = []; 
    var resSmol0 = [];

async function alert(){
    // Текущее время вызова в миллисекундах
    var currDate = getCurrentDate();
    
    try{
        // Получим список этих машинок и выведем вышедших из сети
        var minerListOlymp = await connectOlympDB.query("SELECT IpAddr FROM olymp2018.onlineminers WHERE OnlineStatus<>0", { type: connectOlympDB.QueryTypes.SELECT});
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
        var HRateOlymp = await connectOlympDB.query("SELECT SUM(RtHashrate) FROM olymp2018.otherinfo WHERE IpAddr IN (SELECT IpAddr FROM olymp2018.onlineminers WHERE OnlineStatus<>0);", { type: connectOlympDB.QueryTypes.SELECT});
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
        var lastUpdOlymp = await connectOlympDB.query("SELECT updatedAt FROM olymp2018.onlineminers LIMIT 1");
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
    try{
        // Получим список этих машинок и выведем вышедших из сети
        var minerListSmol = await connectSmolDB.query("SELECT IpAddr FROM smol2018.onlineminers WHERE OnlineStatus<>0", { type: connectSmolDB.QueryTypes.SELECT});
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
        var HRateSmol = await connectSmolDB.query("SELECT SUM(RtHashrate) FROM smol2018.otherinfo WHERE IpAddr IN (SELECT IpAddr FROM smol2018.onlineminers WHERE OnlineStatus<>0);", { type: connectSmolDB.QueryTypes.SELECT });
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
        var lastUpdSmol = await connectSmolDB.query("SELECT updatedAt FROM smol2018.onlineminers LIMIT 1");
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
}

async function forceShowStats(){
    try{
        // Количество машинок в Олимпийском
        var fssOlympMiners = await connectOlympDB.query("SELECT COUNT(*) FROM olymp2018.onlineminers WHERE OnlineStatus<>0;", { type: connectOlympDB.QueryTypes.SELECT});
        fssOlympMiners = Object.values(fssOlympMiners[0]);
        fssOlympMiners = parseInt(fssOlympMiners[0], 10);

        // Количество живых плат в Олимпийском
        var fssOlympChains = await connectOlympDB.query("SELECT SUM(AliveChains) FROM olymp2018.otherinfo WHERE IpAddr IN (SELECT IpAddr FROM olymp2018.onlineminers WHERE OnlineStatus<>0);", { type: connectOlympDB.QueryTypes.SELECT});
        fssOlympChains = Object.values(fssOlympChains[0]);
        fssOlympChains = parseInt(fssOlympChains, 10);

        // Хешрейт в Олимпийском
        var fssOlympRate = await connectOlympDB.query("SELECT SUM(RtHashrate) FROM olymp2018.otherinfo WHERE IpAddr IN (SELECT IpAddr FROM olymp2018.onlineminers WHERE OnlineStatus<>0);", { type: connectOlympDB.QueryTypes.SELECT});
        fssOlympRate = Object.values(fssOlympRate[0]);
        fssOlympRate = parseFloat(fssOlympRate[0], 10);

        //Выведем машинки с нулевым хешрейтом
        var fssUselessOlymp = await connectOlympDB.query("SELECT IpAddr FROM olymp2018.otherinfo WHERE IpAddr IN (SELECT IpAddr FROM olymp2018.onlineminers WHERE OnlineStatus<>0) AND RtHashrate=0;", { type: connectOlympDB.QueryTypes.SELECT});
        var resUselessOlymp = [];
        for(var i=0; i<fssUselessOlymp.length; i++){
            var ip = Object.values(fssUselessOlymp[i]);
            resUselessOlymp.push(ip[0]);
        }

        // Прочекаем суммарную температуру по майнерам в контейнере (>0)
        var fssSumTemperCont = await connectOlympDB.query("SELECT SUM(AvgTemperature) FROM olymp2018.otherinfo WHERE IpAddr IN (SELECT IpAddr FROM olymp2018.onlineminers WHERE OnlineStatus<>0) AND AvgTemperature>0 AND User LIKE '%OL-CONT%';", { type: connectOlympDB.QueryTypes.SELECT });
        fssSumTemperCont = Object.values(fssSumTemperCont[0]);
        fssSumTemperCont = parseFloat(fssSumTemperCont[0], 10);
        var fssTempCountCont = await connectOlympDB.query("SELECT COUNT(*) FROM olymp2018.otherinfo WHERE IpAddr IN (SELECT IpAddr FROM olymp2018.onlineminers WHERE OnlineStatus<>0) AND AvgTemperature>0 AND User LIKE '%OL-CONT%';", { type: connectOlympDB.QueryTypes.SELECT });
        fssTempCountCont = Object.values(fssTempCountCont[0]);
        fssTempCountCont = parseFloat(fssTempCountCont[0], 10);
        fssSumTemperCont=fssSumTemperCont/fssTempCountCont;

        // Прочекаем суммарную температуру по майнерам в мини-контейнере/будочке (>0)
        var fssSumTemperMCont = await connectOlympDB.query("SELECT SUM(AvgTemperature) FROM olymp2018.otherinfo WHERE IpAddr IN (SELECT IpAddr FROM olymp2018.onlineminers WHERE OnlineStatus<>0) AND AvgTemperature>0 AND User LIKE '%OLmini%';", { type: connectOlympDB.QueryTypes.SELECT });
        fssSumTemperMCont = Object.values(fssSumTemperMCont[0]);
        fssSumTemperMCont = parseFloat(fssSumTemperMCont[0], 10);
        var fssTempCountMCont = await connectOlympDB.query("SELECT COUNT(*) FROM olymp2018.otherinfo WHERE IpAddr IN (SELECT IpAddr FROM olymp2018.onlineminers WHERE OnlineStatus<>0) AND AvgTemperature>0 AND User LIKE '%OLmini%';", { type: connectOlympDB.QueryTypes.SELECT });
        fssTempCountMCont = Object.values(fssTempCountMCont[0]);
        fssTempCountMCont = parseFloat(fssTempCountMCont[0], 10);
        fssSumTemperMCont=fssSumTemperMCont/fssTempCountMCont;

        // Прочекаем суммарную температуру по майнерам в основной ферме (>0)
        var fssSumTemper = await connectOlympDB.query("SELECT SUM(AvgTemperature) FROM olymp2018.otherinfo WHERE IpAddr IN (SELECT IpAddr FROM olymp2018.onlineminers WHERE OnlineStatus<>0) AND AvgTemperature>0 AND User NOT LIKE '%CONT%';", { type: connectOlympDB.QueryTypes.SELECT });
        fssSumTemper = Object.values(fssSumTemper[0]);
        fssSumTemper = parseFloat(fssSumTemper[0], 10);
        var fssTempCount= await connectOlympDB.query("SELECT COUNT(*) FROM olymp2018.otherinfo WHERE IpAddr IN (SELECT IpAddr FROM olymp2018.onlineminers WHERE OnlineStatus<>0) AND AvgTemperature>0 AND User NOT LIKE '%CONT%';", { type: connectOlympDB.QueryTypes.SELECT });
        fssTempCount = Object.values(fssTempCount[0]);
        fssTempCount = parseFloat(fssTempCount[0], 10);
        fssSumTemper=fssSumTemper/fssTempCount;
        
        // Проверим время последнего апдейта в БД
        var fssLUpdOlymp = await connectOlympDB.query("SELECT updatedAt FROM olymp2018.minerstat LIMIT 1");
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
    try{
        // Количество машинок в Смоленщине
        var fssSmolMiners = await connectSmolDB.query("SELECT COUNT(*) FROM smol2018.onlineminers WHERE OnlineStatus<>0;", { type: connectSmolDB.QueryTypes.SELECT});
        fssSmolMiners = Object.values(fssSmolMiners[0]);
        fssSmolMiners = parseInt(fssSmolMiners[0], 10);

        // Количество живых плат в Смоленщине
        var fssSmolChains = await connectSmolDB.query("SELECT SUM(AliveChains) FROM smol2018.otherinfo WHERE IpAddr IN (SELECT IpAddr FROM smol2018.onlineminers WHERE OnlineStatus<>0);", { type: connectSmolDB.QueryTypes.SELECT});
        fssSmolChains = Object.values(fssSmolChains[0]);
        fssSmolChains = parseInt(fssSmolChains, 10);

        // Хешрейт в Смоленщине
        var fssSmolRate = await connectSmolDB.query("SELECT SUM(RtHashrate) FROM smol2018.otherinfo WHERE IpAddr IN (SELECT IpAddr FROM smol2018.onlineminers WHERE OnlineStatus<>0);", { type: connectSmolDB.QueryTypes.SELECT});
        fssSmolRate = Object.values(fssSmolRate[0]);
        fssSmolRate = parseFloat(fssSmolRate[0], 10);

        // Прочекаем немайнящие майнеры
        var fssUselessSmol = await connectSmolDB.query("SELECT IpAddr FROM smol2018.otherinfo WHERE IpAddr IN (SELECT IpAddr FROM smol2018.onlineminers WHERE OnlineStatus<>0) AND RtHashrate=0;", { type: connectSmolDB.QueryTypes.SELECT});
        var resUselessSmol = [];
        for(var i=0; i<fssUselessSmol.length; i++){
            var ip = Object.values(fssUselessSmol[i]);
            resUselessSmol.push(ip[0]);
        }

        // Прочекаем суммарную температуру по майнерам (>0)
        var fssSumTemperSm = await connectSmolDB.query("SELECT SUM(AvgTemperature) FROM smol2018.otherinfo WHERE IpAddr IN (SELECT IpAddr FROM smol2018.onlineminers WHERE OnlineStatus<>0) AND AvgTemperature>0;", { type: connectSmolDB.QueryTypes.SELECT });
        fssSumTemperSm = Object.values(fssSumTemperSm[0]);
        fssSumTemperSm = parseFloat(fssSumTemperSm[0], 10);
        var fssSumTempCountSm = await connectSmolDB.query("SELECT COUNT(*) FROM smol2018.otherinfo WHERE IpAddr IN (SELECT IpAddr FROM smol2018.onlineminers WHERE OnlineStatus<>0) AND AvgTemperature>0;", { type: connectSmolDB.QueryTypes.SELECT });
        fssSumTempCountSm = Object.values(fssSumTempCountSm[0]);
        fssSumTempCountSm = parseFloat(fssSumTempCountSm[0], 10);
        fssSumTemperSm=fssSumTemperSm/fssSumTempCountSm;
        
        // Проверим время последнего апдейта в БД
        var fssLUpdSmol = await connectSmolDB.query("SELECT updatedAt FROM smol2018.onlineminers LIMIT 1");
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