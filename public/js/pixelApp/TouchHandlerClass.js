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
    //disable default page zooming(2 fingers), but doesn't disable scrolling(1 finger)
    if(state.id === 'view' && this.multiTouch === true) e.preventDefault();

    //one touch occured and it was on canvas
    //TODO: have a buffer on how much a finger needs to move before
    //we start drawing. Otherwise any slight finger movement immediately
    //results in the pixel being drawn
    if(this.multiTouch === false && state.id === 'editor') {
      currTouch.setTouchPos(e, 0, state);
      currTouch.handleMoving(state);
    }
    else if (this.multiTouch === true && this.touchList.length > 1) {
      this.handleMultiTouch(e, state);
    }
  }

  UpEvent(e, state) {
    if(state.id === 'editor') e.preventDefault();

    let currTouchIndex = this.findTouchIndex(e.changedTouches[0].identifier);
    let currTouch = this.touchList[currTouchIndex];

    //if only 1 touch ever occurred and it was on the canvas element
    if(this.multiTouch === false && state.id === 'editor') {
      currTouch.setTouchPos(e, 0, state);
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

  handleMultiTouch(e, state) {
    let oldT0 = {
      x: this.touchList[0].x,
      y: this.touchList[0].y
    };
    let oldT1 = {
      x: this.touchList[1].x,
      y: this.touchList[1].y
    };

    //update value for touches that changed position
    for(let i = 0; i < e.changedTouches.length; i++) {
      let currTouchIndex = this.findTouchIndex(e.changedTouches[i].identifier);
      this.touchList[currTouchIndex].setTouchPos(e, i);
    }

    let newT0 = {
      x: this.touchList[0].x,
      y: this.touchList[0].y
    };
    let newT1 = {
      x: this.touchList[1].x,
      y: this.touchList[1].y
    };

    //distance between the two first touches
    let oldDistance = Math.sqrt(Math.pow(oldT0.x - oldT1.x, 2) + Math.pow(oldT0.y - oldT1.y, 2));
    let newDistance = Math.sqrt(Math.pow(newT0.x - newT1.x, 2) + Math.pow(newT0.y - newT1.y, 2));

    //displacement of each individual touch
    let t0Displacement = Math.sqrt(Math.pow(newT0.x - oldT0.x, 2) + Math.pow(newT0.y - oldT0.y, 2));
    let t1Displacement = Math.sqrt(Math.pow(newT1.x - oldT1.x, 2) + Math.pow(newT1.y - oldT1.y, 2));

    //average the position of the two touches in new position and old position
    //then determine the direction of that movement by a vector
    let direction = {
      x: (newT0.x + newT1.x)/2 - (oldT0.x + oldT1.x)/2,
      y: (newT0.y + newT1.y)/2 - (oldT0.y + oldT1.y)/2
    }

    let grid = null;
    if(state.id === "editor") {
      grid = state;
    }
    else if (state.id === "view") {
      grid = state.child;
    }

    //TODO: Correctly handle threshhold between zoom and pan based on device
    if(grid !== null) {
      //fingers have moved x units apart
      if(Math.abs(newDistance - oldDistance) > 10) {
        this.ZoomEvent(grid, oldDistance, newDistance);
      }
      //either finger has moved x units from original position 
      // but the two fingers have not moved x units apart
      else if((t0Displacement > 10 || t1Displacement > 10) && Math.abs(newDistance - oldDistance) <= 10) {
        this.PanEvent(grid, direction);
      }
      else {
        //restore old vals if change in distance isn't enough to trigger
        this.touchList[0].x = oldT0.x;
        this.touchList[0].y = oldT0.y;
        this.touchList[1].x = oldT1.x;
        this.touchList[1].y = oldT1.y;
      }
    }
  }
  
  ZoomEvent(grid, oldDistance, newDistance) {
    let pixelSize = grid.pixels[0].w;
    if(newDistance - oldDistance > 0) { //positive change, zooming in 
      pixelSize += 1;
    }
    else if(newDistance - oldDistance < 0 && pixelSize > 4) { //negative change, zooming out
      pixelSize -= 1;
    }

    let oldWidth = grid.canvas.width;
    let oldHeight = grid.canvas.height;
    grid.canvas.width = grid.pWidth * pixelSize + 1;
    grid.canvas.height = grid.pHeight * pixelSize + 1;
    grid.ctx.clearRect( 0, 0, grid.canvas.width, grid.canvas.height);

    //if grid no longer centered
    if(!(grid.canvas.style.top === "" && grid.canvas.style.left === "")) {
      let topVal = parseInt(grid.canvas.style.top, 10);
      let leftVal = parseInt(grid.canvas.style.left, 10);
      grid.canvas.style.top = (topVal + (oldHeight - grid.canvas.height)/2) + "px";
      grid.canvas.style.left = (leftVal + (oldWidth - grid.canvas.width)/2) + "px";
    }

    grid.resizeGrid(null, pixelSize);
  }

  PanEvent(grid, direction) {
    let boundingRect = grid.canvas.getBoundingClientRect();
    let topVal = boundingRect.top;
    let leftVal = boundingRect.left;
    if(grid.canvas.style.top !== "") {
      topVal = parseInt(grid.canvas.style.top, 10);
    }
    if(grid.canvas.style.left !== "") {
      leftVal = parseInt(grid.canvas.style.left, 10);
    }
    grid.canvas.style.top = (topVal + direction.y) + "px";
    grid.canvas.style.left = (leftVal + direction.x) + "px";
  }
};

export default TouchHandler;
