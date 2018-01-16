import {sendAllPixels, sendSinglePixel} from './socketFunctions.js';

const preventDefaultFunction = function(e) {
  e.preventDefault();
  return false;
};

const mouseDownEvent = function(e, state) {
  //when mouse clicks down on our canvas grid:
  //determine which pixel it has touched.
  var mouse = state.getMouse(e);
  state.dragging = true;

  //mouse.x,mouse.y now give us our position, now loop through
  //our pixels until the one that contains the mouse is found
  for(var i = 0; i < state.pixels.length; i++) {
    if(state.pixels[i].contains(mouse.x, mouse.y) && state.pixels[i].fill !== state.activeColor) {
      var selection = state.pixels[i];
      state.render = true;

      selection.fill = state.activeColor;
      state.draw();
      sendSinglePixel(selection, i, state.socket);

      //once the active pixel is found, no need to loop
      //through the rest of the for loop
      break;
    }
  }
};

const mouseUpEvent = function(e, state) {
  state.dragging = false;
};

const mouseMoveEvent = function(e, state) {
  var mouse = state.getMouse(e);

  for(var i = 0; i < state.pixels.length; i++) {
    if(state.pixels[i].contains(mouse.x, mouse.y)) {
      state.render = true;
      var selection = state.pixels[i];

      if(!state.dragging) {
        state.draw();
        //add highlight on top of the current pixel
        selection.drawHighlight(state.ctx);
      }
      else if(state.dragging && selection.fill !== state.activeColor){
        selection.fill = state.activeColor;
        state.draw();
        sendSinglePixel(selection, i, state.socket);
      }

      break;
    }
  }
};

const mouseLeaveEvent = function(e, state) {
  //essentially redraw the canvas without drawing the highlight
  state.render = true;
  state.draw();
};

export {preventDefaultFunction, mouseDownEvent, mouseUpEvent, mouseMoveEvent, mouseLeaveEvent};
