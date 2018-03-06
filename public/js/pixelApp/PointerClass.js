class Pointer {
  constructor(type, x, y) {
    this.type = type;
    this.x = x;
    this.y = y; 
  }
  
  colorPixel(state) {
    for(let i = 0; i < state.pixels.length; i++) {
      if(state.pixels[i].contains(this.x, this.y)) {
        let selection = state.pixels[i];

        if(!selection.fillEquals(state.activeColor)) {
          //need to pass primitive values, otherwise make a reference to state object fill color
          selection.setFill(state.activeColor);
          state.render = true;
          state.draw();
          state.socket.sendSinglePixel(selection, i);
        }
        break;
      }
    }
  }

  handleMoving(state) {
    for(let i = 0; i < state.pixels.length; i++) {
      if(state.pixels[i].contains(this.x, this.y)) {
        let selection = state.pixels[i];

        if(!state.dragging && this.type === 'mouse') { //would only happen when pointer is a mouse
          //pixel highlighted only once while mouse moving within its bounds
          if(state.highlighted !== selection) {
            state.render = true;
            state.draw();
            //add highlight on top of the current pixel
            selection.drawHighlight(state.ctx);
            state.highlighted = selection;
          }
        }
        else if(state.dragging && !selection.fillEquals(state.activeColor)) { 
          selection.setFill(state.activeColor);
          state.render = true;
          state.draw();
          state.socket.sendSinglePixel(selection, i);
        }
        break;
      }
    }
  }
};

export default Pointer;
