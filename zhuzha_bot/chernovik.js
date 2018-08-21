const TelegramBot = require('node-telegram-bot-api');
const Agent = require('socks5-https-client/lib/Agent');

const Sequelize = require('sequelize');
var connection = new Sequelize('smol_v3', 'sa', '`1234qwe', {
    host: '10.0.0.250',
    dialect: 'mysql',
    insecureAuth: true,
    timezone: '+08:00',
    define: { freezeTableName: true },
    logging: false
});

const Op = Sequelize.Op;

// replace the value below with the Telegram token you receive from @BotFather
const token = '659774347:AAEfl_8UyhYbRi8hOhGyWmcbWSA7SFq9v34';

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token,{
        polling: true,
        request: {
            agentClass: Agent,
            agentOptions: {
                socksHost: "188.40.167.250"||"165.227.214.55",
                socksPort: 1080||2018,
                // If authorization is needed:
                // socksUsername: process.env.PROXY_SOCKS5_USERNAME,
                // socksPassword: process.env.PROXY_SOCKS5_PASSWORD
            }
        }
    });
// IF EVERYTHING GOES WELL, GOLIATH ONLINE
console.log("Channel open. Comm-link online");

async function showStats(chatId){
    var minerCount = await connection.query("SELECT COUNT(*) FROM smol_v3.minerstat WHERE Type<>'error';", { type: connection.QueryTypes.SELECT});
    minerCount = Object.values(minerCount[0]);
    bot.sendMessage(chatId, "В Смоленщине на данный момент отозвались: "+minerCount+" майнеров");
    
    var sumHrate = await connection.query("SELECT SUM(RtHashrate) FROM smol_v3.otherinfo WHERE IpAddr IN (SELECT IpAddr FROM smol_v3.minerstat WHERE Type<>'error');", { type: connection.QueryTypes.SELECT});
    sumHrate = Object.values(sumHrate[0]);
    sumHrate = sumHrate.toLocaleString('ru');
    bot.sendMessage(chatId, "RealTime хэшрейт по ферме:\n"+sumHrate+" GH/S");
    
    var aliveChainsCount = await connection.query("SELECT SUM(AliveChains) FROM smol_v3.otherinfo WHERE IpAddr IN (SELECT IpAddr FROM smol_v3.minerstat WHERE Type<>'error');", { type: connection.QueryTypes.SELECT});
    aliveChainsCount = Object.values(aliveChainsCount[0]);
    bot.sendMessage(chatId, "Суммарно отозвалось плат по ферме:\n"+aliveChainsCount);
}

bot.onText(/\/stat/, (msg, match) => {
    // 'msg' is the received Message from Telegram
    // 'match' is the result of executing the regexp above on the text content
    // of the message
    
    const chatId = msg.chat.id;
    showStats(chatId);
    /* connection.authenticate()
        .then(() => {
            console.log("!Someone is requesting for stats and establishing connection to the database. He's doing it");
            var minerStat = connection.define("MinerStat", {
                MacAddr: Sequelize.STRING,
                IpAddr: Sequelize.STRING,
                Type: Sequelize.STRING,
                Uptime: Sequelize.STRING,
                HardwareVer: Sequelize.STRING,
                KernelVer: Sequelize.STRING,
                FsVer: Sequelize.STRING,
                UserId: Sequelize.INTEGER
            });

            var otherInfo = connection.define("otherinfo", {
                Uptime: Sequelize.INTEGER,
                RtHashrate: Sequelize.FLOAT,
                AvgHashrate: Sequelize.FLOAT,
                BlocksFound: Sequelize.INTEGER,
                ActiveFans: Sequelize.INTEGER,
                IpAddr: Sequelize.STRING,
                AvgTemperature: Sequelize.INTEGER,
                AliveChains: Sequelize.INTEGER
            });
 
            connection.sync().then(function () {
                var minerCount = minerStat.count({
                    where: {
                        Type:{
                            ne: 'error'
                        }
                    }
                }).then(
                    minerCount => {
                        bot.sendMessage(chatId, "В Смоленщине на данный момент отозвались: "+minerCount+" майнеров");
                    }
                );

                var rtRateCount = otherInfo.sum('RtHashrate').then(
                    rtRateCount => {
                        bot.sendMessage(chatId, "RealTime хэшрейт по ферме:\n"+(rtRateCount).toLocaleString('ru')+" GH/S");
                    }
                );

                

                var aliveChainsCount = otherInfo.sum('AliveChains').then(
                    aliveChainsCount => {
                        bot.sendMessage(chatId, "Всего живых плат:\n"+aliveChainsCount);
                    }
                );

                
            });
            
        })
        .catch(err => {
            console.error('Unable to connect to the database:', err);
        }); */
});

bot.onText(/\/ass/, (msg, match) => {

});

bot.onText(/\/help/, (msg, match) => {
    console.log("Someone is requesting for help");
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, "Используйте команды:\n /stat для вывода статистики. Пока что все");
});

// Listen for any kind of message. There are different kinds of
// messages.
/* bot.on('message', (msg) => {
  const chatId = msg.chat.id;

  // send a message to the chat acknowledging receipt of their message
  bot.sendMessage(chatId, 'Received your message');
}); */