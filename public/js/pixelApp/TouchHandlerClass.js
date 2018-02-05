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
    //handle zooming between first two touches
    
  }

  PanEvent(e, state) {

  }
};

export default TouchHandler;
