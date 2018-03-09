module.exports = function(io) {
  let controller = require('../controllers/index.io.controllers.js')

  let led = {
    id: null,
    dimmensions: {
      width: 0,
      height: 0
    },
    boardState: []
  };

  let users = {
    count: 0
  }

  io.on('connection', function(socket) {

    socket.on('identifier', function(data) {
      controller.verify(socket, data, led, users);
    });

    socket.on('post', function(data) {
      controller.post(socket, data, led);
    });

    socket.on('disconnect', function(reason) {
      controller.disconnect(socket, led, users);
    });

  });

};
