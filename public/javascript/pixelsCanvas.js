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
 canvas.addEventListener('selectstart', function(e) {
   e.preventDefault(); return false;
 }, false);

 canvas.addEventListener('mousedown', function(e) {
   //when mouse clicks down on our canvas grid:
   //determine which pixel it has touched.
   var mouse = state.getMouse(e);
   state.dragging = true;

   //mouse.x,mouse.y now give us our position, now loop through
   //our pixels until the one that contains the mouse is found
   for(var i = 0; i < state.pixels.length; i++) {
     if(state.pixels[i].contains(mouse.x, mouse.y)) {
       var selection = state.pixels[i];
       state.render = true;

       selection.fill = '#000000';
       state.draw();
       sendSinglePixel(state, i, socket);
     }
   }
 });

 canvas.addEventListener('mousemove', function(e) {
  var mouse = state.getMouse(e);

  for(var i = 0; i < state.pixels.length; i++) {
    if(state.pixels[i].contains(mouse.x, mouse.y)) {
      state.render = true;
      var selection = state.pixels[i];

      if(!state.dragging) {
        state.draw();
        //add highlight on top of the current pixel
        selection.drawHighlight(state.ctx);
      }
      else {
        selection.fill = '#000000';
        state.draw();
        sendSinglePixel(state, i, socket);
      }
    }
  }
 });

//regardless of where on the window! A mouseup disables dragging
 window.addEventListener('mouseup', function(e) {
   state.dragging = false;
 });

//when mouse leaves canvas, highlight should dissapear
 canvas.addEventListener('mouseleave', function(e) {
   //essentially redraw the canvas without drawing the highlight
   state.render = true;
   state.draw();
 });
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

    for(var i = 0; i < pixels.length; i++) {
      pixels[i].draw(ctx);
    }

    this.render = false;
  }
};

function setUpGrid(grid) {
  //ideally this will get a 'global' state of what the grid looks like right now
  //and then display it to the user.
  for(var i = 0; i < 5; i++) {
    for (var j = 0; j < 5; j++) {
      var tempPixelInstance = new Pixel(j*20, i*20, 20, 20, '#ffffff');
      tempPixelInstance.draw(grid.ctx);
      grid.pixels.push(tempPixelInstance);
    }
  }
}

function init() {
  var grid = new CanvasState(document.getElementById('editor'));
  setUpGrid(grid);

  sendAllPixels(grid, socket);
  //sendSinglePixel(grid, 2, socket);
}

init();
