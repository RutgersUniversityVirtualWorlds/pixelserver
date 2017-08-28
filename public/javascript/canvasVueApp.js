var compact = VueColor.Compact;

var currentColor = {
  hex: '#7b64ff',
  a: 1
}

var canvasApp = new Vue({
  el: '#canvasApp',
  components: {
    'compact-picker': compact
  },
  data: {
    color: currentColor
  },
  updated: function() {
    if(grid) {
      grid.activeColor = canvasApp.color.hex;
    }
  }
})
