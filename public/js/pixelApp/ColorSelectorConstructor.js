const ColorSelector = function(selectorWrapper, palette) {
  /******* Setup **********/
  let state = this;
  this.paletteParent = palette;
 
  this.originalColors = []; 
  this.colors = [];

  this.activeElement = null;
  this.activeColor = new Array(3);

  this.displayDiv = document.getElementById("colorResult");
  this.rgbInput = document.getElementById("rgbInput");
  this.hexInput = document.getElementById("hexInput");
  this.rRange = document.getElementById("redRange");
  this.gRange = document.getElementById("greenRange");
  this.bRange = document.getElementById("blueRange");
  this.rInput = document.getElementById("rInput");
  this.gInput = document.getElementById("gInput");
  this.bInput = document.getElementById("bInput");

  this.overlay = document.getElementById("overlay");
  this.exit = document.getElementById("exitModal");
  this.cancelButton = document.getElementById("cancelButton");
  this.applyButton = document.getElementById("applyButton");

  this.colorPalette = document.getElementById("colorPaletteEdit");
  this.setInitialValues(this.paletteParent, this.colorPalette);

  /******* Event Listeners ********/
  this.overlay.addEventListener('mouseup', function(e) { state.removeOverlay(state.overlay, e); });
  document.addEventListener('keypress', function(e) { state.removeOverlay(state.overlay, e); });
  this.exit.addEventListener('mouseup', function(e) { state.removeOverlay(state.overlay, e); });

  for(let i = 0; i < this.colors.length; i++) {
    this.colors[i].addEventListener('mouseup', function(e) {
      state.colorClickedEvent(state.colors[i], state);
    });
  }

  this.rRange.addEventListener('mouseup', function(e) { state.updateChannel(state.rRange.value, 0); });
  this.rRange.addEventListener('touchend', function(e) { state.updateChannel(state.rRange.value, 0); });
  this.gRange.addEventListener('mouseup', function(e) { state.updateChannel(state.gRange.value, 1); });
  this.gRange.addEventListener('touchend', function(e) { state.updateChannel(state.gRange.value, 1); });
  this.bRange.addEventListener('mouseup', function(e) { state.updateChannel(state.bRange.value, 2); });
  this.bRange.addEventListener('touchend', function(e) { state.updateChannel(state.bRange.value, 2); });

  this.rInput.addEventListener('blur', function(e) { state.updateChannel(state.rInput.value, 0); });
  this.gInput.addEventListener('blur', function(e) { state.updateChannel(state.gInput.value, 1); });
  this.bInput.addEventListener('blur', function(e) { state.updateChannel(state.bInput.value, 2); });

  this.rgbInput.addEventListener('blur', function(e) { state.updateColor(state.rgbInput.value, 'rgb'); });
  this.hexInput.addEventListener('blur', function(e) { state.updateColor(state.hexInput.value, 'hex'); });

  this.cancelButton.addEventListener('mouseup', function(e) { state.removeOverlay(state.overlay, e);});
  this.applyButton.addEventListener('mouseup', function(e) { state.applyChanges(state.overlay, e); });
};

ColorSelector.prototype.removeOverlay = function(overlay, e = null) {
  if(e !== null) {
    //TODO: handle events without need of target identification
    if(e.key === 'Escape' || e.target.id === 'modalWrapper' || e.target.id === 'exitModal' 
    || e.target.id === 'cancelButton' || e.target.id === 'applyButton') {
      overlay.style.display = "none";
      //if not applying changes, reset everything
      if(e.target.id !== 'applyButton') {
        for(let i = 0; i < this.colors.length; i++) {
          this.colors[i].style.backgroundColor = this.originalColors[i];
          //reset the view, range, rgb, hex values in modal
          if(this.colors[i].classList.contains('active')) this.syncElements(this.originalColors[i]);
        }
      }
    }
  }
};

//called everytime editModal is opened
ColorSelector.prototype.setInitialValues = function(parentState, editPalette) {
  this.originalColors = [];
  this.colors = [];

  let j = 0;
  for(let i = 0; i < parentState.palette.children.length; i++) {
    let elem = parentState.palette.children[i];
    if(elem.classList.contains('color')) {
      let rgb = getComputedStyle(elem).getPropertyValue('background-color');
      this.originalColors.push(rgb);

      this.colors.push(editPalette.children[j]);
      editPalette.children[j].style.backgroundColor = rgb;
      editPalette.children[j].classList.remove('active');

      if(elem.classList.contains('active')) {
        this.activeElement = editPalette.children[j];
        this.activeElement.classList.add('active');
        this.syncElements(rgb);
      }

      j = j + 1;
    }
  }
};

