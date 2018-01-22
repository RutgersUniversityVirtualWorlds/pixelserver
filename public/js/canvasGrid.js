import io from 'socket.io-client';
import Pixel from './PixelConstructor.js';
import CanvasState from './CanvasStateConstructor.js';
import {resizeCanvasElement} from './windowFunctions.js';

var pxl = {};

//Set up socket client connection
pxl.socket = io();
pxl.socket.on('connect', function() {
  pxl.socket.emit('identifier', {type: 'web-client'});
});

//initialize a new Canvas object to draw on
pxl.grid = new CanvasState(document.getElementById('editor'), pxl.socket);
//while there is no grid should have some sort of default display indicating no canvas active

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
