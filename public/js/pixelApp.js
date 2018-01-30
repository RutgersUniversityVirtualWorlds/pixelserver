import SocketState from './pixelApp/SocketStateConstructor.js';
import TouchHandler from './pixelApp/TouchHandlerClass.js';
import MouseHandler from './pixelApp/MouseHandlerClass.js';
import CanvasState from './pixelApp/CanvasStateConstructor.js';
import ViewState from './pixelApp/ViewStateConstructor.js';

let pxl = {};

pxl.comm = new SocketState();
pxl.touches = new TouchHandler("touch", 0, 0);
pxl.mouse = new MouseHandler("mouse", 0, 0);
pxl.grid = new CanvasState(document.getElementById('editor'), pxl.comm, pxl.touches, pxl.mouse);
pxl.view = new ViewState(document.getElementById('view'), pxl.grid, pxl.touches);
  

pxl.comm.socket.on('boardConnect', function(data) {
  pxl.grid.pWidth = data.dimmensions.width;
  pxl.grid.pHeight = data.dimmensions.height;

  let pixelSize = pxl.grid.resizeCanvasElement();
  pxl.grid.setUpGrid(data.dimmensions, pixelSize, data.boardState);
});

pxl.comm.socket.on('boardUpdate', function(data) {
  pxl.grid.updateGrid(data.boardState);
});

pxl.comm.socket.on('boardDisconnect', function() {
  pxl.grid.deleteGrid();
  //should have some sort of display for the user
});
