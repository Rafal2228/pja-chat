var chat = document.getElementsByClassName('chat')[0];
var chatInput = document.getElementById('chatInput');
var chatBtn = document.getElementById('chatBtn');

var br = document.createElement('br');
var ws = new WebSocket('wss://pja-chat.herokuapp.com/api');

var chatter = {};

chatter.draw = function(msg){
  chat.innerHTML = chat.innerHTML + msg;
  chat.appendChild(br);
}

chatter.send = function() {
  var msg = chatInput.value;
  if(msg.length != 0){
    chatInput.value = '';
    ws.send(msg);
    this.draw('Me: ' + msg);
  }
};

ws.onopen = function(event) {
  chatInput.addEventListener('keydown', function(event){
    if(event.keyCode == '13'){
      chatter.send();
    }
  });
  chatBtn.addEventListener('click', function(event){
    chatter.send();
  });
};

ws.onmessage = function(event) {
  chatter.draw(event.data);
};
