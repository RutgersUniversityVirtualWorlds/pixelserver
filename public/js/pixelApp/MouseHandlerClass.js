import Pointer from './PointerClass.js';

class MouseHandler extends Pointer {
  setMousePos(e, state) {
    let offset = state.getOffset(state.canvas);

    this.x = e.pageX - offset.x;
    this.y = e.pageY - offset.y;
  }

  DownEvent(e, state) {
    state.dragging = true;
  }

  MoveEvent(e, state) {
    this.setMousePos(e, state);
    this.handleMoving(state);
  }


  UpEvent(e, state) {
    if(e.target.id === "editor") {
      this.setMousePos(e, state);
      this.colorPixel(state);
    }
    state.dragging = false;
  }

  LeaveEvent(e, state) {
    //essentially redraw the canvas without drawing the highlight
    //also establish that no pixel is currently highlighted
    state.highlighted = null;
    state.render = true;
    state.draw();
  }
}

export default MouseHandler;
