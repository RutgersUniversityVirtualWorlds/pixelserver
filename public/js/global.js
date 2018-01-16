import io from 'socket.io-client';

/*
Define the global data object that limits the scope of our entire front-end
code. Avoids using global namespace for our variables.
*/
var pxl = {};

/*
When DOM completes loading, have the following object:
pxl = {
  pxl.socket,
  pxl.grid
}
*/

pxl.socket = io();
pxl.socket.on('connect', function() {
  pxl.socket.emit('identifier', {type: 'web-client'});
});

export default pxl;
