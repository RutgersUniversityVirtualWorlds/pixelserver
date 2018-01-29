import {mouseDownEvent, mouseMoveEvent, mouseUpEvent, mouseLeaveEvent} from './mouseEvents.js';
import {touchHandler} from './touchEvents.js';
import Pixel from './PixelConstructor.js';

/* This code is based off of the following
tutorial: https://github.com/simonsarris/Canvas-tutorials/blob/master/shapes.js
by Simon Sarris ( www.simonsarris.com, sarris@acm.org)
Thanks for helping make this project possible. - Gibran */

const CanvasState = function(canvas, socket, touches) {
  /******* setup **********/
  let state = this;
  this.canvas = canvas;
  this.id = this.canvas.id;
  this.socket = socket;
  this.touches = touches;

  this.ctx = canvas.getContext('2d');
  this.activeColor = [123, 100, 255];

  /***** State Variables ******/
  this.pixels = [];
  this.render = false;
  this.dragging = false;

  /****** Events *****/
  /******* Mouse Events *******/
  //fixes a problem where double clicking causes text to get selected on the canvas
  this.canvas.addEventListener('selectstart', function(e) {e.preventDefault();});

  this.canvas.addEventListener('mousedown', function(e) { mouseDownEvent(e, state);});

  this.canvas.addEventListener('mousemove', function(e) { mouseMoveEvent(e, state);});

  //regardless of where on the window a mouseup disables dragging
  window.addEventListener('mouseup', function(e) { mouseUpEvent(e, state);});

  //when mouse leaves canvas, highlight should disappear
  this.canvas.addEventListener('mouseleave', function(e) { mouseLeaveEvent(e, state);});

  /****** Touch Events ******/
  this.canvas.addEventListener('touchstart', function(e) { touchHandler(e, state);});
  this.canvas.addEventListener('touchend', function(e) { touchHandler(e, state);});
  this.canvas.addEventListener('touchmove', function(e) { touchHandler(e, state);});

  /******* Other Events *****/
  window.addEventListener('resize', function(e) { state.resizeGrid(e);});
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
  for(let i = 0; i < grid.pixels.length; i++) {
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

/****** Window resizing methods *********/

//resize the canvas element based on the current dimmensions of the window
CanvasState.prototype.resizeCanvasElement = function() {
  //1) get the dimmensions of the window and subtract desired padding
  let winWidth = window.innerWidth - (window.innerWidth * .1);
  let winHeight = window.innerHeight - (window.innerHeight * .1)

  //2) divide dimmensions by dimmensions of physical pixels
  let widthProportion = Math.floor(winWidth/this.pWidth);
  let heightProportion = Math.floor(winHeight/this.pHeight);
  
  //3) floor the results and lowest one determines initial size of canvas
  let pixelSize = Math.min(widthProportion, heightProportion);

  //set new dimmensions of canvas element
  this.canvas.width = this.pWidth * pixelSize + 1;
  this.canvas.height = this.pHeight * pixelSize + 1;
  this.ctx.clearRect( 0, 0, this.canvas.width, this.canvas.height);

  return pixelSize;
};

//set the new size for all the pixels, so grid drawn on canvas element is the right size
CanvasState.prototype.resizeGrid = function(e) {
    let pixelSize = this.resizeCanvasElement();
    //reset the value of a pixel
    for(let i = 0; i < this.pHeight; i++) {
      for(let j = 0; j < this.pWidth; j++) {
        this.pixels[i*this.pWidth+j].updatePixelSize(j*pixelSize, i*pixelSize, pixelSize, pixelSize);
      }
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

// Create an object with x and y defined, set to the mouse position relative to the state's canvas
CanvasState.prototype.getMouse = function(e) {
  let element = this.canvas;
  let offset = this.getOffset(element);

  let mx = e.pageX - offset.x;
  let my = e.pageY - offset.y;

  return {type: 'mouse', x: mx, y: my};
};

CanvasState.prototype.getTouch = function(e) {
  let element = this.canvas;
  let offset = this.getOffset(element);

  //https://developer.mozilla.org/en-US/docs/Web/API/Touch/pageX
  let tx = e.changedTouches[0].pageX - offset.x;
  let ty = e.changedTouches[0].pageY - offset.y;

  // We return a simple javascript object (a hash) with x and y defined
  return {type: 'touch', x: tx, y: ty};
};


export default CanvasState;
