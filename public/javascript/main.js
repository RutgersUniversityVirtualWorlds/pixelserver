//basic pixel constructor
function Pixel(x,y, fill) {
  this.x = x || 0;
  this.y = y || 0;
  this.w = 1;
  this.h = 1;
  this.fill = fill || '#AAAAAA';
}

//draw pixel to ctx
Pixel.prototype.draw = function(ctx) {
  ctx.fillStyle = this.fill;
  ctx.fillRect(this.x, this.y, this.w, this.h);
}


function CanvasState(canvas) {
  //setup
  this.canvas = canvas;
  this.width = canvas.width;
  this.height = canvas.height;
  this.ctx = canvas.getContext('2d');
}

function init() {
  var grid = new CanvasState(document.getElementById('editor'));
}
