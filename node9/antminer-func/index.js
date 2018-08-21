const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const req = require('request-promise');
const fs = require('fs');

// Here comes the ORM
const Sequelize = require('sequelize');
var connection = new Sequelize('smol_v3', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',
    insecureAuth: true,
    timezone: '+08:00',
    define: { freezeTableName: true }
});


// DEPRECATED A function to parse the HTML from /cgi-bin/minerStatus.cgi
exports.readMinerStatusHTML = async function(urls){
    // A unction to parse the uptime from minerStatus.html page
    var parseUptime = function(uptimeText) {
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
      
      }
      // THESE ARE FOR COUNTING SUMS OF HASHRATES
      var res_rtRate = 0;
      var res_avgRate = 0;

      for(var k in urls){
        try {

            //!! 2. TRYING TO PARSE MINER_STATUS.HTML !!            
            entryID = "http://"+urls[k]+"/cgi-bin/minerStatus.cgi";

            var options = {
                uri: entryID,
                auth: {
                    user: 'root',
                    pass: 'root',
                    sendImmediately: false,
                },
                timeout: 4000
            };
            
            await req(options, function (error, resp, body) {
                if (!error && resp.statusCode == 200) {
                    var curURL = urls[k];
                    console.log(k+".☻ Receiving stats from "+curURL+"\n");
                    var stats = {};
                    // WE GET UPTIME AND PARSE IT to INT
                    const frag = JSDOM.fragment(body);
                    var uptimeText = frag.querySelector("#ant_elapsed").textContent;
                    stats.uptime = parseUptime(uptimeText);
                    // WE GET HASHRATES
                    stats.GHRealtime = parseFloat(frag.querySelector("#ant_ghs5s").textContent.replace(',', ''));
                    res_rtRate += stats.GHRealtime;
                    stats.GHAverage = parseFloat(frag.querySelector("#ant_ghsav").textContent.replace(',', ''));
                    res_avgRate += stats.GHAverage;
                    // BLOCKSFOUND
                    stats.blocksFound = parseInt(frag.querySelector("#ant_foundblocks").textContent);
                    // FAN SPEEDS
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
                    // POOLS AND WALLETS
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
                    // THIS PART IS FOR PARSING CHAIN INFO (Freq, GH/s, HW, Temperature and ASIC status)
                    stats.chipTemps = [];
                    stats.hwerrs = [];
                    stats.chainsGHIl = [];
                    stats.chainsGHRt = [];
                    stats.freqs = [];
                    stats.asicstat = [];
                    stats.chainnums = [];

                    if(frag.querySelectorAll("table#ant_devs tbody tr.cbi-section-table-row").length==0 || frag.querySelectorAll("table#ant_devs tbody tr.cbi-section-table-row").length==null){
                        stats.chipTemps[0] = -2;
                        stats.hwerrs[0] = -2;
                        stats.chainsGHIl[0] = -2;
                        stats.chainsGHRt[0] = -2;
                        stats.freqs[0] = -2;
                        stats.asicstat[0] = "ERROR";
                        stats.chainnums[0] = 1;
                        var rows = 1;
                    }
                    else{
                        var chainRows = frag.querySelectorAll("table#ant_devs tbody tr.cbi-section-table-row");
                        var rows = chainRows.length;
                        for (var i = 0; i < rows; i++) { 
                            if (chainRows[i].querySelector("#cbi-table-1-chain").textContent === 'Total'){
                                if(rows==1 && stats.GHRealtime==0){
                                    stats.chainnums[i] = 0;
                                    stats.chainsGHIl[i] = 0;
                                    stats.chainsGHRt[i] = 0;
                                    stats.freqs[i] = 0;
                                    stats.chipTemps[i] = 0;
                                    stats.hwerrs[i] = 0;
                                    stats.asicstat.push("There might be a problem");
                                    continue;
                                }
                                rows = rows-1; continue;
                            }
                            //rows++;
                            stats.chainnums[i] = i+1;
                            var chipTemp = chainRows[i].querySelector("#cbi-table-1-temp2").textContent;
                            if (chipTemp.indexOf("O:") > -1)
                                chipTemp = chipTemp.substring(chipTemp.indexOf('O:') + 2);
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

                            if(chainRows[i].querySelector("#cbi-table-1-rate2")!==null){
                                var chainGHIl = chainRows[i].querySelector("#cbi-table-1-rate2").textContent;
                                if(chainGHIl=='-' || chainGHIl=='' || chainGHIl==' ' || chainGHIl==null){
                                    stats.chainGHIl[i] = -1;
                                }
                                else{
                                    stats.chainsGHIl[i] = parseFloat(chainGHIl.replace(',', ''));
                                }
                            }
                            else{
                                stats.chainsGHIl[i] = -1;
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
                     console.log(stats); // REAL QUICKLY SHOW THE STATS IN THE CONSOLE
                    // AND THEN WE PUSH IT TO THE LIMIT! (in da db)
                    var curURL = urls[k];
                     connection
                    .authenticate()
                    .then(() => {
                                //console.log('Connection to the database has been established successfully.');
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
                                    ChainNum: Sequelize.INTEGER,
                                    HRateIl: Sequelize.FLOAT,
                                    HRateRt: Sequelize.FLOAT,
                                    Freq: Sequelize.FLOAT,
                                    HWErr: Sequelize.INTEGER,
                                    Temperature: Sequelize.INTEGER,
                                    AsicStat: Sequelize.STRING,
                                    IpAddr: Sequelize.STRING
                                });

                                var otherInfo = connection.define('MinerChains', {
                                    Uptime: Sequelize.INTEGER,
                                    RtHashrate: Sequelize.FLOAT,
                                    AvgHashrate: Sequelize.FLOAT,
                                    BlocksFound: Sequelize.INTEGER,
                                    ActiveFans: Sequelize.INTEGER,
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
                                    for(var xa=0; xa<rows; xa++){
                                        DBChains.create({
                                            ChainNum: stats.chainnums[xa],
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
                    fs.appendFile(__dirname + "/"+urls+"_errors.txt", "\n" + error + "\nHTML: " + body + "\n", function (wrt_err) {
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

// USING REQUEST-PROMISE
// I. A function to parse the JSON from /cgi-bin/get_system_info.cgi/
exports.readOverviewAndStatus = async function(urls){
    for(var j in urls){
            var entryID = "http://"+urls[j]+"/cgi-bin/get_system_info.cgi/";
            var options = {
                uri: entryID,
                auth: {
                    user: 'root',
                    pass: 'root',
                    sendImmediately: false
                },
                timeout: 3800
            };
            
            try{
                await req(options, function(error, resp, body){
                    if (!error && resp.statusCode == 200){
                        // 1. TRYING TO PARSE OVERVIEW.JSON !!
                        try{
                            var CURL = urls[j];
                            console.log(j + ". Receiving overview from " + CURL + "\n");
                            const overView = JSON.parse(body);
                            var DBminertype = overView.minertype;
                            var DBmacaddr = overView.macaddr;
                            var DBipaddr = overView.ipaddress;
                            var DBuptime = overView.uptime;
                            var DBhwver = overView.ant_hwv;
                            var DBkernelver = overView.system_kernel_version;
                            var DBfsver = overView.system_filesystem_version;
                            //console.log("\nIncoming overview: ", overView);
                        }
                        catch(er){
                            var CURL = urls[j];
                            console.error(er);
                            fs.appendFile(__dirname + "/" + "json_errors.txt", CURL +":"+ + er + "\r\n", function (wrt_err) {
                                if (wrt_err) throw wrt_err;
                            });
                        }
                        // 2. AND THEN WE PUSH IT TO THE LIMIT!
                        connection
                            .authenticate()
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

                                connection.sync().then(function () {
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
                        readMinerStatus(CURL);    
                    }
                    else{
                        // 3. IF WE CAN'T OPEN THE OVERVIEW.JSON, THEN WE INSERT 'Error' EVERYWHERE
                        var CURL = urls[j];
                        connection
                        .authenticate()
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
                                    
                                    connection.sync().then(function(){
                                        minerStat.upsert({
                                            MacAddr: "error",
                                            IpAddr: CURL,
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
                    }                    
                });
            }
            catch(e){
                console.error(e);
            }
        }
}

// II. A function to parse the HTML from /cgi-bin/minerStatus.cgi
readMinerStatus = async function(someURL){
    // A function to parse the uptime from minerStatus.html page
    var parseUptime = function(uptimeText) {
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
      
      }

    try {
        //!! 2. TRYING TO PARSE MINER_STATUS.HTML !!            
        entryID = "http://" + someURL + "/cgi-bin/minerStatus.cgi";

        var options = {
            uri: entryID,
            auth: {
                user: 'root',
                pass: 'root',
                sendImmediately: false,
            },
            timeout: 3000
        };
        // And this where the funny stuff goes:
        await req(options, function (error, resp, body) {
            if (!error && resp.statusCode == 200) {
                var curURL = someURL;
                console.log("☻. Receiving stats from " + curURL);
                try{
                    var stats = {};
                    //1. We get UPTIME and parse it to INT
                    const frag = JSDOM.fragment(body);
                    var uptimeText = frag.querySelector("#ant_elapsed").textContent;
                    stats.uptime = parseUptime(uptimeText);
                    //2. We get RT and AVG HashRates
                    var megaHash = false;
                    var tableTitles = frag.querySelectorAll("table#ant_devs tbody tr.cbi-section-table-titles th.cbi-section-table-cell");
                    tableTitles.forEach((title) => {
                        if (title.textContent) {
                            if (title.textContent.indexOf('MH/S') > -1) {
                                megaHash = true;
                            }
                        }
                    })

                    stats.GHRealtime = parseFloat(frag.querySelector("#ant_ghs5s").textContent.replace(',', ''));
                    stats.GHAverage = parseFloat(frag.querySelector("#ant_ghsav").textContent.replace(',', ''));

                    if(megaHash) { 
                        stats.GHAverage /= 1024;
                        stats.GHRealtime /= 1024;
                    }
                    //3. And BLOCKSFOUND
                    stats.blocksFound = parseInt(frag.querySelector("#ant_foundblocks").textContent);
                    //4. And FANSPEEDS
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
                    //5. POOLS and WALLETS
                    stats.pools = [];
                    stats.wallets = [];
                    if (frag.querySelectorAll("table#ant_pools tbody tr.cbi-section-table-row").length == 0 || frag.querySelectorAll("table#ant_pools tbody tr.cbi-section-table-row").length == null) {
                        for (var i = 0; i <= 2; i++) {
                            stats.pools.push('Houston, we have a problem');
                            stats.wallets.push('Houston, we have a problem');
                        }
                    }
                    else {
                        var poolRows = frag.querySelectorAll("table#ant_pools tbody tr.cbi-section-table-row");
                        for (var i = 0; i <= 2; i++) {
                            stats.pools.push(poolRows[i].querySelector("#cbi-table-1-url").textContent);
                            stats.wallets.push(poolRows[i].querySelector("#cbi-table-1-user").textContent);
                        }
                    }
                    //6. THIS IS A BIG PART FOR PARSING CHAIN INFO (Freq, GH/s, HW, Temperature and ASIC status)
                    stats.chipTemps = [];
                    stats.hwerrs = [];
                    stats.chainsGHIl = [];
                    stats.chainsGHRt = [];
                    stats.freqs = [];
                    stats.asicstat = [];
                    stats.chainnums = [];
                    stats.avgTemperature=0;
                    stats.aliveChains=0;

                    if (frag.querySelectorAll("table#ant_devs tbody tr.cbi-section-table-row").length == 0 || frag.querySelectorAll("table#ant_devs tbody tr.cbi-section-table-row").length == null) {
                        stats.chipTemps[0] = -999;
                        stats.hwerrs[0] = -2;
                        stats.chainsGHIl[0] = -2;
                        stats.chainsGHRt[0] = -2;
                        stats.freqs[0] = -2;
                        stats.asicstat[0] = "ERROR";
                        stats.chainnums[0] = 1;
                        stats.aliveChains = 0;
                        var rows = 1;
                    }
                    else {
                        var chainRows = frag.querySelectorAll("table#ant_devs tbody tr.cbi-section-table-row");
                        var rows = chainRows.length;
                        for (var i = 0; i < rows; i++) {
                            // ! There might be cases when there are no info about any chains, but there is a 'Total' line
                            if (chainRows[i].querySelector("#cbi-table-1-chain").textContent === 'Total') {
                                if (rows == 1 && stats.GHRealtime == 0) {
                                    stats.chainnums[i] = 0;
                                    stats.chainsGHIl[i] = 0;
                                    stats.chainsGHRt[i] = 0;
                                    stats.freqs[i] = 0;
                                    stats.chipTemps[i] = -999;
                                    stats.hwerrs[i] = 0;
                                    stats.asicstat.push("There might be a problem");
                                    stats.aliveChains = 0;
                                    continue;
                                }
                                rows = rows - 1; continue;
                            }
                            //rows++;
                            stats.chainnums[i] = i + 1;
                            var chipTemp = chainRows[i].querySelector("#cbi-table-1-temp2").textContent;
                            if (chipTemp.indexOf("O:") > -1)
                                chipTemp = chipTemp.substring(chipTemp.indexOf('O:') + 2);
                            if (chipTemp == '-' || chipTemp == '' || chipTemp == ' ') {
                                stats.chipTemps[i] = 0; // ERROR: THAT MEANS THAT TEMP IS - OR EMPTY
                            }
                            else {
                                stats.chipTemps[i] = parseFloat(chipTemp);
                            }

                            var hwerr = chainRows[i].querySelector("#cbi-table-1-hw").textContent;
                            if (hwerr == '-' || hwerr == '' || hwerr == ' ' || hwerr == null) {
                                stats.hwerrs[i] = -1;
                            }
                            else {
                                stats.hwerrs[i] = parseInt(hwerr);
                            }
                            // FOR L3 Type Antminers, they don't have GH Ideal Column
                            if (chainRows[i].querySelector("#cbi-table-1-rate2") !== null) {
                                var chainGHIl = chainRows[i].querySelector("#cbi-table-1-rate2").textContent;
                                if (chainGHIl == '-' || chainGHIl == '' || chainGHIl == ' ' || chainGHIl == null) {
                                    stats.chainGHIl[i] = -1;
                                }
                                else {
                                    stats.chainsGHIl[i] = parseFloat(chainGHIl.replace(',', ''));
                                }
                            }
                            else {
                                stats.chainsGHIl[i] = -1;
                            }

                            var chainGHRt = chainRows[i].querySelector("#cbi-table-1-rate").textContent;
                            if (chainGHRt == '-' || chainGHRt == '' || chainGHRt == ' ' || chainGHRt == null) {
                                stats.chainsGHRt[i] = -1;
                            }
                            else {
                                stats.chainsGHRt[i] = parseFloat(chainGHRt.replace(',', ''));
                                stats.aliveChains++;
                            }

                            var freq = chainRows[i].querySelector("#cbi-table-1-frequency").textContent;
                            if (freq != '-' && freq != '' && freq != ' ') {
                                stats.freqs[i] = parseFloat(freq);
                            }
                            else {
                                stats.freqs[i] = -1;
                            }

                            stats.asicstat.push(chainRows[i].querySelector("#cbi-table-1-status").textContent);
                        }
                    }
                    // REAL QUICKLY SHOW THE STATS IN THE CONSOLE
                    console.log(stats); 
                    //7. AND THEN WE PUSH IT TO THE LIMIT! (in da db)
                    var curURL = someURL;
                    connection
                        .authenticate()
                        .then(() => {
                            //console.log('Connection to the database has been established successfully.');
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
                                ChainNum: Sequelize.INTEGER,
                                HRateIl: Sequelize.FLOAT,
                                HRateRt: Sequelize.FLOAT,
                                Freq: Sequelize.FLOAT,
                                HWErr: Sequelize.INTEGER,
                                Temperature: Sequelize.INTEGER,
                                AsicStat: Sequelize.STRING,
                                IpAddr: Sequelize.STRING
                            });

                            var DBOtherInfo = connection.define('otherinfo', {
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
                                for (var xa = 0; xa < rows; xa++) {
                                    DBChains.create({
                                        ChainNum: stats.chainnums[xa],
                                        HRateIl: stats.chainsGHIl[xa],
                                        HRateRt: stats.chainsGHRt[xa],
                                        Freq: stats.freqs[xa],
                                        HWErr: stats.hwerrs[xa],
                                        Temperature: stats.chipTemps[xa],
                                        AsicStat: stats.asicstat[xa],
                                        IpAddr: curURL
                                    });
                                    stats.avgTemperature += stats.chipTemps[xa];
                                }
                                stats.avgTemperature /= rows;
                                DBOtherInfo.upsert({
                                    Uptime: stats.uptime,
                                    RtHashrate: stats.GHRealtime,
                                    AvgHashrate: stats.GHAverage,
                                    BlocksFound: stats.blocksFound,
                                    ActiveFans: stats.activeFans,
                                    IpAddr: curURL,
                                    AvgTemperature: stats.avgTemperature,
                                    AliveChains: stats.aliveChains
                                });
                            });
                        })
                        .catch(err => {
                            console.error('Unable to connect to the database:', err);
                        });
                }
                catch(er){
                    console.error(er);
                    fs.appendFile(__dirname + "/" + "html_parsing_errors.txt", curURL+":" + er + "\r\n", function (wrt_err) {
                        if (wrt_err) throw wrt_err;
                    });
                }
            }
            else {
                fs.appendFile(__dirname + "/" + "connect_errors.txt", curURL+":" + error + "\r\nHTML: " + body + "\r\n", function (wrt_err) {
                    if (wrt_err) throw wrt_err;
                });
            }
        });
    }
    catch (e) {
        console.error(e);
    }
}

exports.readURLs = function(urls){
    var re = /\s*,\s*/;
    urls = urls.split(re);
    var resURL = [];
    for(var i=0; i<urls.length; i++){
            var lastInd = urls[i].lastIndexOf(".");
            var dashInd = urls[i].indexOf("-");
            if(dashInd==-1){
                resURL.push(urls[i]);
            }
            else{
                var subnet = urls[i].substring(0, lastInd+1);
                var startIP = parseInt(urls[i].substring(lastInd+1, dashInd));
                var endIP = parseInt(urls[i].substring(dashInd+1, urls[i].length))
                for(var j=startIP; j<=endIP; j++){
                    resURL.push(subnet+String(j));
                }
            }
    }
    return resURL;
}