import {preventDefaultFunction, mouseDownEvent, mouseUpEvent, mouseMoveEvent, mouseLeaveEvent} from './mouseEvents.js';
import {touchDownEvent, touchUpEvent, touchMoveEvent} from './touchEvents.js';

/* This code is largely based off of the following
tutorial: https://github.com/simonsarris/Canvas-tutorials/blob/master/shapes.js
by Simon Sarris ( www.simonsarris.com, sarris@acm.org)
Thanks for helping make this project possible. - Gibran */

const CanvasState = function(canvas, socket) {
  /******* setup **********/
  this.canvas = canvas;
  this.socket = socket;
  this.width = canvas.width;
  this.height = canvas.height;
  this.ctx = canvas.getContext('2d');
  this.activeColor = [123, 100, 255];

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

  /****** Events *****/
  //'this' is a newly created CanvasState object
  //thus this.canvas = canvas reffers to the canvas we passed along
  //make a self-reference to CanvasState for when we trigger events
  var state = this;

  /******* Mouse Events *******/
  //fixes a problem where double clicking causes text to get selected on the canvas
  canvas.addEventListener('selectstart', function(e) { return preventDefaultFunction(e); }, false);

  //drawing pixels on mousedown
  canvas.addEventListener('mousedown', function(e) { mouseDownEvent(e, state); });

  //dragging functionality for drawing
  canvas.addEventListener('mousemove', function(e) { mouseMoveEvent(e, state); });

  //regardless of where on the window a mouseup disables dragging
  window.addEventListener('mouseup', function(e) { mouseUpEvent(e, state); });

  //when mouse leaves canvas, highlight should dissapear
  canvas.addEventListener('mouseleave', function(e) { mouseLeaveEvent(e, state); });

  /****** Touch Events ******/
  canvas.addEventListener('touchstart', function(e) { touchDownEvent(e, state);});

  canvas.addEventListener('touchend', function(e) { touchUpEvent(e, state);});

  canvas.addEventListener('touchmove', function(e) { touchMoveEvent(e, state);});

};


// Creates an object with x and y defined, set to the mouse position relative to the state's canvas
// If you wanna be super-correct this can be tricky, we have to worry about padding and borders
CanvasState.prototype.getMouse = function(e) {
  var element = this.canvas;
  var offset = this.getOffset(element);

  var mx = e.pageX - offset.x;
  var my = e.pageY - offset.y;

  // We return a simple javascript object (a hash) with x and y defined
  return {x: mx, y: my};
};

CanvasState.prototype.getTouch = function(e) {
  var element = this.canvas;
  var offset = this.getOffset(element);

  //https://developer.mozilla.org/en-US/docs/Web/API/Touch/pageX
  var tx = e.changedTouches[0].pageX - offset.x;
  var ty = e.changedTouches[0].pageY - offset.y;

  // We return a simple javascript object (a hash) with x and y defined
  return {x: tx, y: ty};
};

CanvasState.prototype.getOffset = function(element) {
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

  return {x: offsetX, y: offsetY};
};

CanvasState.prototype.clear = function() {
  var ctx = this.ctx;
  ctx.clearRect(0,0, ctx.canvas.width, ctx.canvas.height);
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

export default CanvasState;
