import {sendAllPixels, sendSinglePixel} from './socketFunctions.js';

//when no dragging involved, mouseclick events are registered as well
//meaning that for now, only really have to worry about touch control dragging
const touchDownEvent = function(e, state) {
  state.dragging = true;
};

const touchUpEvent = function(e, state) {
  state.dragging = false;
};

const touchMoveEvent = function(e, state) {
  //When dragging inside canvas, want to disable the scrolling functionality.
  e.preventDefault();

  var touch = state.getTouch(e);
  for(var i = 0; i < state.pixels.length; i++) {
    if(state.pixels[i].contains(touch.x, touch.y)) {
      state.render = true;
      var selection = state.pixels[i];

      if(state.dragging && selection.fill !== state.activeColor){
        selection.fill = state.activeColor;
        state.draw();
        sendSinglePixel(selection, i, state.socket);
      }
      break;
    }
  }
};

export {touchDownEvent, touchUpEvent, touchMoveEvent};
