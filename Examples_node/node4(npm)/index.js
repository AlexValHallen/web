var express = require("express");

var app = express();

app.get("/", function(req, res){
    res.sendFile(__dirname+"/index.html");
});

app.get("/news/:id", function(req, res){
    res.send("We're in the "+ req.params.id+" section, baby!");
});

app.listen(3000);

