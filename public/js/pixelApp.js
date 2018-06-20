import SocketState from './pixelApp/SocketStateConstructor.js';
import WebSocketState from './pixelApp/WebSocketStateConstructor.js';
import TouchHandler from './pixelApp/TouchHandlerClass.js';
import MouseHandler from './pixelApp/MouseHandlerClass.js';
import CanvasState from './pixelApp/CanvasStateConstructor.js';
import ViewState from './pixelApp/ViewStateConstructor.js';
import ColorPalette from './pixelApp/ColorPaletteConstructor.js';

/*
let base_url = 'https://rugrid.mozilla-iot.org/things/http---192.168.33.132-3000/';
//let base_url = 'http://desktop-1cjceb2.local:3000/properties/on';
let jwt = 'YOUR.WEBTOKEN.HERE';
*/

let pxl = {};

pxl.comm = new SocketState();
//pxl.ws = new WebSocketState(jwt);
pxl.touches = new TouchHandler();
pxl.mouse = new MouseHandler("mouse", 0, 0);
pxl.grid = new CanvasState(document.getElementById('editor'), pxl.comm, pxl.touches, pxl.mouse);
pxl.view = new ViewState(document.getElementById('view'), pxl.grid, pxl.touches);
pxl.palette = new ColorPalette(document.getElementById('colorPalette'), pxl.grid, document.getElementById('appTitle'));

/*
let url = 'https://rugrid.mozilla-iot.org/things/http---192.168.33.132-3000/properties/on?jwt=' + jwt;
let auth = 'Bearer ' + jwt;
let headers = {
  Authorization: auth,
  Accept: 'application/json'
};

fetch(url, { headers: headers })
  .then(function(res) {
    console.log(res);
  });
*/

pxl.comm.socket.on('boardConnect', function(data) {
  let tempImg = document.getElementById('inactive_canvas');
  tempImg.classList.remove('active');
  tempImg.classList.add('inactive');

  pxl.grid.pWidth = data.dimmensions.width;
  pxl.grid.pHeight = data.dimmensions.height;

  let pixelSize = pxl.view.resizeCanvasElement();
  pxl.grid.setUpGrid(data.dimmensions, pixelSize, data.boardState);
});

/*
pxl.comm.socket.on('userCount', function(data) {
  //data.usersCount now holds the value of how many users are currently logged in
  let counter = document.getElementById('userCount');
  counter.innerHTML = data.userCount;
});
*/

pxl.comm.socket.on('boardUpdate', function(data) {
  pxl.grid.updateGrid(data.boardState);
});

pxl.comm.socket.on('boardDisconnect', function() {
  pxl.grid.deleteGrid();

  let tempImg = document.getElementById('inactive_canvas');
  tempImg.classList.remove('inactive');
  tempImg.classList.add('active');
});
