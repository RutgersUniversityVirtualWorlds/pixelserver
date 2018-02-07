import Touch from './TouchClass.js';

class TouchHandler {
  constructor() {
    this.touchList = [];
    this.multiTouch = false;
  }

  findTouchIndex(identifier) {
    for(let i = 0; i < this.touchList.length; i++) {
      if(this.touchList[i].object.identifier === identifier) {
        return i;
      }
    }
    return -1;
  }

  Handler(e, state) {
    //add just ONE event trigger when canvas or viewWrapper is touched
    //otherwise results in duplicate calls due to overlapping of elements
    if((state.id === 'editor' && e.target.id === state.id) || (state.id === 'view' && e.target.id === state.id)) {
      switch (e.type) {
        case 'touchstart':
          this.DownEvent(e, state);
          break;
        case 'touchmove':
          this.MoveEvent(e, state);
          break;
        case 'touchend':
          this.UpEvent(e, state);
          break;
      }
    }
  }

  DownEvent(e, state) {
    //create a new touch object
    let currTouch = new Touch(e.changedTouches[0], 'touch');
    this.touchList.push(currTouch); 

    if(this.touchList.length > 1) this.multiTouch = true;
    if(state.id === 'editor') e.preventDefault();

    //only 1 touch in entirety of contact and on canvas element
    if(this.multiTouch === false && state.id === 'editor') {
      state.dragging = true;
    }
    else {
      state.dragging = false;
    }
  }

  MoveEvent(e, state) {
    let currTouchIndex = this.findTouchIndex(e.changedTouches[0].identifier);
    let currTouch = this.touchList[currTouchIndex];

    if(state.id === 'editor') e.preventDefault();
    //disable default page zooming, but doesn't disable scrolling
    if(state.id === 'view' && this.multiTouch === true) e.preventDefault();

    //one touch occured and it was on canvas
    if(this.multiTouch === false && state.id === 'editor') {
      currTouch.setTouchPos(e, state);
      currTouch.handleMoving(state);
    }
    else if (this.multiTouch === true && this.touchList.length > 1) {
      this.ZoomEvent(e, state);
    }
  }

  UpEvent(e, state) {
    if(state.id === 'editor') e.preventDefault();

    let currTouchIndex = this.findTouchIndex(e.changedTouches[0].identifier);
    let currTouch = this.touchList[currTouchIndex];

    //if only 1 touch ever occurred and it was on the canvas element
    if(this.multiTouch === false && state.id === 'editor') {
      currTouch.setTouchPos(e, state);
      currTouch.colorPixel(state);
      state.dragging = false;
    }
    //multi-touch did occur
    else if(this.multiTouch === true) {
      //removing the last finger
      if(this.touchList.length === 1) {
        this.multiTouch = false;
      }
    }

    //remove touch from list
    this.touchList.splice(currTouchIndex, 1);
  }

  ZoomEvent(e, state) {
    //zooming is done by comparing the distance between two points in its previous iteration
    //and its current iteration. If the points are closer, zooming out, otherwise zooming in. 
      
    let oldDeltaX = this.touchList[0].x - this.touchList[1].x;
    let oldDeltaY = this.touchList[0].y - this.touchList[1].y;
    let oldDistance = Math.sqrt(Math.pow(oldDeltaX, 2) + Math.pow(oldDeltaY, 2));

    //update value for touch that changed position, but store old vals
    let currTouchIndex = this.findTouchIndex(e.changedTouches[0].identifier);
    let oldX = this.touchList[currTouchIndex].x;
    let oldY = this.touchList[currTouchIndex].y;
    this.touchList[currTouchIndex].setTouchPos(e);

    let newDeltaX = this.touchList[0].x - this.touchList[1].x;
    let newDeltaY = this.touchList[0].y - this.touchList[1].y;
    let newDistance = Math.sqrt(Math.pow(newDeltaX, 2) + Math.pow(newDeltaY, 2));

    let grid = null;
    if(state.id === "editor") {
      grid = state;
    }
    else if (state.id === "view") {
      grid = state.child;
    }

    //TODO: maybe have the threshhold for change be dependent on dimmensions of grid
    if(Math.abs(newDistance - oldDistance) > 5) {
      let pixelSize = grid.pixels[0].w;
      if(newDistance - oldDistance > 0) { //positive change, zooming in 
        pixelSize += 1;
        grid.canvas.width = grid.pWidth * pixelSize + 1;
        grid.canvas.height = grid.pHeight * pixelSize + 1;
        grid.ctx.clearRect( 0, 0, grid.canvas.width, grid.canvas.height);

        grid.resizeGrid(null, pixelSize);
      }
      else if(newDistance - oldDistance < 0 && pixelSize > 4) { //negative change, zooming out
        pixelSize -= 1;
        grid.canvas.width = grid.pWidth * pixelSize + 1;
        grid.canvas.height = grid.pHeight * pixelSize + 1;
        grid.ctx.clearRect( 0, 0, grid.canvas.width, grid.canvas.height);

        grid.resizeGrid(null, pixelSize);
      }
    }
    else {
      //restore old vals if change in distance isn't enough to trigger
      this.touchList[currTouchIndex].x = oldX;
      this.touchList[currTouchIndex].y = oldY;
    }
  }

  PanEvent(e, state) {

  }
};

export default TouchHandler;
