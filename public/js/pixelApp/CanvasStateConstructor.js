import Pixel from './PixelConstructor.js';

/* This code is based off of the following
tutorial: https://github.com/simonsarris/Canvas-tutorials/blob/master/shapes.js
by Simon Sarris ( www.simonsarris.com, sarris@acm.org)
Thanks for helping make this project possible. - Gibran */

const CanvasState = function(canvas, socket, touches, mouse) {
  /******* setup **********/
  let state = this;
  this.canvas = canvas;
  this.id = this.canvas.id;
  this.socket = socket;
  this.touches = touches;
  this.mouse = mouse;

  this.ctx = canvas.getContext('2d');
  this.activeColor = [0, 0, 0];

  /***** State Variables ******/
  this.pixels = [];
  this.render = false;
  this.dragging = false;

  /****** Events *****/
  /******* Mouse Events *******/
  //fixes a problem where double clicking causes text to get selected on the canvas
  this.canvas.addEventListener('selectstart', function(e) {e.preventDefault();});

  this.canvas.addEventListener('mousedown', function(e) { state.mouse.DownEvent(e, state);});

  this.canvas.addEventListener('mousemove', function(e) { state.mouse.MoveEvent(e, state);});

  //regardless of where on the window a mouseup disables dragging
  window.addEventListener('mouseup', function(e) { state.mouse.UpEvent(e, state);});

  //when mouse leaves canvas, highlight should disappear
  this.canvas.addEventListener('mouseleave', function(e) { state.mouse.LeaveEvent(e, state);});

  /****** Touch Events ******/
  this.canvas.addEventListener('touchstart', function(e) { state.touches.Handler(e, state);});
  this.canvas.addEventListener('touchend', function(e) { state.touches.Handler(e, state);});
  this.canvas.addEventListener('touchmove', function(e) { state.touches.Handler(e, state);});
};


CanvasState.prototype.draw = function() {
  if(this.render) {
    //if render set to true, redraw the canvas
    this.clear();
    let ctx = this.ctx;
    let pixels = this.pixels;

    //draw everything below the grid here

    for(let i = 0; i < pixels.length; i++) {
      pixels[i].draw(ctx);
    }

    //draw everything after the pixel grid has been drawn here

    this.render = false;
  }
};

CanvasState.prototype.clear = function() {
  let ctx = this.ctx;
  ctx.clearRect(0,0, ctx.canvas.width, ctx.canvas.height);
};

/******* Socket Related Methods  *******/

CanvasState.prototype.setUpGrid = function(dimmensions, pixelSize, colors) {
  for(let i = 0; i < dimmensions.height; i++) { //rows (height)
    for(let j = 0; j < dimmensions.width; j++) { //columns (width)
      let tempPixelInstance = new Pixel(j*pixelSize, i*pixelSize, pixelSize, pixelSize, colors[i*dimmensions.width + j]);
      this.pixels.push(tempPixelInstance);
    }
  }
  this.render = true;
  this.draw();
};

CanvasState.prototype.updateGrid = function(colors) {
  for(let i = 0; i < this.pixels.length; i++) {
    this.pixels[i].fill = colors[i];
  }
  this.render = true;
  this.draw();
};

CanvasState.prototype.deleteGrid = function() {
  for(let i = this.pixels.length; i > 0; i--) {
    this.pixels.pop();
  }
  this.render = true;
  this.draw();
};

/******** Input related methods *********/

//handle offsetting of mouse/touch due to any css styling or html elements
CanvasState.prototype.getOffset = function(element) {
  let offsetX = 0;
  let offsetY = 0;
  
  // Compute the total offset
  if (element.offsetParent !== undefined) {
    do {
      offsetX += element.offsetLeft;
      offsetY += element.offsetTop;
    } while ((element = element.offsetParent));
  }

  // Fix mouse co-ordinate problems when there's a border or padding.
  let stylePaddingLeft, stylePaddingTop, styleBorderLeft, styleBorderTop;
  if (document.defaultView && document.defaultView.getComputedStyle) {
    this.stylePaddingLeft = parseInt(document.defaultView.getComputedStyle(this.canvas, null)['paddingLeft'], 10) || 0;
    this.stylePaddingTop = parseInt(document.defaultView.getComputedStyle(this.canvas, null)['paddingTop'], 10) || 0;
    this.styleBorderLeft = parseInt(document.defaultView.getComputedStyle(this.canvas, null)['borderLeftWidth'], 10) || 0;
    this.styleBorderTop = parseInt(document.defaultView.getComputedStyle(this.canvas, null)['borderTopWidth'], 10) || 0;
  }

  // Some pages have fixed-position bars at the top or left of the page
  // They will mess up mouse coordinates and this fixes that
  let html = document.body.parentNode;
  this.htmlTop = html.offsetTop;
  this.htmlLeft = html.offsetLeft;

  // Add padding and border style widths to offset
  // Also add the <html> offsets in case there's a position:fixed bar
  offsetX += this.stylePaddingLeft + this.styleBorderLeft + this.htmlLeft;
  offsetY += this.stylePaddingTop + this.styleBorderTop + this.htmlTop;

  return {x: offsetX, y: offsetY};
};

/****** Window related methods ******/
CanvasState.prototype.resizeGrid = function(e, wrapper) {
  let pixelSize = wrapper.resizeCanvasElement();
  //reset the value of a pixel
  for(let i = 0; i < this.pHeight; i++) {
    for(let j = 0; j < this.pWidth; j++) {
      canvas.pixels[i*this.pWidth+j].updatePixelSize(j*pixelSize, i*pixelSize, pixelSize, pixelSize);
    }
  }
  this.render = true;
  this.draw();
};

export default CanvasState;
