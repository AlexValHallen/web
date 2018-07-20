// We get the functions module
var antminer = require('antminer-func');

var urls0 = [];
var urls1 = [];
var urls2 = [];
for(var i=1; i<254; i++){
    urls0[i] = "10.0.0."+i;
    urls1[i] = "10.0.1."+i;
    urls2[i] = "10.0.2."+i;
}

/* var ass=["10.0.1.30"];
antminer.readParameters(ass); */

//One part for parsing the Overview.json
function statsSmol(){
    antminer.readStats(urls0);
    antminer.readStats(urls1);
    antminer.readStats(urls2);
} 

function paramsSmol(){
    antminer.readParameters(urls0);
    antminer.readParameters(urls1);
    antminer.readParameters(urls2);
}
/* 
setInterval(statsSmol(), 1200000);
setInterval(paramsSmol(), 1200000); */

function params0(){
    antminer.readParameters(urls0);
}
function params1(){
    antminer.readParameters(urls1);
}
function params2(){
    antminer.readParameters(urls2);
}

function stats0(){
    antminer.readStats(urls0);
    setTimeout(params0, 2000);
}

function stats1(){
    antminer.readStats(urls1);
    setTimeout(params1, 2000);
}

function stats2(){
    antminer.readStats(urls2);
    setTimeout(params2, 2000);
}
function ass(){
    setTimeout(stats0, 2000);
    setTimeout(stats1, 4000);
    setTimeout(stats2, 6000);
}
antminer.readStats(urls2);
//setInterval(ass, 1200000);