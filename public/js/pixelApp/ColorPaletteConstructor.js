const ColorPalette = function(paletteElement, canvas) {
  /******* setup **********/
  let state = this;
  this.palette = paletteElement;
  this.id = this.palette.id;
  this.canvas = canvas;

  this.colors = [];
  this.activeElement = null;
  this.activeColor = this.canvas.activeColor;
  this.setInitialValues(this.palette);

  for(let i = 0; i < this.colors.length; i++) {
    this.colors[i].addEventListener('mouseup', function(e) { state.clickedEvent(state.colors[i], state)});
  }
};

ColorPalette.prototype.setInitialValues = function(palette) {
  for(let i = 0; i < palette.children.length; i++) {
    let elem = palette.children[i];
    if(elem.classList.contains('color')){
      this.colors.push(elem);
      if(elem.classList.contains('active')) {
        this.activeElement = elem; 
        this.setActiveColor(getComputedStyle(elem).getPropertyValue('background-color'));
      }
    }
  }
};

ColorPalette.prototype.clickedEvent = function(selected, state) {
      let elem = selected;
      state.setActiveColor(getComputedStyle(elem).getPropertyValue('background-color'));

      //set the active Element
      //1. remove active class from old active element
      state.activeElement.classList.remove('active');
      //2. add active class to newest active element
      state.activeElement = elem;
      state.activeElement.classList.add('active');
};

ColorPalette.prototype.setActiveColor = function(rgb) {
  let extraction = rgb.match(/\d+/g); //get digits within string
  for(let i = 0; i < extraction.length; i++) {
    this.activeColor[i] = parseInt(extraction[i], 10);
  }
};

export default ColorPalette;
