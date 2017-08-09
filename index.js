let express = require('./config/express.js');
let app = express();
let server = require('http').Server(app);
//must attach socket.io to an http.Server instance,
//not an express request handler function
let io = require('socket.io')(server);

io.on('connection', function(socket) {
  console.log('A user has connected');
  socket.emit('news', { hello: 'world' });
  socket.on('other event', function(data) {
    console.log(data);
  });
});

server.listen(3000, function() {
  console.log('Server listening on port 3000.');
});
