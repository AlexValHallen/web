var antminer = require('node-antminer');
var urls = ["10.0.1.30","10.0.2.55"];


for(var j in urls){
    antminer.readStats(urls[j],80,"root","root",(err, stats) => {
        if(err) {
            console.error("An error occurred fetching stats from antminer", err);
        } else {
            console.log("Statistics read:", stats);
        }
    });
}