ColorSelector.prototype.colorClickedEvent = function(selected, state) {
  let elem = selected;
  
  state.activeElement.classList.remove('active');
  state.activeElement = elem;
  state.activeElement.classList.add('active');
  
  let rgb = getComputedStyle(elem).getPropertyValue('background-color');
  this.syncElements(rgb);
};

//for when color changes in a single channel(R, G, or B)
ColorSelector.prototype.updateChannel = function(colorValue, index) {
  if(!isNaN(colorValue)) {
    if(colorValue < 0) {
      this.activeColor[index] = 0;
    }
    else if(colorValue > 255) {
      this.activeColor[index] = 255;
    }
    else {
      this.activeColor[index] = Math.round(colorValue);
    }
  }
  let rgb = "rgb(" + this.activeColor.join(", ") + ")"
  this.syncElements(rgb);  
};

ColorSelector.prototype.updateColor = function(colorValue, type) {
  if(type === 'rgb') {
    //ensure in the right format
    let content = colorValue.match(/^rgb\(\s*\d+,\s*\d+,\s*\d+\)$/i);
    if(content !== null) {
      let extraction = colorValue.match(/\d+/g);
      for(let i = 0; i < extraction.length; i++) {
        if(extraction[i] < 0) {
          this.activeColor[i] = 0;
        }
        else if(extraction[i] > 255) {
          this.activeColor[i] = 255;
        }
        else {
          this.activeColor[i] = Math.round(extraction[i]);
        }
      }
    }
  }
  else {
    let content = colorValue.match(/#?[\da-f]{6}/i);
    if(content !== null) {
      let colors = colorValue.replace(/#*/, "");
      let extraction = [];
      extraction.push(parseInt(colors.substring(0,2), 16));
      extraction.push(parseInt(colors.substring(2,4), 16));
      extraction.push(parseInt(colors.substring(4,6), 16));
      for(let i = 0; i < extraction.length; i++) {
        if(extraction[i] < 0) {
          this.activeColor[i] = 0;
        }
        else if(extraction[i] > 255) {
          this.activeColor[i] = 255;
        }
        else {
          this.activeColor[i] = Math.round(extraction[i]);
        }
      }
    }
  }
  let rgb = "rgb(" + this.activeColor.join(", ") + ")"
  this.syncElements(rgb);  
};

ColorSelector.prototype.syncElements = function(rgb) {
  this.activeElement.style.backgroundColor = rgb;
  this.displayDiv.style.backgroundColor = rgb; 
  this.rgbInput.value = rgb; 

  let extraction = rgb.match(/\d+/g);
  for(let i = 0; i < extraction.length; i++) {
    this.activeColor[i] = parseInt(extraction[i], 10);
  }

  this.hexInput.value = this.handleHex(this.activeColor);
  this.handleRangeGradients(this.activeColor);

  this.rInput.value = this.activeColor[0];
  this.gInput.value = this.activeColor[1];
  this.bInput.value = this.activeColor[2];
};

ColorSelector.prototype.handleHex = function(activeColor) {
  let hexVal = "#";
  for(let i = 0; i < activeColor.length; i++) {
    let tempVal = activeColor[i].toString(16);
    if(tempVal.length < 2) {
      tempVal = "0" + tempVal;
    }
    hexVal += tempVal;
  }
  return hexVal;
};

ColorSelector.prototype.handleRangeGradients = function(color) {
  let base = "rgb(0, " + color[1] + ", " + color[2] + ")";
  let end = "rgb(255, " + color[1] + ", " + color[2] + ")";
  this.rRange.style.background = "linear-gradient(90deg, " + base + ", " + end + ")";
  this.rRange.value = color[0];

  base = "rgb(" + color[0] + ", 0, " + color[2] + ")";
  end = "rgb(" + color[0] + ", 255, " + color[2] + ")";
  this.gRange.style.background = "linear-gradient(90deg, " + base + ", " + end + ")";
  this.gRange.value = color[1];

  base = "rgb(" + color[0] + ", " + color[1] + ", 0)";
  end = "rgb(" + color[0] + ", " + color[1] + ", 255)";
  this.bRange.style.background = "linear-gradient(90deg, " + base + ", " + end + ")";
  this.bRange.value = color[2];
};

ColorSelector.prototype.applyChanges = function(overlay, e = null) {
  //apply new colors to original color palette
  for(let i = 0; i < this.paletteParent.colors.length; i++) {
    let currColor = this.paletteParent.colors[i];
    currColor.style.backgroundColor = this.colors[i].style.backgroundColor;
    if(this.colors[i].classList.contains('active')) {
      this.paletteParent.colorClickedEvent(currColor, this.paletteParent);
      this.paletteParent.setActiveColor(currColor);
    }
  }
  this.removeOverlay(overlay, e);
};

export default ColorSelector;
