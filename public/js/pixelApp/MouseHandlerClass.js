import Pointer from './PointerClass.js';

class MouseHandler extends Pointer {
  setMousePos(e, state) {
    let offset = state.getOffset(state.canvas);

    let mx = e.pageX - offset.x;
    let my = e.pageY - offset.y;
  
    this.x = mx;
    this.y = my;
  }

  DownEvent(e, state) {
    state.dragging = true;
  }

  MoveEvent(e, state) {
    this.setMousePos(e, state);
    this.handleMoving(state);
  }


  UpEvent(e, state) {
    //when mouse clicks up on our canvas grid:
    //determine which pixel it had touched.
    this.setMousePos(e, state);
    this.colorPixel(state);

    state.dragging = false;
  }

  LeaveEvent(e, state) {
    //essentially redraw the canvas without drawing the highlight
    state.render = true;
    state.draw();
  }
}

export default MouseHandler;
