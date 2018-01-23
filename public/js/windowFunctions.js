//resize the canvas element based on the current dimmensions of the window
const resizeCanvasElement = function(e, grid) {
  //1) get the dimmensions of the window and subtract desired padding
  var winWidth = window.innerWidth - (window.innerWidth * .1);
  var winHeight = window.innerHeight - (window.innerHeight * .1)

  //2) divide dimmensions by dimmensions of pixels
  var widthProportion = Math.floor(winWidth/grid.pWidth);
  var heightProportion = Math.floor(winHeight/grid.pHeight);
  
  //3) floor the results and lowest one determines initial size of canvas
  var pixelSize = Math.min(widthProportion, heightProportion);

  //set new dimmensions of canvas element
  grid.canvas.width = grid.pWidth * pixelSize + 1;
  grid.canvas.height = grid.pHeight * pixelSize + 1;
  grid.ctx.clearRect( 0, 0, grid.canvas.width, grid.canvas.height);

  return pixelSize;
};

//set the new size for all the pixels, so grid drawn on canvas element is the right size
const resizeGrid = function(e, grid) {
    var pixelSize = resizeCanvasElement(e, grid);
    //have to somehow reset the value of a pixel
    for(var i = 0; i < grid.pHeight; i++) {
      for(var j = 0; j < grid.pWidth; j++) {
        grid.pixels[i*grid.pWidth+j].updatePixelSize(j*pixelSize, i*pixelSize, pixelSize, pixelSize);
      }
    }
    grid.render = true;
    grid.draw();
};

export {resizeCanvasElement, resizeGrid};
