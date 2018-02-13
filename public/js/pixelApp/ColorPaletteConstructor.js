const ColorPalette = function(paletteElement, canvas, titleElement) {
  /******* setup **********/
  let state = this;
  this.palette = paletteElement;
  this.title = titleElement;
  this.id = this.palette.id;
  this.canvas = canvas;

  this.colors = [];
  this.activeElement = null;
  this.editElement = null;
  this.editing = false;
  this.activeColor = this.canvas.activeColor;

  this.setInitialValues(this.palette);

  for(let i = 0; i < this.colors.length; i++) {
    this.colors[i].addEventListener('mouseup', function(e) { 
      state.colorClickedEvent(state.colors[i], state);
    });
  }

  this.editElement.addEventListener('mouseup', function(e) { state.editColorsEvent(); });
};

ColorPalette.prototype.setInitialValues = function(palette) {
  for(let i = 0; i < palette.children.length; i++) {
    let elem = palette.children[i];
    if(elem.classList.contains('color')){
      this.colors.push(elem);
      if(elem.classList.contains('active')) {
        this.activeElement = elem; 
        this.setActiveColor(elem);
      }
    }
    else if(elem.classList.contains('select')) {
      this.editElement = elem;
    }
  }
};

ColorPalette.prototype.setActiveColor = function(elem) {
  //set active color for canvas element
  let rgb = getComputedStyle(elem).getPropertyValue('background-color')
  let extraction = rgb.match(/\d+/g); //get digits within string
  for(let i = 0; i < extraction.length; i++) {
    this.activeColor[i] = parseInt(extraction[i], 10);
  }

  //want to also set bg color of title bar
  let colorClass = null;
  for(let i = 0; i < elem.classList.length; i++) {
    if(elem.classList.item(i).match(/(color-)\d+/)) {
      colorClass = elem.classList.item(i);
    }
  }
  if(colorClass !== null) {
    this.title.className = "";
    if(this.activeColor[0] > 221 && this.activeColor[1] > 221 && this.activeColor[2] > 221) {
      this.title.classList.add('blackTextAndBorder');
    }
    else this.title.classList.add('whiteText');
    this.title.classList.add(colorClass);
  }
};

ColorPalette.prototype.colorClickedEvent = function(selected, state) {
  let elem = selected;
  state.setActiveColor(elem);

  //set the active Element
  state.activeElement.classList.remove('active');
  state.activeElement = elem;
  state.activeElement.classList.add('active');
};

ColorPalette.prototype.editColorsEvent = function() {
  //when edit button clicked, darken screen and display a pop-up modal
  let overlay = document.getElementById("overlay");
  overlay.style.display = "inline";
  this.editing = true;
};
export default ColorPalette;
