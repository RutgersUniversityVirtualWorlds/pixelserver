//expects a pointer with x,y position, can be touch or mouse
const colorPixel = function(pointer, state) {
  //pointer.x, pointer.y now give us our position, now loop through
  //our pixels until the one that contains the pointer is found
  for(let i = 0; i < state.pixels.length; i++) {
    if(state.pixels[i].contains(pointer.x, pointer.y) && state.pixels[i].fill !== state.activeColor) {
      let selection = state.pixels[i];
      state.render = true;

      selection.fill = state.activeColor;
      state.draw();
      state.socket.sendSinglePixel(selection, i);

      break;
    }
  }
};

const handleMoving = function(pointer, state) {
  for(let i = 0; i < state.pixels.length; i++) {
    if(state.pixels[i].contains(pointer.x, pointer.y)) {
      state.render = true;
      let selection = state.pixels[i];

      if(!state.dragging && pointer.type === 'mouse') { //would only happen when pointer is a mouse
        state.draw();
        //add highlight on top of the current pixel
        selection.drawHighlight(state.ctx);
      }
      else if(state.dragging && selection.fill !== state.activeColor){
        selection.fill = state.activeColor;
        state.draw();
        state.socket.sendSinglePixel(selection, i);
      }
      break;
    }
  }
};

export {colorPixel, handleMoving};
