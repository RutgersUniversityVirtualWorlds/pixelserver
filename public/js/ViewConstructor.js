import {touchHandler} from './touchEvents.js';

const View = function(canvasWrapper, canvas, touches) {
  /******* setup **********/
  this.view = canvasWrapper;
  this.id = this.view.id;
  this.child = canvas;

  this.touches = touches;

  /****** Events *****/
  var state = this;

  /******* Touch Events *******/
  //Here need to handle touch events for pinch/zoom the canvas and two-finger drag
  this.view.addEventListener('touchstart', function(e) {touchHandler(e, state);});
  this.view.addEventListener('touchend', function(e) {touchHandler(e, state);});
};

export default View;
