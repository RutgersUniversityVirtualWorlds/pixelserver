//when no dragging involved, mouseclick events are registered as well
//meaning that for now, only really have to worry about touch control dragging
function touchDownEvent(e, state) {
  state.dragging = true;
}

function touchUpEvent(e, state) {
  state.dragging = false;
}

function touchMoveEvent(e, state) {
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
}
