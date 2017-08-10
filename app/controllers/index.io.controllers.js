module.exports = {
  verify: function(socket, data, led) {
    if(data.type === 'device') {
      if(led.id === null) {
        led.id = socket.id;
        console.log('Device id has been stored');
      }
      else {
        console.log('A device has already been connected');
      }
    }
  },
  hello: function(socket, led) {
    if(led.id !== null) {
      socket.to(led.id).emit('hello', 'hello from the web!');
      console.log('message sent');
    }
    else {
      console.log("couldn't send the message");
    }
  },
  disconnect: function(socket, led) {
    if(socket.id === led.id) {
      led.id = null;
      console.log('The device has disconnected');
    }
    else {
        console.log('A web-client has disconnected');
    }
  }
};
