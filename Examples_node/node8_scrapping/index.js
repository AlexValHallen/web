var fs = require('fs');
var func = require('antminer-func');
//var sequelize = require('sequelize');

var urls = [];

for(var i=0; i<255; i++){
    urls[i] = "10.0.2."+i;
}

/* func.readStats(urls[j], 80, 'root', 'root', (err, stats) => {
    if(err) {
        console.error("\nAn error occurred fetching stats from antminer " + urls[j], err);
    } else {
        console.log("\nIncoming stats: ", stats);
    }
  }); */


for(var j in urls){
    func.readOverview(urls[j], 80, 'root', 'root', (err, overView) => {
        if(err) {
            console.error("\nAn error occurred fetching overview from antminer " + urls[j], err);
        } else {
            console.log("\nIncoming overview: ", overView);
        }
      });   
}

  /* func.readStats('10.0.2.1', 80, 'root', 'root', (err, stats) => {
    if(err) {
        console.error("\nAn error occurred fetching stats from antminer", err);
    } else {
        console.log("\nIncoming stats: ", stats);
    }
  }); 

   func.readOverview('10.0.2.1', 80, 'root', 'root', (err, overView) => {
    if(err) {
        console.error("\nAn error occurred fetching overview from antminer", err);
    } else {
        console.log("\nIncoming overview: ", overView);
    }
  }); */