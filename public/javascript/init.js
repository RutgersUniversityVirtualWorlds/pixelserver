
function setUpGrid(grid, dimmensions, colors) {
  for(var i = 0; i < dimmensions.height; i++) { //rows (height)
    for (var j = 0; j < dimmensions.width; j++) { //columns (width)
      var hex = rgbToHEX(colors[i*dimmensions.height + j]);
      var tempPixelInstance = new Pixel(j*20, i*20, 20, 20, hex);
      grid.pixels.push(tempPixelInstance);
    }
  }
  grid.render = true;
  grid.draw();
}

function updateGrid(grid, colors) {
  //traversing all the pixels
  for(var i = 0; i < grid.pixels.length; i++) {
    var hex = rgbToHEX(colors[i]);
    grid.pixels[i].fill = hex;
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

function init(app, socket) {
  var grid = new CanvasState(document.getElementById('editor'));

  socket.on('boardConnect', function(data) {
    //app.width = data.dimmensions.width*20 + 1;
    //app.height = data.dimmensions.height*20 + 1;
    grid.canvas.width = data.dimmensions.width * 20 + 1;
    grid.canvas.height = data.dimmensions.height * 20 + 1;
    grid.ctx.clearRect( 0, 0, grid.ctx.canvas.width, grid.ctx.canvas.height);

    setUpGrid(grid, data.dimmensions, data.boardState);
  });
  socket.on('boardUpdate', function(data) {
    updateGrid(grid, data.boardState);
  });
  socket.on('boardDisconnect', function() {
    clearGrid(grid);
  });
}

init(app, socket);
