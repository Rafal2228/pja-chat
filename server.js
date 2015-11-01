var WebSocketServer = require('ws').Server;
var express = require('express');
var http = require('http');
var app = express();
var server = http.createServer(app);
var port = process.env.PORT || 5000;

// app config
app.set('views', __dirname + '/public');
app.set('view engine', 'jade');
app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
  res.render('index');
});

server.listen(port);
console.log('Starting server at port: ' + port);


var wss = new WebSocketServer({server: server, path: '/api'});
var allWS = [];

wss.on('connection', function(ws){
  var stdin = process.openStdin();
  var id = allWS.length;
  var callback = function(data) {
    if(ws.readyState == 1)
      ws.send('System: ' + data.toString().trim());
  };
  allWS.push(ws);

  stdin.addListener('data', callback);

  ws.on('message', function(message) {
    console.log('Browser: ' + message);
    for(var i = 0; i < allWS.length; i++)
      if(i != id) allWS[i].send('peer' + id + ': ' + message);
  });

  ws.on('close', function(){
    console.log('disconnected');
    allWS.splice(allWS.indexOf(ws, 1));
    stdin.removeListener('data', callback);
  });
});
console.log('WebSocketServer initialized');
