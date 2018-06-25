const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const req = require('request-promise');
const fs = require('fs');

fs.writeFileSync(__dirname+'/info.txt', '');

// Here comes the ORM
const Sequelize = require('sequelize');
var connection = new Sequelize('mydb', 'root', '', {
    host: '127.0.0.1',
    dialect: 'mysql',
    insecureAuth: true
});

// USING REQUEST-PROMISE
// A function to parse the HTML from /cgi-bin/minerStatus.cgi
exports.readParameters = async function(urls){
    /* var parseUptime = function(uptimeText) {
        var uptime = 0;
        var startIndex = 0;
      
        if(uptimeText.indexOf('d', startIndex) > -1)
        {
          uptime += parseInt(uptimeText.substring(startIndex,uptimeText.indexOf('d', startIndex))) * 24 * 60 * 60;
          startIndex = uptimeText.indexOf('d', startIndex)+1;
        }
      
        if(uptimeText.indexOf('h', startIndex) > -1)
        {
          uptime += parseInt(uptimeText.substring(startIndex,uptimeText.indexOf('h', startIndex))) * 60 * 60;
          startIndex = uptimeText.indexOf('h', startIndex)+1;
        }
      
        if(uptimeText.indexOf('m', startIndex) > -1)
        {
          uptime += parseInt(uptimeText.substring(startIndex,uptimeText.indexOf('m', startIndex))) * 60;
          startIndex = uptimeText.indexOf('m', startIndex)+1;
        }
      
        if(uptimeText.indexOf('s', startIndex) > -1)
        {
          uptime += parseInt(uptimeText.substring(startIndex,uptimeText.indexOf('s', startIndex)));
        }
      
        return uptime;
      
      } */
      for(var k in urls){
        try {

            //!! 2. TRYING TO PARSE MINER_STATUS.HTML !!
            
            entryID = urls[k]+"/cgi-bin/minerStatus.cgi";

            var options = {
                uri: entryID,
                auth: {
                    user: 'root',
                    pass: 'root',
                    sendImmediately: false,
                },
                timeout: 3500
            };
            
            await req(options, function (error, resp, body) {
                if (!error && resp.statusCode == 200) {
                    var curURL = entryID;
                    console.log(k+".☻ Receiving stats from "+curURL+"\n");
                    var stats = {};

                    const frag = JSDOM.fragment(body);
                    /* var uptimeText = frag.querySelector("#ant_elapsed").textContent;

                    stats.uptime = parseUptime(uptimeText); */

                    /* var gigaHash = false;
                    var tableTitles = frag.querySelectorAll("table#ant_devs tbody tr.cbi-section-table-titles th.cbi-section-table-cell");
                    tableTitles.forEach((title) => {
                        if (title.textContent) {
                            if (title.textContent.indexOf('GH/S') > -1) {
                                gigaHash = true;
                            }
                        }
                    }) */

                    stats.GHRealtime = parseFloat(frag.querySelector("#ant_ghs5s").textContent.replace(',', ''));
                    stats.GHAverage = parseFloat(frag.querySelector("#ant_ghsav").textContent.replace(',', ''));

                    stats.blocksFound = parseInt(frag.querySelector("#ant_foundblocks").textContent);

                    var fanSpeeds = [];
                    var fans = 0;
                    var fanCells = frag.querySelectorAll("table#ant_fans tbody tr.cbi-section-table-row td.cbi-value-field");
                    for (var i = 0; i < fanCells.length; i++) {
                        if (fanCells[i].textContent != "0" && fanCells[i].textContent != "") {
                            fans++;
                            fanSpeeds[i] = parseFloat(fanCells[i].textContent.replace(',', ''));
                        }
                    }
                    stats.fanSpeeds = [];
                    stats.activeFans = fans;
                    for (var j in fanSpeeds) {
                        stats.fanSpeeds[j] = fanSpeeds[j];
                    }
                    
                    stats.pools = [];
                    stats.wallets = [];
                    if(frag.querySelectorAll("table#ant_pools tbody tr.cbi-section-table-row").length==0 || frag.querySelectorAll("table#ant_pools tbody tr.cbi-section-table-row").length==null){
                        for (var i = 0; i <= 2; i++){
                            stats.pools.push('Houston, we have a problem');
                            stats.wallets.push('Houston, we have a problem');
                        }
                    }
                    else{
                        var poolRows = frag.querySelectorAll("table#ant_pools tbody tr.cbi-section-table-row");
                        for (var i = 0; i <= 2; i++){
                            stats.pools.push(poolRows[i].querySelector("#cbi-table-1-url").textContent);
                            stats.wallets.push(poolRows[i].querySelector("#cbi-table-1-user").textContent);
                        }
                    }
                    console.log(stats);                        
                    // THIS PART IS FOR PARSING CHAIN INFO (Freq, GH/s, HW, Temperature and ASIC status)
                    stats.chipTemps = [];
                    stats.hwerrs = [];
                    stats.chainsGHIl = [];
                    stats.chainsGHRt = [];
                    stats.freqs = [];
                    stats.asicstat = [];

                    if(frag.querySelectorAll("table#ant_devs tbody tr.cbi-section-table-row").length==0 || frag.querySelectorAll("table#ant_devs tbody tr.cbi-section-table-row").length==null){
                        stats.chipTemps[0] = -2;
                        stats.hwerrs[0] = -2;
                        stats.chainsGHIl[0] = -2;
                        stats.chainsGHRt[0] = -2;
                        stats.freqs[0] = -2;
                        stats.asicstat[0] = "ERROR";
                        var rows = 2;
                    }
                    else{
                        var chainRows = frag.querySelectorAll("table#ant_devs tbody tr.cbi-section-table-row");
                        var rows = 0;
                        for (var i = 0; i < chainRows.length; i++) { 
                            if (chainRows[i].querySelector("#cbi-table-1-chain").textContent === 'Total') continue;
                            rows++;
                            var chipTemp = chainRows[i].querySelector("#cbi-table-1-temp2").textContent;
                            /* if (chipTemp.indexOf("O:") > -1)
                                chipTemp = chipTemp.substring(chipTemp.indexOf('O:') + 2); */
                            if(chipTemp=='-' || chipTemp=='' || chipTemp==' '){
                                stats.chipTemps[i] = -1; // ERROR: THAT MEANS THAT TEMP IS - OR EMPTY
                            }
                            else{
                                stats.chipTemps[i] = parseFloat(chipTemp);
                            }

                            var hwerr = chainRows[i].querySelector("#cbi-table-1-hw").textContent;
                            if(hwerr=='-' || hwerr=='' || hwerr==' ' || hwerr==null){
                                stats.hwerrs[i] = -1;
                            }
                            else{
                                stats.hwerrs[i] = parseInt(hwerr);
                            }

                            var chainGHIl = chainRows[i].querySelector("#cbi-table-1-rate2").textContent;
                            if(chainGHIl=='-' || chainGHIl=='' || chainGHIl==' ' || chainGHIl==null){
                                stats.chainGHIl[i] = -1;
                            }
                            else{
                                stats.chainsGHIl[i] = parseFloat(chainGHIl.replace(',', ''));
                            }

                            var chainGHRt = chainRows[i].querySelector("#cbi-table-1-rate").textContent;
                            if(chainGHRt=='-' || chainGHRt=='' || chainGHRt==' ' || chainGHRt==null){
                                stats.chainsGHRt[i] = -1;
                            }
                            else{
                                stats.chainsGHRt[i] = parseFloat(chainGHRt.replace(',', ''));
                            }

                            var freq = chainRows[i].querySelector("#cbi-table-1-frequency").textContent;
                            if(freq!='-' && freq!='' && freq!=' '){
                                stats.freqs[i] = parseFloat(freq);
                            }
                            else{
                                stats.freqs[i] = -1;
                            }
                            
                            stats.asicstat.push(chainRows[i].querySelector("#cbi-table-1-status").textContent)
                        }
                    }
                    // console.log(stats);
                    // AND THEN WE PUSH IT TO THE LIMIT! (in da db)
                     connection
                    .authenticate()
                    .then(() => {
                                console.log('Connection to the database has been established successfully.');

                                var DBPools = connection.define('Pools', {
                                    PoolName: Sequelize.STRING,
                                    URL1: Sequelize.STRING,
                                    URL2: Sequelize.STRING,
                                    URL3: Sequelize.STRING,
                                    IpAddr: Sequelize.STRING,
                                    UserID: Sequelize.INTEGER
                                });

                                var DBWallets = connection.define('Wallets', {
                                    WalletName: Sequelize.STRING,
                                    Wallet1: Sequelize.STRING,
                                    Wallet2: Sequelize.STRING,
                                    Wallet3: Sequelize.STRING,
                                    IpAddr: Sequelize.STRING,
                                    UserID: Sequelize.INTEGER
                                });

                                var DBChains = connection.define('MinerChains', {
                                    MacID: Sequelize.INTEGER,
                                    HRateIl: Sequelize.FLOAT,
                                    HRateRt: Sequelize.FLOAT,
                                    Freq: Sequelize.FLOAT,
                                    HWErr: Sequelize.INTEGER,
                                    Temperature: Sequelize.INTEGER,
                                    AsicStat: Sequelize.STRING,
                                    IpAddr: Sequelize.STRING
                                });

                                connection.sync().then(function(){
                                    DBPools.upsert({
                                        URL1: stats.pools[0],
                                        URL2: stats.pools[1],
                                        URL3: stats.pools[2],
                                        IpAddr: curURL
                                    });
                                    DBWallets.upsert({
                                        Wallet1: stats.wallets[0],
                                        Wallet2: stats.wallets[1],
                                        Wallet3: stats.wallets[2],
                                        IpAddr: curURL
                                    });
                                    for(var xa=0; xa<rows-1; xa++){
                                        DBChains.upsert({
                                            HRateIl: stats.chainsGHIl[xa],
                                            HRateRt: stats.chainsGHRt[xa],
                                            Freq: stats.freqs[xa],
                                            HWErr: stats.hwerrs[xa],
                                            Temperature: stats.chipTemps[xa],
                                            AsicStat: stats.asicstat[xa],
                                            IpAddr: curURL
                                        }); 
                                    }
                                });
                            })
                    .catch(err => {
                                console.error('Unable to connect to the database:', err);
                    });
                }
                else {
                    fs.appendFile(__dirname + "/info.txt", "\n" + error + "\nHTML: " + body + "\n", function (wrt_err) {
                        if (wrt_err) throw wrt_err;
                    });
                }
            });
        }
        catch (e) {
            console.error(e);
        }
    }
}

