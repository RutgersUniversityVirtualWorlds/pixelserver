class Pointer {
  constructor(type, x, y) {
    this.type = type;
    this.x = x;
    this.y = y; 
  }

  colorPixel(state) {
    for(let i = 0; i < state.pixels.length; i++) {
      if(state.pixels[i].contains(this.x, this.y) && state.pixels[i].fill !== state.activeColor) {
        let selection = state.pixels[i];
        state.render = true;

        //need to pass primitive values, otherwise make a reference to state object fill color
        selection.setFill([state.activeColor[0], state.activeColor[1], state.activeColor[2]]);
        state.draw();
        state.socket.sendSinglePixel(selection, i);
        break;
      }
    }
  }

  handleMoving(state) {
    for(let i = 0; i < state.pixels.length; i++) {
      if(state.pixels[i].contains(this.x, this.y)) {
        state.render = true;
        let selection = state.pixels[i];

        if(!state.dragging && this.type === 'mouse') { //would only happen when pointer is a mouse
          state.draw();
          //add highlight on top of the current pixel
          selection.drawHighlight(state.ctx);
        }
        else if(state.dragging && selection.fill !== state.activeColor){
          selection.setFill([state.activeColor[0], state.activeColor[1], state.activeColor[2]]);
          state.draw();
          state.socket.sendSinglePixel(selection, i);
        }
        break;
      }
    }
  }
};

export default Pointer;
