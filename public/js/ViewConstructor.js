
const View = function(canvasWrapper, canvas) {
  /******* setup **********/
  this.view = canvasWrapper;
  this.child = canvas;

  /****** Events *****/
  var state = this;

  /******* Touch Events *******/
  //Here need to handle touch events for pinch/zoom the canvas and two-finger drag
  //this.view.addEventListener('replaceme', function(e) { });
};

export default View;
