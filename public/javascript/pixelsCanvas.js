/* This code is largely based off of the following
tutorial: https://github.com/simonsarris/Canvas-tutorials/blob/master/shapes.js
by Simon Sarris ( www.simonsarris.com, sarris@acm.org)
Thanks for helping make this project possible. - Gibran */

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
  this.render = false;
  this.dragging = false;

  /******* Mouse Events *******/
  //'this' is a newly created CanvasState object
  //thus this.canvas = canvas reffers to the canvas we passed along
  //make a self-reference to CanvasState for when we trigger mouseEvents
  var state = this;

  //fixes a problem where double clicking causes text to get selected on the canvas
 canvas.addEventListener('selectstart', function(e) { return preventDefaultFunction(e); }, false);

 //drawing pixels on mousedown
 canvas.addEventListener('mousedown', function(e) { mouseDownEvent(e, state); });

 //dragging functionality for drawing
 canvas.addEventListener('mousemove', function(e) { mouseMoveEvent(e, state); });

//regardless of where on the window! A mouseup disables dragging
 window.addEventListener('mouseup', function(e) { state.dragging = false; });

//when mouse leaves canvas, highlight should dissapear
 canvas.addEventListener('mouseleave', function(e) { mouseLeaveEvent(e, state); });
};


// Creates an object with x and y defined, set to the mouse position relative to the state's canvas
// If you wanna be super-correct this can be tricky, we have to worry about padding and borders
CanvasState.prototype.getMouse = function(e) {
  var element = this.canvas;
  var offsetX = 0;
  var offsetY = 0;

  // Compute the total offset
  if (element.offsetParent !== undefined) {
    do {
      offsetX += element.offsetLeft;
      offsetY += element.offsetTop;
    } while ((element = element.offsetParent));
  }

  // Add padding and border style widths to offset
  // Also add the <html> offsets in case there's a position:fixed bar
  offsetX += this.stylePaddingLeft + this.styleBorderLeft + this.htmlLeft;
  offsetY += this.stylePaddingTop + this.styleBorderTop + this.htmlTop;

  var mx = e.pageX - offsetX;
  var my = e.pageY - offsetY;

  // We return a simple javascript object (a hash) with x and y defined
  return {x: mx, y: my};
};

CanvasState.prototype.clear = function() {
  var ctx = this.ctx;
  ctx.clearRect(0,0, 101, 101);
};

CanvasState.prototype.draw = function() {
  if(this.render) {
    //if render set to true, redraw the canvas
    this.clear();
    var ctx = this.ctx;
    var pixels = this.pixels;

    //draw everything below the grid here

    for(var i = 0; i < pixels.length; i++) {
      pixels[i].draw(ctx);
    }

    //draw everything after the pixel grid has been drawn here

    this.render = false;
  }
};

function setUpGrid(grid, dimmensions, colors) {
  //TODO: passed along dimmensions, use it to build an
  //appropriate grid
  for(var i = 0; i < 5; i++) {
    for (var j = 0; j < 5; j++) {
      var hex = rgbToHEX(colors[i*5 + j]);
      var tempPixelInstance = new Pixel(j*20, i*20, 20, 20, hex);
      grid.pixels.push(tempPixelInstance);
    }
  }
  grid.render = true;
  grid.draw();
}

function updateGrid(grid, colors) {
  //again, use dimmension variables here instead
  for(var i = 0; i < 5*5; i++) {
    var hex = rgbToHEX(colors[i]);
    grid.pixels[i].fill = hex;
  }
  grid.render = true;
  grid.draw();
}

function clearGrid(grid) {
  for(var i = 0; i < 5; i++) {
    for(var j =0; j < 5; j++) {
      grid.pixels.pop();
    }
  }
  grid.render = true;
  grid.draw();
}

function init() {
  var grid = new CanvasState(document.getElementById('editor'));

  socket.on('boardConnect', function(data) {
    setUpGrid(grid, data.dimmensions, data.boardState);
  })
  socket.on('boardUpdate', function(data) {
    updateGrid(grid, data.boardState);
  });
  socket.on('boardDisconnect', function() {
    clearGrid(grid);
  })
  //sendAllPixels(grid, socket);
  //sendSinglePixel(grid, 2, socket);
}

init();
