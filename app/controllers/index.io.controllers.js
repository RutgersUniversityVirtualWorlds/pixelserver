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
  //TODO: Definitely improve this. Data being sent is not being checked
  post: function(socket, data, led) {
    if(led.id !== null) { //if led exists
      let filteredData = {};
      filteredData.type = data.type;
      if(filteredData.type === 'single-pixel') {
          filteredData.pixel = data.pixel;
          filteredData.color = data.color;
      }
      else { //sending all the pixels
        filteredData.colors = data.colors;
      }
      socket.to(led.id).emit('read', filteredData);
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
