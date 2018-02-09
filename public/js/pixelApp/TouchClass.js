import Pointer from './PointerClass.js';

class Touch extends Pointer {
  constructor(object, type) {
    super(type, object.pageX, object.pageY);
    this.object = object;
  }

  setTouchPos(e, index, state = null) {
    let offset = {
      x: 0,
      y: 0
    };

    //handle element offset solely for drawing on the canvas actions
    //state should be null when dealing with zooming/panning
    if(state !== null) {
      offset = state.getOffset(state.canvas);
    }

    this.x = e.changedTouches[index].pageX - offset.x;
    this.y = e.changedTouches[index].pageY - offset.y;
  }
};

export default Touch;
