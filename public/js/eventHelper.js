import {sendAllPixels, sendSinglePixel} from './socketFunctions.js';

//expects a pointer with x,y position, can be touch or mouse
const colorPixel = function(pointer, state) {
  //pointer.x, pointer.y now give us our position, now loop through
  //our pixels until the one that contains the pointer is found
  for(var i = 0; i < state.pixels.length; i++) {
    if(state.pixels[i].contains(pointer.x, pointer.y) && state.pixels[i].fill !== state.activeColor) {
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

const handleMoving = function(pointer, state) {
  for(var i = 0; i < state.pixels.length; i++) {
    if(state.pixels[i].contains(pointer.x, pointer.y)) {
      state.render = true;
      var selection = state.pixels[i];

      if(!state.dragging && pointer.type === 'mouse') { //would only happen when pointer is a mouse
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

export {colorPixel, handleMoving};
