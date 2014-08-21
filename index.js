var Ractive = require('ractive');

var DelayedInput = Ractive.extend({
  template: '{{>element}}',
  beforeInit: function(opts) {
    var template = '<input value="{{.text}}" on-keydown="timeout-update"| />';
    var copy = ['placeholder', 'class', 'id', 'style'];
    var out = '';
    for (var k in opts.data) if (k.indexOf('on-') === 0 || copy.indexOf(k) > -1) out += k + '="' + opts.data[k] + '"';
    opts.partials.element = template.replace(/\|/, out);
  },
  lazy: true,
  init: function() {
    var me = this;
    me.on('timeout-update', function(e) {
      var k = e.original.keyCode;
      if (k !== 8 && k !== 32 && k !== 46 && k < 48) {
        me.fire('key', e);
        return;
      }
      if (!!me.timer) {
        clearTimeout(me.timer);
        me.timer = null;
      }
      me.timer = setTimeout(function() {
        me.fire('changed', e.node.value, e);
      }, me.get('timeout'));
      me.fire('charKey', e);
    });
  },
  data: {
    text: '',
    timeout: 500
  },
  partials: { element: '' }
});

module.exports = DelayedInput;
