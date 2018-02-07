import Pointer from './PointerClass.js';

class Touch extends Pointer {
  constructor(object, type) {
    super(type, object.pageX, object.pageY);
    this.object = object;
  }

  setTouchPos(e, state = null) {
    let offset = {
      x: 0,
      y: 0
    };

    //handle element offset if canvas was element passed
    //only use this to correctly handle offset for drawing within our grid
    if(state !== null) {
      offset = state.getOffset(state.canvas);
    }

    //https://developer.mozilla.org/en-US/docs/Web/API/Touch/pageX
    let tx = e.changedTouches[0].pageX - offset.x;
    let ty = e.changedTouches[0].pageY - offset.y;

    this.x = tx;
    this.y = ty;
  }
};

export default Touch;
