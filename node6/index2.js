//deprecated
//var request = require('request');
var fs = require('fs');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

var urls2 = [];
for(var i=0; i<255; i++){
    urls2[i] = "http://10.0.2."+i;
}
const req = require('request-promise');
fs.writeFile(__dirname+"/info.txt", "", function (wrt_err){
    if(wrt_err) throw wrt_err;
});

async function readStats(urls){
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
            //console.log(j+". Now trying to connect to: "+entryID+"\n");

            entryID = urls+"/cgi-bin/minerStatus.cgi";

            var options = {
                uri: entryID,
                auth: {
                    user: 'root',
                    pass: 'root',
                    sendImmediately: false
                }
            };

            await req(options, function (error, resp, body) {
                if (!error && resp.statusCode == 200) {
                    var stats = {};

                    const frag = JSDOM.fragment(body);
                    var uptimeText = frag.querySelector("#ant_elapsed").textContent;

                    stats.uptime = parseUptime(uptimeText);

                    var gigaHash = false;
                    var tableTitles = frag.querySelectorAll("table#ant_devs tbody tr.cbi-section-table-titles th.cbi-section-table-cell");
                    tableTitles.forEach((title) => {
                        if (title.textContent) {
                            if (title.textContent.indexOf('GH/S') > -1) {
                                gigaHash = true;
                            }
                        }
                    })

                    stats.GHRealtime = parseFloat(frag.querySelector("#ant_ghs5s").textContent.replace(',', ''));
                    stats.GHAverage = parseFloat(frag.querySelector("#ant_ghsav").textContent.replace(',', ''));

                    //stats.blocksFound = parseInt(frag.querySelector("#ant_foundblocks").textContent);

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
                    var poolRows = frag.querySelectorAll("table#ant_pools tbody tr.cbi-section-table-row");
                    for (var i = 0; i <= 2; i++) stats.pools.push(poolRows[i].querySelector("#cbi-table-1-url").textContent)

                    var chipTemps = [];
                    var chainRows = frag.querySelectorAll("table#ant_devs tbody tr.cbi-section-table-row");
                    var rows = 0;
                    for (var i = 0; i < chainRows.length; i++) {
                        if (chainRows[i].querySelector("#cbi-table-1-chain").textContent === 'Total') continue;
                        rows++;
                        var chipTemp = chainRows[i].querySelector("#cbi-table-1-temp2").textContent;
                        if (chipTemp.indexOf("O:") > -1)
                            chipTemp = chipTemp.substring(chipTemp.indexOf('O:') + 2);
                        chipTemps[i] = parseFloat(chipTemp);
                    }
                    stats.chipTemps = [];
                    for (var k in chipTemps) {
                        stats.chipTemps[k] = chipTemps[k];
                    }

                    console.log("\nIncoming overview: ", overView);
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

async function readOverView (urls){
    for(var j in urls){
            var entryID = urls[j]+"/cgi-bin/get_system_info.cgi/";
            var options = {
                uri: entryID,
                auth: {
                    user: 'root',
                    pass: 'root',
                    sendImmediately: false
                }
            };

            try{
                //console.log(j+". Now trying to connect to: "+entryID+"\n");
                await req(options, function(error, resp, body){
                    if (!error && resp.statusCode == 200){
                        console.log(j+". Connected to "+entryID+"\n");
                            const overView = JSON.parse(body);
                            // !! 1. TRYING TO PARSE OVERVIEW.JSON !!
                              var minertype = overView.minertype;
                              var mac = overView.macaddr;
                              var ipaddr = overView.ipaddress;
                              var uptime = overView.uptime;
                              var hwver = overView.ant_hwv;
                              var kernelver = overView.system_kernel_version;
                              var fsver = overView.system_filesystem_version;
                        console.log("\nIncoming overview: ", overView);

                        readStats(urls[j]);
                    }
                    else{
                        fs.appendFile(__dirname+"/info.txt", "\n"+error+"\nHTML: "+body+"\n", function (wrt_err){
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

readOverView(urls2);
//readStats(urls2);
