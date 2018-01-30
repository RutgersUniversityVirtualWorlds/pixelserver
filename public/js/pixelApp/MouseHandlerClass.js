import Pointer from './PointerClass.js';

class MouseHandler extends Pointer {
  DownEvent(e, state) {
    state.dragging = true;
  }

  MoveEvent(e, state) {
    let mouse = state.getMouseData(e);
    this.x = mouse.x;
    this.y = mouse.y;

    this.handleMoving(state);
  }


  UpEvent(e, state) {
    //when mouse clicks up on our canvas grid:
    //determine which pixel it had touched.
    let mouse = state.getMouseData(e);
    this.x = mouse.x;
    this.y = mouse.y;

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
