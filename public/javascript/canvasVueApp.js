var compact = VueColor.Compact;

var currentColor = {
  hex: '#7b64ff',
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
      pxl.grid.activeColor = canvasApp.color.hex;
    }
  }
})
