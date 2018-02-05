const ViewState = function(canvasWrapper, canvas, touches) {
  /******* setup **********/
  let state = this;
  this.view = canvasWrapper;
  this.id = this.view.id;
  this.child = canvas;
  this.touches = touches;

  /****** Events *****/
  /******* Touch Events *******/
  //Here need to handle touch events for pinch/zoom the canvas and two-finger drag
  this.view.addEventListener('touchstart', function(e) {state.touches.Handler(e, state);});
  this.view.addEventListener('touchend', function(e) {state.touches.Handler(e, state);});
  this.view.addEventListener('touchmove', function(e) {state.touches.Handler(e, state);});

  /******* Windowing Events *****/
  window.addEventListener('resize', function(e) { state.child.resizeGrid(e, state);});
};

/****** Window resizing methods *********/

ViewState.prototype.resizeCanvasElement = function() {
  let viewWidth = this.view.offsetWidth - (this.view.offsetWidth * .1);
  let viewHeight = this.view.offsetHeight - (this.view.offsetHeight * .1)

  let widthProportion = Math.floor(viewWidth/this.child.pWidth);
  let heightProportion = Math.floor(viewHeight/this.child.pHeight);
  
  let pixelSize = Math.min(widthProportion, heightProportion);

  //set new dimmensions of canvas element
  this.child.canvas.width = this.child.pWidth * pixelSize + 1;
  this.child.canvas.height = this.child.pHeight * pixelSize + 1;
  this.child.ctx.clearRect( 0, 0, this.child.canvas.width, this.child.canvas.height);

  return pixelSize;
};

export default ViewState;
