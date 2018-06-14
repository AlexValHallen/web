var wss = require("ws").Server;
var server = new wss({port:591});

var fs = requre("fs");

fs.read("database.txt", "utf-8", function(err, content){

});

//fs.writeFile("database.txt", content);