// We get the functions module
var antminer = require('antminer-func');

var urls0 = [];
var urls1 = [];
var urls2 = [];
for(var i=0; i<254; i++){
    urls0[i] = "http://10.0.0."+i;
    urls1[i] = "http://10.0.1."+i;
    urls2[i] = "http://10.0.2."+i;
}

antminer.readStats(urls0);
//antminer.readStats(urls1);
//antminer.readStats(urls2);

antminer.readParameters(urls0);
//antminer.readParameters(urls1);
//antminer.readParameters(urls2);
