//! DO NOT OVERWRITE THIS LINE!!!!!!! TOKEN 659774347:AAEfl_8UyhYbRi8hOhGyWmcbWSA7SFq9v34

const TOKEN = process.env.TELEGRAM_TOKEN || '659774347:AAEfl_8UyhYbRi8hOhGyWmcbWSA7SFq9v34'
const TelegramBot = require('node-telegram-bot-api')
const Agent = require('socks5-https-client/lib/Agent');
const options = {
    polling: true,
    request: {
        agentClass: Agent,
        agentOptions: {
            socksHost: "45.63.124.134",
            socksPort: 1080
            // If authorization is needed:
            // socksUsername: process.env.PROXY_SOCKS5_USERNAME,
            // socksPassword: process.env.PROXY_SOCKS5_PASSWORD
        }
    }
}
const req = require('request-promise');

const Sequelize = require('sequelize');
// WE CONNECT TO !SMOLENSHINA
var connectSmolDB = new Sequelize('smol_v5', 'sa', '`1234qwe', {
    host: '10.0.0.250',
    dialect: 'mysql',
    insecureAuth: true,
    timezone: '+08:00',
    define: { freezeTableName: true },
    logging: false
});
// WE CONNECT TO !OLIMPISKIY
var connectOlympDB = new Sequelize('olymp_v2', 'sa', '`1234qwe', {
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
    158076861, // nikola
    493911936, // batoha
    507622032 // moar nikola
]

const KEYBOARD = {
    reply_markup: JSON.stringify({
        keyboard: [
            ['Ваш ID / Your ID', 'Помощь / Help'],
            ['Статистика Смоленщина / Stats Smol', 'Статистика Олимпийский / Stats Olymp']
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
    bot.sendMessage(msg.chat.id, "Добро пожаловать! Пожалуйста, сообщите свой Telegram-ID в саппорт для правильной работы бота", KEYBOARD);
});
bot.onText(/\/help/, (msg, match) => {
    bot.sendMessage(msg.chat.id, "Для использования данного бота сообщите свой Telegram-ID в саппорт\nKeyboard restored, by the way", KEYBOARD);
});

// NOW WE HEAR YOUR COMMANDS
bot.onText(/(.+)/, (msg, match) => {
    if (match[0] == 'Ваш ID / Your ID') {
        bot.sendMessage(msg.chat.id, 'ID: ' + msg.from.id + '\nЕсли вы еще не сообщили свой Telegram-ID разработчику, то лучше это сделать)', KEYBOARD);    
    }
    else if(match[0] == 'Помощь / Help'){
        bot.sendMessage(msg.chat.id, 'Выберите любую кнопку или введите /help для вывода списка комманд.', KEYBOARD);
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
    console.log('Someone is requesting for Stats in Smol: '+chatId);
    try{
        // Количество машинок в Смоленщине
        var fssSmolMiners = await connectSmolDB.query("SELECT COUNT(*) FROM smol_v5.minerstat WHERE Type<>'error';", { type: connectSmolDB.QueryTypes.SELECT });
        fssSmolMiners = Object.values(fssSmolMiners[0]);
        fssSmolMiners = parseInt(fssSmolMiners[0], 10);

        // Количество живых плат в Смоленщине
        var fssSmolChains = await connectSmolDB.query("SELECT SUM(AliveChains) FROM smol_v5.otherinfo WHERE IpAddr IN (SELECT IpAddr FROM smol_v5.minerstat WHERE Type<>'error');", { type: connectSmolDB.QueryTypes.SELECT });
        fssSmolChains = Object.values(fssSmolChains[0]);
        fssSmolChains = parseInt(fssSmolChains, 10);

        // Хешрейт в Смоленщине
        var fssSmolRate = await connectSmolDB.query("SELECT SUM(RtHashrate) FROM smol_v5.otherinfo WHERE IpAddr IN (SELECT IpAddr FROM smol_v5.minerstat WHERE Type<>'error');", { type: connectSmolDB.QueryTypes.SELECT });
        fssSmolRate = Object.values(fssSmolRate[0]);
        fssSmolRate = parseFloat(fssSmolRate[0], 10);

        // Прочекаем немайнящие майнеры
        var fssUselessSmol = await connectSmolDB.query("SELECT IpAddr FROM smol_v5.otherinfo WHERE IpAddr IN (SELECT IpAddr FROM smol_v5.minerstat WHERE Type<>'error') AND RtHashrate=0 AND AvgHashrate=0;", { type: connectSmolDB.QueryTypes.SELECT});
        var resUselessSmol = [];
        for(var i=0; i<fssUselessSmol.length; i++){
            var ip = Object.values(fssUselessSmol[i]);
            resUselessSmol.push(ip[0]);
        }

        // Проверим время последнего апдейта в БД
        var fssLUpdSmol = await connectSmolDB.query("SELECT updatedAt FROM smol_v5.minerstat LIMIT 1");
        fssLUpdSmol = Object.values(fssLUpdSmol[0]);
        fssLUpdSmol = Object.values(fssLUpdSmol[0]);
        fssLUpdSmol = String(fssLUpdSmol[0]);
       
        bot.sendMessage(chatId, 'В Смоленщине: ' + '\nМайнеров в сети: ' + fssSmolMiners + '\nПлат в сети: ' + fssSmolChains + '\nRT-HashRate: ' + fssSmolRate.toLocaleString('ru') + ' GH/S' +'\nМайнеров с нулевым Rt&Avg HRate: '+resUselessSmol.length+'\n'+resUselessSmol+ '\nДата последнего обновления:\n' + fssLUpdSmol);
        
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
        var fssOlympMiners = await connectOlympDB.query("SELECT COUNT(*) FROM olymp_v2.minerstat WHERE Type<>'error';", { type: connectOlympDB.QueryTypes.SELECT});
        fssOlympMiners = Object.values(fssOlympMiners[0]);
        fssOlympMiners = parseInt(fssOlympMiners[0], 10);

        // Количество живых плат в Олимпийском
        var fssOlympChains = await connectOlympDB.query("SELECT SUM(AliveChains) FROM olymp_v2.otherinfo WHERE IpAddr IN (SELECT IpAddr FROM olymp_v2.minerstat WHERE Type<>'error');", { type: connectOlympDB.QueryTypes.SELECT});
        fssOlympChains = Object.values(fssOlympChains[0]);
        fssOlympChains = parseInt(fssOlympChains, 10);

        // Хешрейт в Олимпийском
        var fssOlympRate = await connectOlympDB.query("SELECT SUM(RtHashrate) FROM olymp_v2.otherinfo WHERE IpAddr IN (SELECT IpAddr FROM olymp_v2.minerstat WHERE Type<>'error');", { type: connectOlympDB.QueryTypes.SELECT});
        fssOlympRate = Object.values(fssOlympRate[0]);
        fssOlympRate = parseFloat(fssOlympRate[0], 10);

        // Прочекаем немайнящие майнеры
        var fssUselessOlymp = await connectOlympDB.query("SELECT IpAddr FROM olymp_v2.otherinfo WHERE IpAddr IN (SELECT IpAddr FROM olymp_v2.minerstat WHERE Type<>'error') AND RtHashrate=0 AND AvgHashrate=0;", { type: connectOlympDB.QueryTypes.SELECT});
        var resUselessOlymp = [];
        for(var i=0; i<fssUselessOlymp.length; i++){
            var ip = Object.values(fssUselessOlymp[i]);
            resUselessOlymp.push(ip[0]);
        }
        
        // Проверим время последнего апдейта в БД
        var fssLUpdOlymp = await connectOlympDB.query("SELECT updatedAt FROM olymp_v2.minerstat LIMIT 1");
        fssLUpdOlymp = Object.values(fssLUpdOlymp[0]);
        fssLUpdOlymp = Object.values(fssLUpdOlymp[0]);
        fssLUpdOlymp = String(fssLUpdOlymp[0]);
        
        bot.sendMessage(chatId, 'В Олимпийском: '+'\nМайнеров в сети: '+fssOlympMiners+'\nПлат в сети: '+fssOlympChains+'\nRT-HashRate: ' + fssOlympRate.toLocaleString('ru')+' GH/S' +'\nМайнеров с нулевым Rt&Avg HRate: '+resUselessOlymp.length+'\n'+resUselessOlymp+ '\nДата последнего обновления:\n'+fssLUpdOlymp); 
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
    //forceShowStats();
    setTimeout(alert, 10000);
    // and then we fight, like men in tights
    setInterval(alert, 480000);
    setInterval(forceShowStats, 7200000);



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
        /* // Количество машинок в Олимпийском
        var minerCountOlymp = await connectOlympDB.query("SELECT COUNT(*) FROM olymp_v2.minerstat WHERE Type<>'error'", { type: connectOlympDB.QueryTypes.SELECT});
        minerCountOlymp = Object.values(minerCountOlymp[0]);
        minerCountOlymp = parseInt(minerCountOlymp[0], 10); */
        // Получим список этих машинок и выведем вышедших из сети
        var minerListOlymp = await connectOlympDB.query("SELECT IpAddr FROM olymp_v2.minerstat WHERE Type<>'error'", { type: connectOlympDB.QueryTypes.SELECT});
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
        // Количество живых плат в Олимпийском
        /* var aliveChainsCountOlymp = await connectOlympDB.query("SELECT SUM(AliveChains) FROM olymp_v2.otherinfo WHERE IpAddr IN (SELECT IpAddr FROM olymp_v2.minerstat WHERE Type<>'error');", { type: connectOlympDB.QueryTypes.SELECT});
        aliveChainsCountOlymp = Object.values(aliveChainsCountOlymp[0]);
        aliveChainsCountOlymp = parseInt(aliveChainsCountOlymp, 10); */
        
        // Если вышел из сети хотя б 1, сигналим
        //if(olympMiners-minerCountOlymp>=1){
            if(absentOlymp.length!=0){
                for(authUser in auth_users){
                    /* bot.sendMessage(auth_users[authUser], 'Из сети вышло ' + (olympMiners-minerCountOlymp) + ' майнеров в Олимпийском:\n'+ absentOlymp); */
                    bot.sendMessage(auth_users[authUser], 'Из сети вышло ' + (absentOlymp.length) + ' майнеров в Олимпийском:\n'+ absentOlymp);
                }
            }   
            /* for(authUser in auth_users){
                bot.sendMessage(auth_users[authUser], 'Из сети вышло ' + (olympChains-aliveChainsCountOlymp) + ' плат в Олимпийском');
            } */  
        //}
        //olympChains = aliveChainsCountOlymp;
        resOlymp0 = resOlymp;
        //olympMiners = minerCountOlymp;

        // Хешрейт в Олимпийском
        var sumHrateOlymp = await connectOlympDB.query("SELECT SUM(RtHashrate) FROM olymp_v2.otherinfo WHERE IpAddr IN (SELECT IpAddr FROM olymp_v2.minerstat WHERE Type<>'error');", { type: connectOlympDB.QueryTypes.SELECT});
        sumHrateOlymp = Object.values(sumHrateOlymp[0]);
        sumHrateOlymp = parseFloat(sumHrateOlymp[0], 10);
        if(sumHrateOlymp/olympRate<=0.95){
            for(authUser in auth_users){
                bot.sendMessage(auth_users[authUser], 'WARNING! Хешрейт упал на ' + (olympRate-sumHrateOlymp).toLocaleString('ru') + ' GH/S в Олимпийском');
            }
        }
        olympRate = sumHrateOlymp;
        
        // Проверим время последнего апдейта в БД (тоже в миллисекундах)
        var lastUpdOlymp = await connectOlympDB.query("SELECT updatedAt FROM olymp_v2.minerstat LIMIT 1");
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
        // Количество машинок в Смоленщине
        var minerCountSmol = await connectSmolDB.query("SELECT COUNT(*) FROM smol_v5.minerstat WHERE Type<>'error';", { type: connectSmolDB.QueryTypes.SELECT });
        minerCountSmol = Object.values(minerCountSmol[0]);
        minerCountSmol = parseInt(minerCountSmol[0], 10);
        // Получим список этих машинок и выведем вышедших из сети
        var minerListSmol = await connectSmolDB.query("SELECT IpAddr FROM smol_v5.minerstat WHERE Type<>'error'", { type: connectSmolDB.QueryTypes.SELECT});
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
        var aliveChainsCountSmol = await connectSmolDB.query("SELECT SUM(AliveChains) FROM smol_v5.otherinfo WHERE IpAddr IN (SELECT IpAddr FROM smol_v5.minerstat WHERE Type<>'error');", { type: connectSmolDB.QueryTypes.SELECT });
        aliveChainsCountSmol = Object.values(aliveChainsCountSmol[0]);
        aliveChainsCountSmol = parseInt(aliveChainsCountSmol, 10);
        
        // Если вышел из сети хотя б 1, сигналим
        if(smolMiners-minerCountSmol>=1){
            if(absentSmol.length!=0){
                for(authUser in auth_users){
                    bot.sendMessage(auth_users[authUser], 'Из сети вышло ' + (smolMiners-minerCountSmol) + ' майнеров в Смоленщине:\n' + absentSmol);
                }
            }
            /* for(authUser in auth_users){
                bot.sendMessage(auth_users[authUser], 'Из сети вышло ' + (smolChains-aliveChainsCountSmol) + ' плат в Смоленщине');
            } */
        }
        smolChains = aliveChainsCountSmol;
        smolMiners = minerCountSmol;
        resSmol0 = resSmol;
        // Хешрейт в Смоленщине
        var sumHrateSmol = await connectSmolDB.query("SELECT SUM(RtHashrate) FROM smol_v5.otherinfo WHERE IpAddr IN (SELECT IpAddr FROM smol_v5.minerstat WHERE Type<>'error');", { type: connectSmolDB.QueryTypes.SELECT });
        sumHrateSmol = Object.values(sumHrateSmol[0]);
        sumHrateSmol = parseFloat(sumHrateSmol[0], 10);
        if(sumHrateSmol/smolRate<=0.95){
            for(authUser in auth_users){
                bot.sendMessage(auth_users[authUser], 'WARNING! Хешрейт упал на ' + (smolRate-sumHrateSmol).toLocaleString('ru') + ' GH/S в Смоленщине');
            }
        }
        smolRate = sumHrateSmol;
        
        // Проверим время последнего апдейта в БД (тоже в миллисекундах)
        var lastUpdSmol = await connectSmolDB.query("SELECT updatedAt FROM smol_v5.minerstat LIMIT 1");
        lastUpdSmol = Object.values(lastUpdSmol[0]);
        lastUpdSmol = Object.values(lastUpdSmol[0]);
        lastUpdSmol = String(lastUpdSmol[0]);
    
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

async function forceShowStats(){
    try{
        // Количество машинок в Олимпийском
        var fssOlympMiners = await connectOlympDB.query("SELECT COUNT(*) FROM olymp_v2.minerstat WHERE Type<>'error';", { type: connectOlympDB.QueryTypes.SELECT});
        fssOlympMiners = Object.values(fssOlympMiners[0]);
        fssOlympMiners = parseInt(fssOlympMiners[0], 10);

        // Количество живых плат в Олимпийском
        var fssOlympChains = await connectOlympDB.query("SELECT SUM(AliveChains) FROM olymp_v2.otherinfo WHERE IpAddr IN (SELECT IpAddr FROM olymp_v2.minerstat WHERE Type<>'error');", { type: connectOlympDB.QueryTypes.SELECT});
        fssOlympChains = Object.values(fssOlympChains[0]);
        fssOlympChains = parseInt(fssOlympChains, 10);

        // Хешрейт в Олимпийском
        var fssOlympRate = await connectOlympDB.query("SELECT SUM(RtHashrate) FROM olymp_v2.otherinfo WHERE IpAddr IN (SELECT IpAddr FROM olymp_v2.minerstat WHERE Type<>'error');", { type: connectOlympDB.QueryTypes.SELECT});
        fssOlympRate = Object.values(fssOlympRate[0]);
        fssOlympRate = parseFloat(fssOlympRate[0], 10);

        //Выведем машинки с нулевым хешрейтом
        var fssUselessOlymp = await connectOlympDB.query("SELECT IpAddr FROM olymp_v2.otherinfo WHERE IpAddr IN (SELECT IpAddr FROM olymp_v2.minerstat WHERE Type<>'error') AND RtHashrate=0 AND AvgHashrate=0;", { type: connectOlympDB.QueryTypes.SELECT});
        var resUselessOlymp = [];
        for(var i=0; i<fssUselessOlymp.length; i++){
            var ip = Object.values(fssUselessOlymp[i]);
            resUselessOlymp.push(ip[0]);
        }
        
        // Проверим время последнего апдейта в БД
        var fssLUpdOlymp = await connectOlympDB.query("SELECT updatedAt FROM olymp_v2.minerstat LIMIT 1");
        fssLUpdOlymp = Object.values(fssLUpdOlymp[0]);
        fssLUpdOlymp = Object.values(fssLUpdOlymp[0]);
        fssLUpdOlymp = String(fssLUpdOlymp[0]);
        
        for(authUser in auth_users){
            bot.sendMessage(auth_users[authUser], 'В Олимпийском: '+'\nМайнеров в сети: '+fssOlympMiners+'\nПлат в сети: '+fssOlympChains+'\nRT-HashRate: ' + fssOlympRate.toLocaleString('ru')+' GH/S' +'\nМайнеров с нулевым Rt&Avg HRate: '+resUselessOlymp.length+'\n'+resUselessOlymp+ '\nДата последнего обновления:\n'+fssLUpdOlymp);
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
        var fssSmolMiners = await connectSmolDB.query("SELECT COUNT(*) FROM smol_v5.minerstat WHERE Type<>'error';", { type: connectSmolDB.QueryTypes.SELECT});
        fssSmolMiners = Object.values(fssSmolMiners[0]);
        fssSmolMiners = parseInt(fssSmolMiners[0], 10);

        // Количество живых плат в Смоленщине
        var fssSmolChains = await connectSmolDB.query("SELECT SUM(AliveChains) FROM smol_v5.otherinfo WHERE IpAddr IN (SELECT IpAddr FROM smol_v5.minerstat WHERE Type<>'error');", { type: connectSmolDB.QueryTypes.SELECT});
        fssSmolChains = Object.values(fssSmolChains[0]);
        fssSmolChains = parseInt(fssSmolChains, 10);

        // Хешрейт в Смоленщине
        var fssSmolRate = await connectSmolDB.query("SELECT SUM(RtHashrate) FROM smol_v5.otherinfo WHERE IpAddr IN (SELECT IpAddr FROM smol_v5.minerstat WHERE Type<>'error');", { type: connectSmolDB.QueryTypes.SELECT});
        fssSmolRate = Object.values(fssSmolRate[0]);
        fssSmolRate = parseFloat(fssSmolRate[0], 10);

        // Прочекаем немайнящие майнеры
        var fssUselessSmol = await connectSmolDB.query("SELECT IpAddr FROM smol_v5.otherinfo WHERE IpAddr IN (SELECT IpAddr FROM smol_v5.minerstat WHERE Type<>'error') AND RtHashrate=0 AND AvgHashrate=0;", { type: connectSmolDB.QueryTypes.SELECT});
        var resUselessSmol = [];
        for(var i=0; i<fssUselessSmol.length; i++){
            var ip = Object.values(fssUselessSmol[i]);
            resUselessSmol.push(ip[0]);
        }
        
        // Проверим время последнего апдейта в БД
        var fssLUpdSmol = await connectSmolDB.query("SELECT updatedAt FROM smol_v5.minerstat LIMIT 1");
        fssLUpdSmol = Object.values(fssLUpdSmol[0]);
        fssLUpdSmol = Object.values(fssLUpdSmol[0]);
        fssLUpdSmol = String(fssLUpdSmol[0]);
        
        for(authUser in auth_users){
            bot.sendMessage(auth_users[authUser], 'В Смоленщине: ' + '\nМайнеров в сети: ' + fssSmolMiners + '\nПлат в сети: ' + fssSmolChains + '\nRT-HashRate: ' + fssSmolRate.toLocaleString('ru') + ' GH/S' +'\nМайнеров с нулевым Rt&Avg HRate: '+resUselessSmol.length+'\n'+resUselessSmol+ '\nДата последнего обновления:\n' + fssLUpdSmol);
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