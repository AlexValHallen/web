var antminer = require('antminer-func');
var Sequelize = require('sequelize');
var connection = new Sequelize('test', 'root', '', {
    host: '127.0.0.1',
    dialect: 'mysql',
    insecureAuth: true
});


var fs = require('fs');

var urls2 = [];
for(var i=0; i<255; i++){
    urls2[i] = "http://10.0.2."+i;
}

fs.writeFile(__dirname+"/info.txt", "", function (wrt_err){
    if(wrt_err) throw wrt_err;
});


antminer.readOverView(urls2);
antminer.readStats(urls2);
