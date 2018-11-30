// We get the functions module
var antminer = require('antminer-func');

/* // Enter the subnets, should be something like this: "10.0.0.1-253,10.0.1.1-253,10.0.2.1-253"
var urls = "10.0.10.1-240,10.0.11.1-240";
var res = antminer.readURLs(urls);
function query(){
    antminer.readOverviewAndStatus(res);
}
query();
setInterval(query, 2100000);

 */

antminer.readMinerConfig("10.0.11.126");

