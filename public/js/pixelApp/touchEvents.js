import {colorPixel, handleMoving} from './eventHelper.js';

const touchHandler = function(e, state) {
  e.preventDefault();

  //add just ONE event trigger when canvas or viewWrapper is touched
  //otherwise results in duplicate calls due to overlapping of elements
  if((state.id === 'editor' && e.target.id === state.id) || 
  (state.id === 'view' && e.target.id === state.id)) {
    if(e.type === 'touchstart') {
        //push the last touch into the list
        state.touches.touchList.push(e.touches[state.touches.touchList.length]);

        if(state.touches.touchList.length > 1) state.touches.multiTouch = true;

        touchDownEvent(e, state);
    }
    else if(e.type == 'touchmove') {
      touchMoveEvent(e, state);
    }
    else if(e.type == 'touchend') {
      touchUpEvent(e, state);
    }
  }
}

const touchDownEvent = function(e, state) {
  //only 1 touch in entirety of contact and on canvas element
  if(state.touches.multiTouch === false && state.id === 'editor') {
    state.dragging = true;
  }
  if(state.touches.multiTouch === true) {
    state.dragging = false;
  }
};

const touchMoveEvent = function(e, state) {
  var touch = state.getTouch(e);
  handleMoving(touch, state);
};

const touchUpEvent = function(e, state) {
  //remove released finger from touchList
  for(var i = 0; i < state.touches.touchList.length; i++) {
    if(state.touches.touchList[i].identifier === e.changedTouches[0].identifier) {
      state.touches.touchList.splice(i, 1);
    }
  }

  //if only 1 touch ever occurred and it was on the canvas element
  if(state.touches.multiTouch === false && state.id === 'editor') {
    colorPixel(state.getTouch(e), state);
    state.dragging = false;
  }
  else if(state.touches.multiTouch === true) {
    //if had removed the last finger
    if(state.touches.touchList.length === 0) {
      state.touches.multiTouch = false;
    }
  }
};

const touchZoomEvent = function(e, state) {

};

const touchPanEvent = function(e, state) {

};

export {touchHandler};
