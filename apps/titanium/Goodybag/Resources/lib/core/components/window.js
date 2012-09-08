!(function (GB) {
  var Windows = {
    windows: {},
    instantiated: {},
    current: false
  };
  
  Windows.add = function (name, window) {
    gb.utils.debug('Storing Window: ' + name);
    
    window.windowName = name;
    this.windows[name] = window;
    gb.utils.debug('Window stored: ' + name);
  };
  
  Windows.instantiate = function (name) {
    gb.utils.debug("Instantiating Window: " + name);
    if (this.instantiated[name]) return;
    this.instantiated[name] = new this.windows[name]();
    this.instantiated[name].window.visible = false;
    
    if (typeof this.instantiated[name].onAndroid != 'undefined' && gb.isAndroid)
      this.instantiated[name].onAndroid();
    else if (typeof this.instantiated[name].onIOS != 'undefined' && gb.isIOS)
      this.instantiated[name].onIOS();
    gb.utils.debug('Window instantiated: ' + name);
  };
  
  Windows.get = function (name) {
    gb.utils.debug('Getting Window: ' + name);
    if (!this.instantiated[name]) this.instantiate(name);
    return this.instantiated[name];
  };
  
  Windows.exists = function (name) {
    return this.windows[name] ? true : false;
  };
  
  Windows.show = function (name, destroy) {
    if (!name) return;
    if (name === this.current) return;
    gb.utils.debug('Checking if Window exists: ' + name);
    if (!this.exists(name)) return;
    gb.utils.debug('Showing Window: ' + name);

    if (!this.instantiated[name]) this.instantiate(name);
    if (this.current) this.hide(this.current);
    
    this.instantiated[name].show();
    this.current = name;
    gb.utils.debug('Window shown: ' + name);
  };
  
  Windows.hide = function (name, close) {
    if (!name) return;
    if (!this.exists(name)) return;
    gb.utils.debug('Hiding Window: ' + name);

    this.instantiated[name].hide();
    gb.utils.debug('Window hidden: ' + name);
  };
  
  Windows.destroy = function (name) {
    this.hide(name);
    this.instantiated[name].window.close();
    this.instantiated[name].window = null;
    delete this.instantiated[name].window;
    this.instantiated[name] = null;
    delete this.instantiated[name];
    this.windows[name] = null;
    delete this.windows[name];
  };
  
  GB.Windows = Windows;
})(
  gb
);

var Window = new Class(gb.utils.extend({
  created: false,
  window: false,
  debug: false,
  
  Constructor: function () {},
  
  /**
   * Add element to current window. 
   * @param {Object} object
   */
  add: function (object) {
    this.window.add(object);
  },
  
  delegateEvents: function () {
    var e;
    for (var key in this.events){
      e = this.events[key];
      e.target.addEventListener(e.type, e.action);
    }
  },
  
  destroyEvents: function () {
    var e;
    for (var key in this.events){
      e = this.events[key];
      e.target.removeEventListener(e.type, e.action);
    }
  },
  
  show: function () {
    gb.utils.debug('[' + this.windowName + '] Attempting to show window.', this.debug);
    
    if (!this.created) {
      gb.utils.debug('[' + this.windowName + '] Window has not yet been created, opening.', this.debug);
      
      this.window.open();
      this.window.visible = true;
      this.created = true;
    }
    
    if (typeof this.onShow != 'undefined')
      this.onShow();
    
    this.window.show();
  },
  
  hide: function () {
    gb.utils.debug('[' + this.windowName + '] Attempting to hide window.', this.debug);
    
    if (typeof this.onHide != 'undefined' && this.created) this.onHide();
    if (this.created) this.window.hide()
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
}, WindowLoader));
