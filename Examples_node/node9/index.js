// We get the functions module
var antminer = require('antminer-func');

// Enter the subnets, should be something like this: "10.0.0.1-253,10.0.1.1-253,10.0.2.1-253"
var urls = "10.0.10.1-240,10.0.11.1-253";
var res = antminer.readURLs(urls);
function query(){
    antminer.readOverviewAndStatus(res);
}
query();
setInterval(query, 2100000);

/* var urls = "10.0.1.102,10.0.0.69,10.0.0.22"; // Это L3, T9 и S9 соответственно
var res = antminer.readURLs(urls);
antminer.readOverviewAndStatus(res); */


/* var urls0 = [];
var urls1 = [];
var urls2 = [];
for(var i=1; i<254; i++){
    urls0[i] = "10.0.0."+i;
    urls1[i] = "10.0.1."+i;
    urls2[i] = "10.0.2."+i;
} */
/* 
//One part for parsing the MinerStatus.HTML page
function params0(){
    antminer.readMinerStatusHTML(urls0);
}
function params1(){
    antminer.readMinerStatusHTML(urls1);
}
function params2(){
    antminer.readMinerStatusHTML(urls2);
}
// And one for parsing the Overview.JSON file
function stats0(){
    antminer.readOverviewJSON(urls0);
    setTimeout(params0, 2000);
}

function stats1(){
    antminer.readOverviewJSON(urls1);
    setTimeout(params1, 2000);
}

function stats2(){
    antminer.readOverviewJSON(urls2);
    setTimeout(params2, 2000);
}
function ass(){
    setTimeout(stats0, 2000);
    setTimeout(stats1, 4000);
    setTimeout(stats2, 6000);
}
//setInterval(ass, 1200000);
 */