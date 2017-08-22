/* This code is largely based off of the following
tutorial: https://github.com/simonsarris/Canvas-tutorials/blob/master/shapes.js
by Simon Sarris ( www.simonsarris.com, sarris@acm.org)
Thanks for helping make this project possible. - Gibran */

//basic pixel constructor
function Pixel(x,y, w, h, fill) {
  this.x = x || 0;
  this.y = y || 0;
  this.w = w || 20;
  this.h = h || 20;
  this.fill = fill || '#AAAAAA';
}

//draw pixel to ctx
Pixel.prototype.draw = function(ctx) {
  ctx.fillStyle = this.fill;
  ctx.fillRect(this.x, this.y, this.w, this.h);
  //https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Applying_styles_and_colors
  ctx.strokeRect(this.x+0.5, this.y+0.5, this.w, this.h);
}

//determine if mouse is currently within the bounds of the current pixel
Pixel.prototype.contains = function(mx,my) {
  if(mx >= this.x && my >= this.y && mx <= (this.x + this.w) && my <= (this.y + this.h)) {
    return true;
  }
  else return false;
}


function CanvasState(canvas) {
  /******* setup **********/
  this.canvas = canvas;
  this.width = canvas.width;
  this.height = canvas.height;
  this.ctx = canvas.getContext('2d');

  // This complicates things a little but but fixes mouse co-ordinate problems
  // when there's a border or padding. See getMouse for more detail
  var stylePaddingLeft, stylePaddingTop, styleBorderLeft, styleBorderTop;
  if (document.defaultView && document.defaultView.getComputedStyle) {
    this.stylePaddingLeft = parseInt(document.defaultView.getComputedStyle(canvas, null)['paddingLeft'], 10)      || 0;
    this.stylePaddingTop  = parseInt(document.defaultView.getComputedStyle(canvas, null)['paddingTop'], 10)       || 0;
    this.styleBorderLeft  = parseInt(document.defaultView.getComputedStyle(canvas, null)['borderLeftWidth'], 10)  || 0;
    this.styleBorderTop   = parseInt(document.defaultView.getComputedStyle(canvas, null)['borderTopWidth'], 10)   || 0;
  }
  // Some pages have fixed-position bars (like the stumbleupon bar) at the top or left of the page
  // They will mess up mouse coordinates and this fixes that
  var html = document.body.parentNode;
  this.htmlTop = html.offsetTop;
  this.htmlLeft = html.offsetLeft;

  /***** State Variables ******/
  this.pixels = [];
}

function setUpGrid(grid) {
  for(var i = 0; i < 5; i++) {
    for (var j = 0; j < 5; j++) {
      var tempPixelInstance = new Pixel(i*20, j*20, 20, 20, '#ffffff');
      tempPixelInstance.draw(grid.ctx);
      grid.pixels.push(tempPixelInstance);
    }
  }
}

function hexToRGB(hex) { //expecting a hex string of type #xxxxxx
  //strip first letter ('#')
  var rgbString = hex.slice(1);

  var red = rgbString.substr(0,2);
  var green = rgbString.substr(2,2);
  var blue = rgbString.substr(4,2);

  //return an array [R,G,B]
  return [parseInt(red, 16), parseInt(green, 16), parseInt(blue, 16)];
}

function sendAllPixels(grid, socket) {
  var ledArray = [];
  for(var i = 0; i < grid.pixels.length; i++) {
    var hexVersion = grid.pixels[i].fill;
    var RGBVersion = hexToRGB(hexVersion);
    ledArray.push(RGBVersion);
  }

  socket.emit('post', {
    type: 'all-pixels',
    colors: ledArray,
    time: 1000
  });
}

function sendSinglePixel(grid, pixelNum, socket) {
  var pixelFillHex = grid.pixels[pixelNum].fill;
  var pixelRGBVersion = hexToRGB(pixelFillHex);

  socket.emit('post', {
    type: 'single-pixel',
    pixel: pixelNum,
    color: pixelRGBVersion
  });
}

function init() {
  var grid = new CanvasState(document.getElementById('editor'));
  setUpGrid(grid);

  sendAllPixels(grid, socket);
  //sendSinglePixel(grid, 2, socket);
}

init();
