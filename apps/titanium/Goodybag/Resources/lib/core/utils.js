/**
 * Utilities
 */
gb.utils = function (global) {
  var self = this;
  
  /**
   * Check platforms
   */
  gb.isAndroid = (Ti.Android) ? true : false;
  gb.isIOS = (Ti.Android) ? false : true;
  
  /**
   * Base Path
   */
  this.basePath = Titanium.Filesystem.resourcesDirectory + Titanium.Filesystem.separator;
  
  /**
   * Ajax Get Request with JSON parse on responce data
   * @param {String} url
   * @param {Object} data
   * $param {Function} onload function to be called for a good load event
   */
  this.getJSON = function (url, data, onload) {
    self.debug('Goodybag: Attempting to fetch JSON data');
    self.debug(url);
    self.debug(data);
    
    var xhr = Titanium.Network.createHTTPClient();
    
    xhr.onload = function () {
      var jsonStr = this.responseText;
      try {
        onload(JSON.parse(jsonStr));
      } catch (e) {
        self.debug(this.responseText);
        self.debug(e);
      }
    }
    
    xhr.onerror = function () {
      self.notice('No network connection found. :(');
    }
    
    xhr.open('GET',url);
    xhr.send(data);
  }
  
  /**
   * Screen density
   */
  this.densityPixels = function (densityPixels) {
    if(gb.isIOS) return densityPixels;
    return (densityPixels * Titanium.Platform.displayCaps.dpi / 160); // Medium DPI is 160, this scales to it.
  }

  /**
   * Relational path.
   */
  this.getRelPath = function(path){
    return self.basePath + path;
  }
  
  this.getImage = function (path) {
    return (gb.isAndroid ? '/images/' : '') + path;
  }
  
  // http://blog.stevenlevithan.com/archives/faster-trim-javascript
  this.trim = function (str) {
    var str = str.replace(/^\s\s*/, ''), ws = /\s/, i = str.length;
    while (ws.test(str.charAt(--i)));
    return str.slice(0, i + 1);
  }
  
  /**
   * Quick debug logging accessor.
   * @param {Object} s
   */
  this.debug = function (s) {
    if(gb.config.debug) return Ti.API.info(s);
  };
  
  /**
   * Quick info logging accessor.
   * @param {Object} s
   */
  this.info = function (s) {
    return Ti.API.info(s);
  };
  
  /**
   * Quick warning logging accessor.
   * @param {Object} s
   */
  this.warn = function (s) {
    return Ti.API.warn(s);
  };
  
  /**
   * Quick error logging accessor.
   * @param {Object} s
   */
  this.error = function (s) {
    return Ti.API.error(s);
  }
  
  /**
   * Alert notifications
   * @param {Object} s
   */
  this.notice = function (s) {
    alert(s);
  }
  
  return this;
}(
  this
);