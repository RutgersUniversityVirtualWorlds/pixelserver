let express = require('express');
let app = express();
let http = require('http').Server(app);
let io = require('socket.io')(http);

app.set('views', './app/views');
app.set('view engine', 'ejs');

app.get('/', function(req, res) {
  res.render('index');
});

io.on('connection', function(socket) {
  console.log('A user has connected');
  socket.emit('news', { hello: 'world' });
  socket.on('other event', function(data) {
    console.log(data);
  });
});

http.listen(3000, function() {
  console.log('Server listening on port 3000.');
});
