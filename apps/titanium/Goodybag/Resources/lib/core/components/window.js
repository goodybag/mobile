!(function (GB) {
  var Windows = {
    windows: {},
    current: false
  };
  
  Windows.add = function (name, window) {
    gb.utils.debug('Storing Window: ' + name);
    
    this.windows[name] = new window();
    this.windows[name].windowName = name;
    this.windows[name].window.visible = false;
    
    if (typeof this.windows[name].onAndroid != 'undefined' && gb.isAndroid)
      this.windows[name].onAndroid();
    else if (typeof this.windows[name].onIOS != 'undefined' && gb.isIOS)
      this.windows[name].onIOS();
  };
  
  Windows.get = function (name) {
    return this.windows[name];
  };
  
  Windows.exists = function (name) {
    return this.windows[name] ? true : false;
  };
  
  Windows.show = function (name, destroy) {
    if (!name) return;
    if (!this.exists(name)) return;

    if (this.current) {
      this.windows[this.current][((destroy) ? 'destroy' : 'hide')]();
      
      if (destroy) {
        delete this.windows[this.current];
      }
    }
    
    this.windows[name].show();
    this.current = name;
  };
  
  Windows.hide = function (name, close) {
    if (!name) return;
    if (!this.exists(name)) return;

    this.windows[name].hide();
  };
  
  GB.Windows = Windows;
})(
  gb
);

var Window = new Class({
  created: false,
  window: false,
  debug: false,
  
  Constructor: function () { },
  
  /**
   * Add element to current window. 
   * @param {Object} object
   */
  add: function (object) {
    this.window.add(object);
  },
  
  show: function () {
    gb.utils.debug('[' + this.windowName + '] Attempting to show window.', this.debug);
    
    if (!this.created) {
      gb.utils.debug('[' + this.windowName + '] Window has not yet been created, opening.', this.debug);
      
      this.created = true;
      this.window.open();
    }
    
    if (typeof this.onShow != 'undefined')
      this.onShow();
    
    this.window.show();
  },
  
  hide: function () {
    gb.utils.debug('[' + this.windowName + '] Attempting to hide window.', this.debug);
    
    if (typeof this.onHide != 'undefined' && this.created) this.onHide();
    if (this.created) this.window.close(), this.created = false;
  },
  
  destroy: function () {
    gb.utils.debug('[' + this.windowName + '] Attempting to destroy window.', this.debug);
    
    if (this.created) {
      gb.utils.debug('[' + this.windowName + '] Window has been created. We can destroy it.', this.debug);
      
      if (typeof this.onDestroy != 'undefined')
        this.onDestroy();
        
      this.window.close();
      this.created = false;
    } else {
      gb.utils.debug('[' + this.windowName + '] Window never created, ignoring request.', this.debug);
    }
  }
});
