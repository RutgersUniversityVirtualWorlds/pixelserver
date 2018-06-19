import io from 'socket.io-client';

const SocketState = function() {
  let state = this;
  this.socket = io.connect();

  this.socket.on('connect', function() {
    state.socket.emit('identifier', {type: 'web-client'});
  });
};


SocketState.prototype.sendAllPixels = function(pixels) {
  let ledArray = [];
  for(let i = 0; i < pixels.length; i++) {
    ledArray.push(pixels[i].fill);
  }

  this.socket.emit('post', {
    type: 'all-pixels',
    colors: ledArray
  });
};

SocketState.prototype.sendSinglePixel = function(pixel, pixelNum) {
  let pixelFill = pixel.fill;

  this.socket.emit('post', {
    type: 'single-pixel',
    pixel: pixelNum,
    color: pixelFill
  });
};

export default SocketState;
