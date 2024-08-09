let express = require('express');
const path = require('path')

let app = express();

//middleware
app.use(express.static(__dirname + '/public'));
app.use(express.json());
function logger(req, res, next) {
    console.log(req.url, '\n', req.method, '\n', req.params, '\n', req.query);
    console.log(req.body);
    next();
}
//app.use(logger);

require('./router')(app);

const myServer = app.listen(8080, function () {
    console.log('Server listenening on port 8080');
});

const WebSocket = require("ws");

const wsServer = new WebSocket.Server({
    noServer: true
});                                      // a websocket server

wsServer.on("connection", function(ws) {    // what should a websocket do on connection
    ws.on("message", function(msg) {        // what to do on message event
        console.log(msg);
        wsServer.clients.forEach(function each(client) {
            if (client.readyState === WebSocket.OPEN) {     // check if client is ready
              client.send(msg.toString());
            }
        });
    });
});

myServer.on('upgrade', async function upgrade(request, socket, head) {      //handling upgrade(http to websocekt) event
    //emit connection when request accepted
    wsServer.handleUpgrade(request, socket, head, function done(ws) {
      wsServer.emit('connection', ws, request);
    });
});

