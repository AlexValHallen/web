var fs = require("fs");

var http = require("http");

var server = http.createServer(function (request, response){
    console.log("Requested URL: "+request.url);
    if(request.url === "/index" || request.url==="/"){
        response.writeHead(200, {"Content-type": "text/html; charset=utf-8"});
        fs.createReadStream(__dirname + "/index.html").pipe(response);
    }
    else if (request.url === "/about"){
        response.writeHead(200, {"Content-type": "text/html; charset=utf-8"});
        fs.createReadStream(__dirname + "/about.html").pipe(response);
    }
    else{
        response.writeHead(404, {"Content-type": "text/html; charset=utf-8"});
        fs.createReadStream(__dirname + "/404.html").pipe(response);
    }
});

server.listen(3000, 'localhost');
console.log("Listening to localhost:3000");

/* var readShort = fs.createReadStream(__dirname+"/article.txt", 'utf8');
var writeShort = fs.createWriteStream(__dirname+"/news.txt", 'utf8');

readShort.on('data', function(chunk){
    //console.log("New read data:\n" + chunk);
    console.log("Da new file was created!:\n");
    writeShort.write(chunk);
}); */