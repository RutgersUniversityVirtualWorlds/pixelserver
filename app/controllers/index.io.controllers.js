module.exports = {
  verify: function(socket, data, led) {
    console.log('A ' + data.type + ' has connected');
    if(data.type === 'web-client') {
      if(led.id !== null) {
        socket.emit('boardConnect', {dimmensions: led.dimmensions, boardState: led.boardState});
      }
    }
    else if(data.type === 'device') {
      if(led.id === null) {
        led.id = socket.id;
        led.dimmensions.width = data.dimmensions.width;
        led.dimmensions.height = data.dimmensions.height;

        //led.boardState = [] here
        for(var i = 0; i < data.dimmensions.width * data.dimmensions.height; i++) {
          led.boardState.push(data.boardState[i]);
        }
        console.log('Emitting state to all currently connected users');
        socket.broadcast.emit('boardConnect', {dimmensions: led.dimmensions, boardState: led.boardState});
      }
      else {
        console.log('A device has already been connected');
      }
    }
  },

  post: function(socket, data, led) {
    if(led.id !== null) { //if led exists
      if(data.type === 'single-pixel') {
          socket.to(led.id).emit('read', {type: data.type, pixel: data.pixel, color: data.color});
          //also update our global variable of led board state
          led.boardState[data.pixel] = data.color;
      }
      else if(data.type === 'all-pixels'){ //sending all the pixels
        socket.to(led.id).emit('read', {type: data.type, colors: data.colors});
        led.boardState = data.colors;
      }
      else {
        //do nothing
        return;
      }
      socket.broadcast.emit('boardUpdate', {boardState: led.boardState});
    }
    else {
      console.log("couldn't send the message, no device currently connected");
    }
  },
  disconnect: function(socket, led) {
    if(socket.id === led.id) {
      //clear all the web-client boards
      socket.broadcast.emit('boardDisconnect');

      led.id = null;
      led.boardState.length = 0;
      led.dimmensions.width = 0;
      led.dimmensions.height = 0;
      console.log('The device has disconnected');
    }
    else {
        console.log('A web-client has disconnected');
    }
  }
};
