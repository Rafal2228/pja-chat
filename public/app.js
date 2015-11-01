var chat = document.getElementsByClassName('chat')[0];
var chatInput = document.getElementById('chatInput');
var chatBtn = document.getElementById('chatBtn');
var br = document.createElement('br');

if (location.port) {
  var endpoint = 'wss://' + window.location.hostname + ':' + location.port + '/api';
} else {
  var endpoint = 'wss://' + window.location.hostname + '/api';
}

var ws = new WebSocket(endpoint);

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
