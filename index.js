let express = require('./config/express.js');
let app = express();
let server = require('http').Server(app);

//must attach socket.io to an http.Server instance,
//not an express request handler function
let io = require('socket.io')(server);
//io events handler
require('./app/events/index.io.events.js')(io);

server.listen(3000, function() {
  console.log('Server listening on port 3000.');
});