// A function to parse the JSON from /cgi-bin/get_system_info.cgi/
exports.readStats = async function(urls){
    for(var j in urls){
            var entryID = urls[j]+"/cgi-bin/get_system_info.cgi/";
            var options = {
                uri: entryID,
                auth: {
                    user: 'root',
                    pass: 'root',
                    sendImmediately: false
                },
                timeout: 3500
            };

            try{
                await req(options, function(error, resp, body){
                    if (!error && resp.statusCode == 200){
                        var URL = entryID;
                        console.log(j+". Receiving overview from "+URL+"\n");
                            const overView = JSON.parse(body);
                            // !! 1. TRYING TO PARSE OVERVIEW.JSON !!
                              var DBminertype = overView.minertype;
                              var DBmacaddr = overView.macaddr;
                              var DBipaddr = overView.ipaddress;
                              var DBuptime = overView.uptime;
                              var DBhwver = overView.ant_hwv;
                              var DBkernelver = overView.system_kernel_version;
                              var DBfsver = overView.system_filesystem_version;
                        //console.log("\nIncoming overview: ", overView);
                        connection
                        .authenticate()
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
                                    
                                    connection.sync().then(function(){
                                        minerStat.upsert({
                                            MacAddr: DBmacaddr,
                                            IpAddr: DBipaddr,
                                            Type: DBminertype,
                                            Uptime: DBuptime,
                                            HardwareVer: DBhwver,
                                            KernelVer: DBkernelver,
                                            FsVer: DBfsver
                                        });
                                    });
                                })
                        .catch(err => {
                                    console.error('Unable to connect to the database:', err);
                        });
                        
                    }
                    else{
                        connection
                        .authenticate()
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
                                    
                                    connection.sync().then(function(){
                                        minerStat.upsert({
                                            MacAddr: "error",
                                            IpAddr: URL,
                                            Type: "error",
                                            Uptime: "error",
                                            HardwareVer: "error",
                                            KernelVer: "error",
                                            FsVer: "error"
                                        });
                                    });
                                })
                        .catch(err => {
                                    console.error('Unable to connect to the database:', err);
                        });
                        fs.appendFile(__dirname+"/info.txt", "\n"+j+". "+error+"\nHTML: "+body+"\n", function (wrt_err){
                            if(wrt_err) throw wrt_err;
                        });
                    }
                });
            }
            catch(e){
                console.error(e);
            }
        }
}