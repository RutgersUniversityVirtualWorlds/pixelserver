import io from 'socket.io-client';
import Pixel from './PixelConstructor.js';
import CanvasState from './CanvasStateConstructor.js';
import View from './ViewConstructor.js';
import {resizeCanvasElement} from './windowFunctions.js';

var pxl = {};

  //Set up socket client connection
  pxl.socket = io();
  pxl.socket.on('connect', function() {
    pxl.socket.emit('identifier', {type: 'web-client'});
  });

  pxl.touches = {touchList: [], multiTouch: false}; //by passing an object, make a global reference
  pxl.grid = new CanvasState(document.getElementById('editor'), pxl.socket, pxl.touches);
  pxl.view = new View(document.getElementById('view'), pxl.grid, pxl.touches);
  
/********** SOCKET HANDLING ******/

pxl.socket.on('boardConnect', function(data) {
  pxl.grid.pWidth = data.dimmensions.width;
  pxl.grid.pHeight = data.dimmensions.height;

  var pixelSize = resizeCanvasElement(null, pxl.grid);
  setUpGrid(pxl.grid, data.dimmensions, pixelSize, data.boardState);
});

pxl.socket.on('boardUpdate', function(data) {
  updateGrid(pxl.grid, data.boardState);
});

pxl.socket.on('boardDisconnect', function() {
  clearGrid(pxl.grid);
  //should have some sort of display for the user
});

/****** HELPER FUNCTIONS *****/
function setUpGrid(grid, dimmensions, pixelSize, colors) {
  for(var i = 0; i < dimmensions.height; i++) { //rows (height)
    for(var j = 0; j < dimmensions.width; j++) { //columns (width)
      var tempPixelInstance = new Pixel(j*pixelSize, i*pixelSize, pixelSize, pixelSize, colors[i*dimmensions.width + j]);
      grid.pixels.push(tempPixelInstance);
    }
  }
  grid.render = true;
  grid.draw();
}

function updateGrid(grid, colors) {
  for(var i = 0; i < grid.pixels.length; i++) {
    grid.pixels[i].fill = colors[i];
  }
  grid.render = true;
  grid.draw();
}

function clearGrid(grid) {
  for(var i = grid.pixels.length; i > 0; i--) {
    grid.pixels.pop();
  }
  grid.render = true;
  grid.draw();
}
