module.exports = function(io) {
  let controller = require('../controllers/index.io.controllers.js')

  let led = {id: null};

  io.on('connection', function(socket) {

    socket.on('identifier', function(data) {
      console.log('A ' + data.type + ' has connected');
      controller.verify(socket, data, led);
    });

    socket.on('say hello', function() {
      controller.hello(socket, led);
    });

    socket.on('disconnect', function(reason) {
      controller.disconnect(socket, led);
    });

  });

};