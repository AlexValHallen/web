const TelegramBot = require('node-telegram-bot-api');
//const req = require('axio');
const Sequelize = require('sequelize');
var connection = new Sequelize('smol', 'sa', '`1234qwe', {
    host: '10.0.0.250',
    dialect: 'mysql',
    insecureAuth: true,
    timezone: '+08:00',
    define: { freezeTableName: true }
});

const Op = Sequelize.Op;

// replace the value below with the Telegram token you receive from @BotFather
const token = '659774347:AAEfl_8UyhYbRi8hOhGyWmcbWSA7SFq9v34';

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, {polling: true});

bot.onText(/\/stat/, (msg, match) => {
    // 'msg' is the received Message from Telegram
    // 'match' is the result of executing the regexp above on the text content
    // of the message
  
    const chatId = msg.chat.id;

    connection.authenticate()
        .then(() => {
            //console.log('Connection to the database has been established successfully.');
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
            var res;
            connection.sync().then(function () {
                var res = minerStat.count({
                    where: {
                        Type:{
                            ne: 'error'
                        }
                    }
                }).then(
                    res => {
                        bot.sendMessage(chatId, "На данный момент отозвались: "+res+" майнеров");
                    }
                );
            });
            
        })
        .catch(err => {
            console.error('Unable to connect to the database:', err);
        });
});

bot.onText(/\/help/, (msg, match) => {
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