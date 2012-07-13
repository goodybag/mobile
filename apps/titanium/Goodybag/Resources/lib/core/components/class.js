/**
 * Class system by Nijiko Yonskai
 * @param {Object} Object
 */
var Class = function (properties) {
  function clone (source, target) {
    Object.getOwnPropertyNames(source).forEach(function(prop) {
      Object.defineProperty(target, prop, Object.getOwnPropertyDescriptor(source, prop));
    });

    return target;
  }

  this.inject = function (properties) { return clone(properties, this); };

  this.extend = function (properties) {
    var parent = this.prototype || Class,
        proto  = Object.create(parent),
        target = clone(properties, proto);
        
    var body   = target.Constructor;
    if (!(body instanceof Function))
      throw new Error("Constructor missing in a class!");
    
    body.prototype = target;
    body.parent = parent;
    body.extend = this.extend;
    body.inject = this.inject;
    
    return body;
  };

  return this.extend(properties);
};