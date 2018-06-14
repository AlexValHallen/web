var field = $("#field")[0];
var chat = $("#chat")[0];

var ws = new WebSocket("ws://localhost:591/");

ws.onmessage = function(message){
    chat.value = message.data + "\n" + chat.value;
};

ws.onopen = function(){
    $(field).on("keydown", function(event){
        if(event.which==13){
            ws.send(field.value);
            field.value="";
        }
    });
}