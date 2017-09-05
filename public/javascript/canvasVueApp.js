var compact = VueColor.Compact;

var currentColor = {
  hex: '#7b64ff',
  rgba: {
    r: 123,
    g: 100,
    b: 255,
    a: 1
  },
  a: 1
}

var canvasApp = new Vue({
  el: '#colorPickerApp',
  components: {
    'compact-picker': compact
  },
  data: {
    color: currentColor
  },
  updated: function() {
    if(pxl.grid) {
      var rgbaArray = canvasApp.color.rgba;
      pxl.grid.activeColor = [rgbaArray.r, rgbaArray.g, rgbaArray.b];
    }
  }
})
