//basic pixel constructor
function Pixel(x,y, w, h, fill) {
  this.x = x || 0;
  this.y = y || 0;
  this.w = w || 20;
  this.h = h || 20;
  this.fill = fill || '#AAAAAA';
}

//draw pixel to ctx
Pixel.prototype.draw = function(ctx) {
  ctx.fillStyle = this.fill;
  //seems to have overlapping issues where a single pixel selects two different boxes
  ctx.fillRect(this.x, this.y, this.w, this.h);
  //https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Applying_styles_and_colors
  ctx.strokeStyle = 'rgb(140,140,140)';
  ctx.strokeRect(this.x+0.5, this.y+0.5, this.w, this.h);
}

Pixel.prototype.drawHighlight = function(ctx) {
  ctx.fillStyle = 'rgba(200,200,200, .5)';
  ctx.fillRect(this.x + 1, this.y + 1, this.w - 1, this.h - 1);
}

//determine if mouse is currently within the bounds of the current pixel
Pixel.prototype.contains = function(mx,my) {
  if(mx >= this.x &&
    my >= this.y &&
    mx <= (this.x + this.w) &&
    my <= (this.y + this.h)) {
      return true;
  }
  else return false;
}
