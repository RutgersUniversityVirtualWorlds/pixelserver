import Pointer from './PointerClass.js';

class Touch extends Pointer {
  constructor(object, type) {
    super(type, object.pageX, object.pageY);
    this.object = object;
    this.initX = object.pageX;
    this.initY = object.pageY;
  }

  setTouchPos(e, state) {
    let offset = state.getOffset(state.canvas);

    //https://developer.mozilla.org/en-US/docs/Web/API/Touch/pageX
    let tx = e.changedTouches[0].pageX - offset.x;
    let ty = e.changedTouches[0].pageY - offset.y;

    this.x = tx;
    this.y = ty;
  }
};

export default Touch;
