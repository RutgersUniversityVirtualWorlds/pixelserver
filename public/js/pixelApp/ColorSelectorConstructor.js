const ColorSelector = function(selectorWrapper) {
  /******* setup **********/
  let state = this;
  this.wrapper = selectorWrapper;
  this.id = this.wrapper.id;
  
  this.colors = [];
  this.activeColor = new Array(3);
  this.activeElement = null;
  this.displayDiv = document.getElementById("colorResult");

  this.colorPalette = document.getElementById("colorPaletteEdit");
  this.setInitialValues(this.colorPalette);

  for(let i = 0; i < this.colors.length; i++) {
    this.colors[i].addEventListener('mouseup', function(e) {
      state.colorClickedEvent(state.colors[i], state);
    });
  }
  
};

ColorSelector.prototype.setInitialValues = function(palette) {
  for(let i = 0; i < palette.children.length; i++) {
    let elem = palette.children[i];
    if(elem.classList.contains('color')) {
      this.colors.push(elem);
      if(elem.classList.contains('active')) {
        this.activeElement = elem;
        let rgb = getComputedStyle(elem).getPropertyValue('background-color');
        this.displayDiv.style.backgroundColor = rgb;

        let extraction = rgb.match(/\d+/g);
        for(let i = 0; i < extraction.length; i++) {
          this.activeColor[i] = parseInt(extraction[i], 10);
        }
      }
    }
  }
};

ColorSelector.prototype.colorClickedEvent = function(selected, state) {
  let elem = selected;
  
  state.activeElement.classList.remove('active');
  state.activeElement = elem;
  state.activeElement.classList.add('active');
  
  let rgb = getComputedStyle(elem).getPropertyValue('background-color');
  state.displayDiv.style.backgroundColor = rgb;

  let extraction = rgb.match(/\d+/g);
  for(let i = 0; i < extraction.length; i++) {
    state.activeColor[i] = parseInt(extraction[i], 10);
  }
};

export default ColorSelector;
