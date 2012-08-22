var exports = exports || this;

exports.iconic = (function (global) {
  var noop = function () {};
  
  var iconic = function (options) {
    var $self = (this instanceof iconic) ? this : new noop(), font;
    options = options || {}; 
    font = require('lib/core/components/iconic/fonts/' + options.font);
    $self.font = new font();
    return $self;
  };
  
  noop.prototype = iconic.prototype;
  iconic.prototype.get = function (options) {
    var $self = this;
    
    if (({}).toString.call(options) === '[object Array]') {
      var icons = [];
      options.forEach(function (value) {
        icons.push(String.fromCharCode($self.font.getCharCode(value)));
      });
      
      return icons;
    }
    
    return String.fromCharCode($self.font.getCharCode(options));
  };
  
  iconic.prototype.typeface = function () {
    return this.font.typeface;
  };
  
  return iconic;
})(this);
