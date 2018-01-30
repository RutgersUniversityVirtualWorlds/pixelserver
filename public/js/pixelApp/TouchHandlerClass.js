import Pointer from './PointerClass.js';

class TouchHandler extends Pointer {
  constructor(type, x, y) {
    super(type, x, y);

    this.touchList = [];
    this.multiTouch = false;
  }

  Handler(e, state) {
    e.preventDefault();

    //add just ONE event trigger when canvas or viewWrapper is touched
    //otherwise results in duplicate calls due to overlapping of elements
    if((state.id === 'editor' && e.target.id === state.id) || 
    (state.id === 'view' && e.target.id === state.id)) {
      if(e.type === 'touchstart') {
          //push the last touch into the list
          this.touchList.push(e.touches[this.touchList.length]);

          if(this.touchList.length > 1) this.multiTouch = true;

          this.DownEvent(e, state);
      }
      else if(e.type == 'touchmove') {
        this.MoveEvent(e, state);
      }
      else if(e.type == 'touchend') {
        this.UpEvent(e, state);
      }
    }
  }

  DownEvent(e, state) {
    //only 1 touch in entirety of contact and on canvas element
    if(this.multiTouch === false && state.id === 'editor') {
      state.dragging = true;
    }
    if(this.multiTouch === true) {
      state.dragging = false;
    }
  }

  MoveEvent(e, state) {
    let touch = state.getTouchData(e);
    this.x = touch.x;
    this.y = touch.y;
    this.handleMoving(state);
  }

  UpEvent(e, state) {
    //remove released finger from touchList
    for(let i = 0; i < this.touchList.length; i++) {
      if(this.touchList[i].identifier === e.changedTouches[0].identifier) {
        this.touchList.splice(i, 1);
      }
    }

    //if only 1 touch ever occurred and it was on the canvas element
    if(this.multiTouch === false && state.id === 'editor') {
      this.colorPixel(state);
      state.dragging = false;
    }
    else if(this.multiTouch === true) {
      //if had removed the last finger
      if(this.touchList.length === 0) {
        this.multiTouch = false;
      }
    }
  }

  ZoomEvent(e, state) {

  }

  PanEvent(e, state) {

  }
};

export default TouchHandler;
