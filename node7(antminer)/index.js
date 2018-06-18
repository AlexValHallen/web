/* var antminer = require('node-antminer');

var urls = [];
for(var i=0; i<255; i++){
    urls[i] = "10.0.2."+i;
}


for(var j in urls){

        antminer.readStats(urls[j],80,"root","root",(err, stats) => {
            if(err) {
                console.error("ERROR from "+urls[j], err);
            } else {
                console.log("Incoming data from "+urls[j], stats);
            }
        });

} */

var antminer = require('node-antminer');
antminer.readStats("10.0.2.0",80,"root","root",(err, stats) => {
    if(err) {
        console.error("An error occurred fetching stats from antminer", err);
    } else {
        console.log("Incoming data: ", stats);
    }
});