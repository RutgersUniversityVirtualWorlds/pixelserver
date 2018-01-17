import io from 'socket.io-client';
import Pixel from './PixelConstructor.js';
import CanvasState from './CanvasStateConstructor.js';

var pxl = {};

//Set up socket client connection
pxl.socket = io();
pxl.socket.on('connect', function() {
  pxl.socket.emit('identifier', {type: 'web-client'});
});

//initialize a new Canvas object to draw on
pxl.grid = new CanvasState(document.getElementById('editor'), pxl.socket);

/****** Handle socket communication *****/
function setUpGrid(grid, dimmensions, colors) {
  for(var i = 0; i < dimmensions.height; i++) { //rows (height)
    for(var j = 0; j < dimmensions.width; j++) { //columns (width)
      var tempPixelInstance = new Pixel(j*20, i*20, 20, 20, colors[i*dimmensions.width + j]);
      grid.pixels.push(tempPixelInstance);
    }
  }
  grid.render = true;
  grid.draw();
}

function updateGrid(grid, colors) {
  //traversing all the pixels
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

pxl.socket.on('boardConnect', function(data) {
  pxl.grid.canvas.width = data.dimmensions.width * 20 + 1;
  pxl.grid.canvas.height = data.dimmensions.height * 20 + 1;
  pxl.grid.ctx.clearRect( 0, 0, pxl.grid.ctx.canvas.width, pxl.grid.ctx.canvas.height);

  setUpGrid(pxl.grid, data.dimmensions, data.boardState);
});

pxl.socket.on('boardUpdate', function(data) {
  updateGrid(pxl.grid, data.boardState);
});

pxl.socket.on('boardDisconnect', function() {
  clearGrid(pxl.grid);
});
