//host configuration with connection settings and commands
const SSH2Shell = require('ssh2shell');
// Enter the subnets, should be something like this: "10.0.0.1-253,10.0.1.1-253,10.0.2.1-253"
var urls = "25.0.10.10-240";
var res = readURLs(urls);
changePass(res);
async function changePass(urls) {
    for (var i in urls) {
        var host = {
            server: {
                host: urls[i],
                userName: "root",
                password: "admin",
            },
            commands: ["passwd"],
            connectedMessage: "Connected to "+urls[i],
            readyMessage: "Ready: "+urls[i]
        };
        
        //Create a new instance passing in the host object
        var SSH = new SSH2Shell(host),
        //Use a callback function to process the full session text
        callback = function (sessionText) {
            console.log(sessionText);
        }

        //Start the process
        await SSH.connect(callback);

        host.onCommandProcessing = function (command, response, sshObj, stream) {
            //Check the command and prompt exits and respond with a 'y' but only does it once
            if (command == "passwd" && response.indexOf("Enter new UNIX password:") != -1 && sshObj.firstRun != true) {
                //This debug message will only run when conditions are met not on every data event so is ok here
                if (sshObj.debug) { this.emit('msg', this.sshObj.server.host + "zhuzha"); }
                sshObj.firstRun = true;
                stream.write('zhuzha\n');
            }
            if (command == "passwd" && response.indexOf("Retype new UNIX password:") != -1) {
                if (sshObj.debug) { this.emit('msg', this.sshObj.server.host + "zhuzha"); }
                stream.write('zhuzha\n');
            }
        };

        /* host.onCommandComplete = function (command, response, sshObj, stream) {
            if (command == "passwd") {
                stream.write('exit\n');
            }
        } */
    }
}

   function readURLs(urls){
    var re = /\s*,\s*/;
    urls = urls.split(re);
    var resURL = [];
    for(var i=0; i<urls.length; i++){
            var lastInd = urls[i].lastIndexOf(".");
            var dashInd = urls[i].indexOf("-");
            if(dashInd==-1){
                resURL.push(urls[i]);
            }
            else{
                var subnet = urls[i].substring(0, lastInd+1);
                var startIP = parseInt(urls[i].substring(lastInd+1, dashInd));
                var endIP = parseInt(urls[i].substring(dashInd+1, urls[i].length))
                for(var j=startIP; j<=endIP; j++){
                    resURL.push(subnet+String(j));
                }
            }
    }
    return resURL;
}