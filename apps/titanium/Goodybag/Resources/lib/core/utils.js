/**
 * Utilities
 */
gb.utils = function (global) {
  var self = this;
  
  /**
   * Android Platform Check
   * 
   * @type {Boolean}
   */
  gb.isAndroid = (Ti.Android) ? true : false;

  /**
   * IOS Platform Check
   * 
   * @type {Boolean}
   */
  gb.isIOS = (Ti.Android) ? false : true;
  gb.isRetina = (Ti.Android) ? false : (Ti.Platform.displayCaps.density === 'high');
  
  /**
   * Base Path
   */
  this.basePath = Titanium.Filesystem.resourcesDirectory + Titanium.Filesystem.separator;
  
  // HTTP
  this.http = {};
  
  /**
   * HTTP Get Request
   * 
   * @param {String} url
   * @param {Object} options
   * $param {Function} callback function to be called for a good load event
   */
  this.http.get = function (url, callback) {
    var client = Titanium.Network.createHTTPClient();
    
    client.onload = function () {
      callback.apply(this, [ null, this.responseText]);
    }
    
    client.onerror = function (e) {
      callback.apply(this, [ e.error ]);
    }

    client.setTimeout(100000);
    client.open('GET', url);
    client.send();
  }
  
  /**
   * HTTP Get Request to fetch image data from a given url.
   * 
   * @param  {String}   url      Image URI
   * @param  {Function} callback Returns error or image data for writing to files or directly to ImageView.
   */
  this.http.get.image = function (url, callback) {
    var client = Titanium.Network.createHTTPClient();
    
    client.onload = function () {
      callback.apply(this, [ null, this.responseData]);
    }
    
    client.onerror = function (e) {
      callback.apply(this, [ e.error ]);
    }
    
    client.setTimeout(100000);
    client.open('GET', url, false);
    client.send();
  }
  
  /**
   * HTTP POST Request
   *
   * Options are actually parameters (values) that you wish to 
   * be pass along with the request, posted as application/json.
   * 
   * @param  {String}   url      POST URI
   * @param  {Object}   options  Post Parameters
   * @param  {Function} callback Returns error or request results.
   */
  this.http.post = function (url, options, callback) {
    var client = Ti.Network.createHTTPClient();
    
    client.onload = function () {
      callback.apply(this, [ null, this.responseText]);
    }
    
    client.onerror = function (e) {
      callback.apply(this, [ e.error ]);
    }
    
    client.timeout = 5000;
    client.open('POST', url);
    client.setRequestHeader('content-type', 'application/json');
    client.send(options ? JSON.stringify(options) : '');
  };
  
  /**
   * HTTP POST without using json
   *
   * Options are actually parameters (values) that you wish to 
   * be pass along with the request
   * 
   * @param  {String}   url      POST URI
   * @param  {Object}   options  Post Parameters
   * @param  {Function} callback Returns error or request results.
   * @param  {Function} progress Optional callback for the onsendstream event
   */
  this.http.post.generic = function (url, options, callback, progress) {
    var client = Ti.Network.createHTTPClient();
    
    client.onload = function () {
      callback.apply(this, [ null, this.responseText]);
    }
    
    client.onerror = function (e) {
      callback.apply(this, [ e.error ]);
    }
    
    if (progress) client.onsendstream = progress;
    
    client.timeout = 10000;
    client.open('POST', url);
    client.send(options);
  };
  
  /**
   * Authenticated HTTP GET Request
   *
   * Utilize this method when wanting to send a GET request to a 
   * resource that requests an authenticated request.
   *
   * Make sure your session key-store contains the correct cookie 
   * data for the requested api.
   * 
   * @param  {String}           url      GET URI
   * @param  {Cookie Storage}   session  Cookie key-store from #gb.utils.parsers.cookies.storage
   * @param  {Function}         callback Returns errors or request results.
   */
  this.http.get.sessioned = function (url, session, callback) {
    var client = Titanium.Network.createHTTPClient();
    
    client.onload = function () {
      callback.apply(this, [ null, this.responseText]);
    }
    
    client.onerror = function (e) {
      callback.apply(this, [ e.error ]);
    }
    
    client.open('GET', url);
    client.setRequestHeader('Cookie', session.toString());
    client.send();
  }
  
  /**
   * Authenticated HTTP POST Request
   *
   * Utilize this method when wanting to send a POST request to a 
   * resource that requests an authenticated request.
   *
   * Make sure your session key-store contains the correct cookie 
   * data for the requested api.
   * 
   * @param  {String}           url      GET URI
   * @param  {Cookie Storage}   session  Cookie key-store from #gb.utils.parsers.cookies.storage
   * @param  {Function}         callback Returns errors or request results.
   */
  this.http.post.sessioned = function (url, session, options, callback) {
    var client = Titanium.Network.createHTTPClient();
    
    client.onload = function () {
      callback.apply(this, [ null, this.responseText]);
    }
    
    client.onerror = function (e) {
      callback.apply(this, [ e.error ]);
    }
    
    client.open('POST', url);
    client.setRequestHeader('content-type', 'application/json');
    client.setRequestHeader('Cookie', session.toString() + '; ');
    client.send(options ? JSON.stringify(options) : '');
  };

  /**
   * Returns relational path from basepath.
   * 
   * @param  {String} path file path.
   * @return {String}      relational path.
   */
  this.getRelPath = function(path){
    return self.basePath + path;
  }
  
  /**
   * Return image resource with a platform specific pathway.
   * 
   * @param  {String} path image file path.
   * @return {String}      platform specific image path.
   */
  this.getImage = function (path) {
    path = (gb.isAndroid ? '/images/' : '') + path;
    this.debug('[gb.utils.getImage] ' + path);
  
    return path;
  }
  
  /**
   * String trimmer that works for arrays and strings.
   * 
   * @param  {Mixed}  obj accepts all data but only trims arrays and strings.
   * @return {Mixed}      trimmed data.
   */
  this.trim = function (obj) {
    if (obj === null) return obj;

    /**
     * Private string trimming function
     * 
     * @param  {String} str input that will be trimmed of whitespace.
     * @return {String}     trimmed string.
     */
    function t (str) {
      if (str === null) return str;
      var str = str.replace(/^\s\s*/, ''), ws = /\s/, i = str.length;
      while (ws.test(str.charAt(--i)));
      return str.slice(0, i + 1);
    };

    if (Object.prototype.toString.call(obj) === '[object Array]') {
      var i;
      for (i = 0; i < obj.length; i++) {
        if (Object.prototype.toString.call(obj[i]) === '[object Array]')
          obj[i] = this.trim(obj[i]);
        else if (Object.prototype.toString.call(obj[i]) === '[object String]')
          obj[i] = t(obj[i]);
        else continue;
      }
    } else if (Object.prototype.toString.call(obj) === '[object String]') {
      obj = t(obj);
    }

    return obj;
  }

  /*
   * Parsers to handle various parsing needs.
   */
  this.parsers = {};
  
  /**
   * Cookie Parser Object
   */
  this.parsers.cookie = {};
  
  /**
   * Cookie Key-Store Storage Object
   * 
   * @param  {[type]} store [description]
   * @return {[type]}       [description]
   */
  this.parsers.cookie.storage = function (store) {
    this._store = store || {};
    
    this.get = function (id) {
      return this._store[id];
    };
    
    this.put = this.set = function (id, data) {
      return this._store[id] = data;
    };
    
    this.toString = function () {
      var string = "";
      
      for (var i in this._store) {
        if (!this._store.hasOwnProperty(i) || i == null) continue;
        
        if(this._store[i] == null)
          string += i + "; ";
        else
          string += i + "=" + this._store[i] + "; ";
      }
      
      // Remove the last space and semicolon.
      return string.substr(0, string.length-2);
    }
    
    return this;
  };
  
  /**
   * Cookie String Parser
   *
   * Takes cookie string from headers and parses into a Cookie Storage object 
   * for easy key-store fetching.
   *
   * @param  {String} string Cookie header string
   * @return {Cookie Store}  #gb.utils.parsers.cookie.parser
   */
  this.parsers.cookie.parser = function (string) {
    var segments, section, storage = {};
    
    if (string === null || self.trim(string) === '') {
      return null;
    };
    
    segments = string.split(';');
    
    if (segments.length > 1 && (segments[segments.length] === null || self.trim(segments[segments.length]) === '')) 
      segments.pop();
    
    for(var i in segments) {
      if (!segments.hasOwnProperty(i)) continue;
      section = null;
      section = self.trim(segments[i]);
      
      if (section != null) {
        if(section.indexOf('=') !== -1) {
          section = section.split('=');
          storage[section.shift()] = section.join('=');
        } else {
          storage[section] = null;
        }
      }
    }
    
    return new self.parsers.cookie.storage(storage);
  };
  
  /**
   * Quick debug logging accessor.
   * @param {Object} s
   * @param debug boolean depicting a separate debugger instance
   */
  this.debug = function (s, debug) {
    if (debug != null) {
      if (debug) return Ti.API.info(s);
    } else if (gb.config.debug) 
      return Ti.API.info(s);
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
  
  /**
   * Absolute width of the display in relation to UI orientation
   */
  this.deviceWidth = function () {
    return Ti.Platform.displayCaps.platformWidth;
  }
  
  /**
   * Returns screen density based on platform.
   */
  this.densityPixels = function (densityPixels) {
    if (gb.isIOS) return densityPixels;
    return (densityPixels * Titanium.Platform.displayCaps.dpi / 160); // Medium DPI is 160, this scales to it.
  }
  
  /**
   * Convert degrees to radians for utilization in spherical trigonometry
   */
  this.toRad = function (number) {
    return number * Math.PI / 180;
  }
  
  /**
   * Determine the haversine distance from two points.
   */
  this.haversine = function (a, b, R) {
    var dlat, dlon, as, c, d, lt1, lt2;
    R    = R || 3960; // 3960 is the Earth Mean for Miles, 6937 is the mean for kilometers.
    dlat = this.toRad(b.lat - a.lat);
    dlon = this.toRad(b.lon - a.lon);
    lt1  = this.toRad(a.lat);
    lt2  = this.toRad(b.lat);
    as   = Math.sin(dlat/2) * Math.sin(dlat/2) +
           Math.sin(dlon/2) * Math.sin(dlon/2) *
           Math.cos(lt1) * Math.cos(lt2);
    c    = 2 * Math.atan2(Math.sqrt(as), Math.sqrt(1-as));
    d    = R * c;
    return (d < 0.01) ? 0.01 : (Math.round(d * 100) / 100);
  }
  
  this.clone = function (o) {
    return JSON.parse(JSON.stringify(o));
  }
  
  /**
   * Merge two objects together.
   */
  this.merge = function (d, o, p, e) {
    var cd = {}, co = {}, oe, de;
    if (typeof o != 'object' || o == null) return this.clone(d);
    
    // Extract functions
    de = d.events || null, oe = o.events || null;
    for (var i in d) if (typeof d[i] == 'function') cd[i] = d[i];
    for (var i in o) if (typeof o[i] == 'function') co[i] = o[i];
    
    // Clone
    d = this.clone(d); o = this.clone(o);
    
    // Put them back
    if (de) d.events = de;
    if (oe) o.events = oe;
    for (var i in cd) if (typeof cd[i] == 'function') d[i] = cd[i];
    for (var i in co) if (typeof co[i] == 'function') o[i] = co[i];
    
    for (p in o) {
      if (o == undefined) continue;
      if (!o.hasOwnProperty(p)) continue;
      if (o[p] == undefined) continue;
      if (typeof o[p] != 'object' || o[p] == null)  d[p] = o[p];
      else if (({}).toString.call(d[p]) == '[object Function]' && !o[p]) continue; 
      else if (typeof d[p] != 'object' || d[p] == null) d[p] = this.merge(o[p].constructor === Array ? [] : {}, o[p]);
      else d[p] = this.merge(d[p], o[p]);
    }
    
    return d;
  }
  
  this.index = function (o, i) {
    return (o) ? o[i] : null;
  }
  
  this.ref = function (o, s) {
    return (s.indexOf('.') != -1) ? s.split('.').reduce(this.index, o) : [ s ].reduce(this.index, o);
  }
  
  /**
   * Extend on object with an arbitrary amount of other objects
   */
  this.extend = function(obj) {
    var args = Array.prototype.slice.call(arguments, 1);
    
    for (var i = args.length - 1, source; i >= 0; i--){
      source = args[i];
      
      for (var prop in source) {
        obj[prop] = source[prop];
      }
    }
    
    return obj
  }
  
  this.compound = function () {
    var args = [].slice.call(arguments);
    
    function add (base) {
      var args = [].slice.call(arguments, 1);
      args.forEach(function (item) { base.add(item); });
    }
        
    args.forEach(function (item) {
      return add.apply(this, item);
    });
  }
  
  /**
   * Returns a single view given an object where every view is added to its sibling "base" view
   * And each base view is added to the top-level base view 
   * Each level MUST have a base property
   * 
   * @Example
   * {
   *   base: Ti.UI.createView(...)
   * , left: {
   *     base: Ti.UI.createView(...)
   *   , picutre: Ti.UI.createImageView(...)
   *   }
   * , right: {
   *     base: Ti.UI.createView(...)
   *   , text: Ti.UI.createLabel(...)
   *   , border: Ti.UI.createView(...)
   *   }
   * }
   */
  this.compoundViews = function (tree) {
    var base = tree.base, item;
    if (typeof base === "undefined") throw new Error("Base is undefined");
    
    for (var key in tree){
      console.log(key);
      item = tree[key];
      if (item === null) continue;
      if (key === "base"){
        for (var eventType in item.events)
          item.addEventListener(eventType, item.events[eventType]);
        continue;  
      }
      
      if (typeof item === "object" && item.base) {
        base.add(self.compoundViews(item));
        // maybe get a little more granular with this check with:
        // Object.prototype.toString.call(item).indexOf('TI') > -1
      } else if (typeof item === "object") {
        console.log(item);
        for (var eventType in item.events)
          item.addEventListener(eventType, item.events[eventType]);
        base.add(item);
      }
    }
    
    return base;
  }
  
  return this;
}(
  this
);