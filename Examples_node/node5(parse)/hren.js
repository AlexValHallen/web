/* var express = require('express');
var fs = require('fs'); //access to file system
var request = require('request');
var cheerio = require('cheerio');
var app     = express();

request.post({
    headers: {'content-type' : 'application/x-www-form-urlencoded'},
    url:     "http://10.0.2.2",
    body:    "username=root&password=root&submit=Login"
  }, function(error, response, html){
      //do your parsing... 
      var $ = cheerio.load(html)
  }); */

 /*  var request = require('request');

  var options = {
    uri: 'http://10.0.2.5',
    auth: { 'user':'root', 'password':'root' }
};

function callback(error, response, body) {
     if (!error && response.statusCode == 200) {

         fs.writeFile('info.txt', body, function (err) {
             if (err) throw err;
         });

     }
     else {
        console.log("Error: " + error);
     }
 }

var req = request(options, callback); */

/* var http = require('http');
var options = {
    host: '10.0.2.5',
    path: '/index.html>',
    auth: 'root:root'
};

http.get(options,function(response){

    var pageData = "";

    response.on('data', function (chunk) {
        pageData += chunk;
    });
    
    response.on('end', function(){
        res.write(pageData);
        res.end();
    });

}); */