var request = require('request');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

exports.readOverview = function(host, port, username, password, callback) {
    request.get('http://' + host + ':' + port + '/cgi-bin/get_system_info.cgi/', {
      'auth': {
        'user': username,
        'pass': password,
        'sendImmediately': false
      }
    }, function (error, response, body) {
      if(error) 
      {
        callback(error, null);
        return;
      }

      const overView = JSON.parse(body);

      var minertype = overView.minertype;
      var mac = overView.macaddr;
      var ipaddr = overView.ipaddress;
      var uptime = overView.uptime;
      var hwver = overView.ant_hwv;
      var kernelver = overView.system_kernel_version;
      var fsver = overView.system_filesystem_version;
      
      

      console.log(minertype);

      callback(null, overView);
    });
  
  }

exports.readStats = function(host, port, username, password, callback) {
    request.get('http://' + host + ':' + port + '/cgi-bin/minerStatus.cgi', {
      'auth': {
        'user': username,
        'pass': password,
        'sendImmediately': false
      }
    }, function (error, response, body) {
      if(error) 
      {
        callback(error, null);
        return;
      }
      var stats = {};
  
      const frag = JSDOM.fragment(body);
      var uptimeText = frag.querySelector("#ant_elapsed").textContent;

      stats.uptime = parseUptime(uptimeText);
      
      var gigaHash = false;
      var tableTitles = frag.querySelectorAll("table#ant_devs tbody tr.cbi-section-table-titles th.cbi-section-table-cell");
        tableTitles.forEach((title) => {
        if(title.textContent) {
            if(title.textContent.indexOf('GH/S') > -1) { 
            gigaHash = true;
            }
        }
        })

        stats.GHRealtime = parseFloat(frag.querySelector("#ant_ghs5s").textContent.replace(',',''));
        stats.GHAverage = parseFloat(frag.querySelector("#ant_ghsav").textContent.replace(',',''));

        stats.blocksFound = parseInt(frag.querySelector("#ant_foundblocks").textContent);

        var fanSpeeds = [];
        var fans = 0;
        var fanCells = frag.querySelectorAll("table#ant_fans tbody tr.cbi-section-table-row td.cbi-value-field");
        for(var i = 0; i < fanCells.length; i++) {
            if(fanCells[i].textContent != "0" && fanCells[i].textContent != "") {
                fans++;
                fanSpeeds[i] = parseFloat(fanCells[i].textContent.replace(',',''));
            }
        }
        stats.fanSpeeds = [];
        stats.activeFans = fans;
        for(var j in fanSpeeds){
            stats.fanSpeeds[j] = fanSpeeds[j];
        }
        

        stats.pools = [];
        var poolRows = frag.querySelectorAll("table#ant_pools tbody tr.cbi-section-table-row");
        for(var i = 0; i <= 2; i++) stats.pools.push(poolRows[i].querySelector("#cbi-table-1-url").textContent)

        var chipTemps = [];
        var chainRows = frag.querySelectorAll("table#ant_devs tbody tr.cbi-section-table-row");
        var rows = 0;
        for(var i = 0; i < chainRows.length; i++) {
          if(chainRows[i].querySelector("#cbi-table-1-chain").textContent === 'Total') continue;
          rows++;
          var chipTemp = chainRows[i].querySelector("#cbi-table-1-temp2").textContent;
          if(chipTemp.indexOf("O:") > -1)
            chipTemp = chipTemp.substring(chipTemp.indexOf('O:')+2);
          chipTemps[i] = parseFloat(chipTemp);
        }
        stats.chipTemps = [];
        for(var k in chipTemps){
            stats.chipTemps[k] = chipTemps[k];
        }

      callback(null, stats);
    });
  
  }