import {colorPixel, handleMoving} from './eventHelper.js';

const mouseDownEvent = function(e, state) {
  state.dragging = true;
};

const mouseMoveEvent = function(e, state) {
  var mouse = state.getMouse(e);
  handleMoving(mouse, state);
};


const mouseUpEvent = function(e, state) {
  //when mouse clicks up on our canvas grid:
  //determine which pixel it had touched.
  var mouse = state.getMouse(e);
  colorPixel(mouse, state);

  state.dragging = false;
};

const mouseLeaveEvent = function(e, state) {
  //essentially redraw the canvas without drawing the highlight
  state.render = true;
  state.draw();
};

export {mouseDownEvent, mouseMoveEvent, mouseUpEvent, mouseLeaveEvent};
