function hexToRGB(hex) { //expecting a hex string of type #xxxxxx
  //strip first letter ('#')
  var rgbString = hex.slice(1);

  var red = rgbString.substr(0,2);
  var green = rgbString.substr(2,2);
  var blue = rgbString.substr(4,2);

  //return an array [R,G,B]
  return [parseInt(red, 16), parseInt(green, 16), parseInt(blue, 16)];
}

//expect an [R,G,B] array of ints
function rgbToHEX(rgb) {
  var hex = '#';
  for(var i = 0; i < 3; i++) {
    hex += rgb[i].toString(16);
  }

  //return a hex string '#xxxxxx'
  return hex;
}

//the following two functions should also send that information to
//all the other users so they can update their own renders of the grid
function sendAllPixels(grid, socket) {
  var ledArray = [];
  for(var i = 0; i < grid.pixels.length; i++) {
    var hexVersion = grid.pixels[i].fill;
    var RGBVersion = hexToRGB(hexVersion);
    ledArray.push(RGBVersion);
  }

  socket.emit('post', {
    type: 'all-pixels',
    colors: ledArray
  });
}

function sendSinglePixel(grid, pixelNum, socket) {
  var pixelFillHex = grid.pixels[pixelNum].fill;
  var pixelRGBVersion = hexToRGB(pixelFillHex);
  console.log(pixelNum);
  socket.emit('post', {
    type: 'single-pixel',
    pixel: pixelNum,
    color: pixelRGBVersion
  });
}
