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

var ass=["10.0.1.30"];
antminer.readParameters(ass);

//One part for parsing the Overview.json
/* antminer.readStats(urls0);
antminer.readStats(urls1);
antminer.readStats(urls2); */

//One part for parsing the MinerStatus.html
/* antminer.readParameters(urls0);
antminer.readParameters(urls1);
antminer.readParameters(urls2); */
