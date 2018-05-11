const WebSocketState = function(jwt) {
  let state = this;
  let url = 'wss://rugrid.mozilla-iot.org/things/http---192.168.33.132-3000?jwt=' + jwt;
  this.ws = new WebSocket(url, 'webthing');

  this.ws.addEventListener('open', function(e) { state.onOpen(); });
};

WebSocketState.prototype.onOpen = function() {
  let msg = {
    messageType: "setProperty",
    data: {
      led: '{"index": 7, "color": {"r": 55, "g": 255, "b": 5 }}',
    }
  };

  this.ws.send(JSON.stringify(msg));
};

export default WebSocketState;
