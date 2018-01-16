//the following two functions should also send that information to
//all the other users so they can update their own renders of the grid
//pass in state.pixels and state.socket <- handled by server

const sendAllPixels = function(pixels, socket) {
  var ledArray = [];
  for(var i = 0; i < pixels.length; i++) {
    ledArray.push(pixels[i].fill);
  }

  socket.emit('post', {
    type: 'all-pixels',
    colors: ledArray
  });
};

const sendSinglePixel = function(pixel, pixelNum, socket) {
  var pixelFill = pixel.fill;

  socket.emit('post', {
    type: 'single-pixel',
    pixel: pixelNum,
    color: pixelFill
  });
};

export {sendAllPixels, sendSinglePixel};
