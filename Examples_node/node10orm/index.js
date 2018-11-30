const Sequelize = require('sequelize');
var connection = new Sequelize('smol', 'sa', '`1234qwe', {
    host: '10.0.0.250',
    dialect: 'mysql',
    insecureAuth: true,
    timezone: '+08:00',
    define: { freezeTableName: true }
});
function zhopa(){
    connection.authenticate()
        .then(() => {
            console.log('Connection to the database has been established successfully.');
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
            connection.sync().then(function () {
                var res = minerStat.count({
                    where: {
                        Type:{
                            ne: 'error'
                        }
                    }
                }).then(
                    res => {
                        console.log("На данный момент отозвались: "+res+" майнеров");
                    }
                );
            });
            
        })
        .catch(err => {
            console.error('Unable to connect to the database:', err);
        });
    }

    zhopa();