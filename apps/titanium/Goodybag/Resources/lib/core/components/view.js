gb.Views = function () {
  var self = this;
  
  // Current Window
  this.current = false;
  
  // Window Object
  this.views = {};
  
  this.addView = function (name, view) {
    console.log('storing: ' + name);
    self.views[name] = new view();
    self.views[name].windowName = name;
    
    return self;
  };
  
  this.getView = function (name) {
    return self.views[name];
  };
  
  this.viewExists = function (name) {
    return self.views[name] ? true : false;
  };
  
  this.showView = function (name, destroy) {
    if(gb.config.debug) console.log('[' + name + '] Attempting to show view.');
    
    if(self.viewExists(name)) {
      if(gb.config.debug) console.log('[' + name + '] View exists continuing...');
      
      if(self.current) {
        self.current[((destroy) ? 'destroy' : 'hide')]();
        
        if(destroy) {
          if(gb.config.debug) console.log('[' + self.current.windowName + '] Destroyed current view.');
          delete self.views[self.current.windowName]
        }
      }
      
      self.views[name].show();
      this.current = self.views[name];
    } else {
      if(gb.config.debug) console.log('[' + name + '] View missing, ignoring request.');
    }
    
    return self;
  };
  
  this.hideView = function (name, close) {
    if(name) {
      if(self.viewExists(name)) {
        self.views[name].hide();
      }
    }
  };
  
  return this;
}();


var View = new Class({
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
    if(this.debug) console.log('[' + this.windowName + '] Attempting to show window.');
    
    if(!this.created) {
      if(this.debug) console.log('[' + this.windowName + '] Window has not yet been created, opening.');
      
      this.created = true;
      this.window.open();
    }
    
    this.window.show();
  },
  
  hide: function () {
    if(this.debug) console.log('[' + this.windowName + '] Attempting to hide window.');
    if(this.created) this.window.hide();
  },
  
  destroy: function () {
    if(this.debug) console.log('[' + this.windowName + '] Attempting to destroy window.');
    
    if(this.created) {
      if(this.debug) console.log('[' + this.windowName + '] Window has been created. We can destroy it.');
      this.window.close();
      this.created = false;
    } else {
      if(this.debug) console.log('[' + this.windowName + '] Window never created, ignoring request.');
    }
  }
});
