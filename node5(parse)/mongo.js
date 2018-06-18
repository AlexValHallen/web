var mongoClient = require("mongodb").MongoClient,
    url = "mongodb://localhost/sandbox";

mongoClient.connect(url, function(err, db){
    var humans = db.collection("humans");
    humans.insert({
        name: "Алексей",
        age: 35
    }, function (err, result){
        console.log(result);
    }
    );
    
});