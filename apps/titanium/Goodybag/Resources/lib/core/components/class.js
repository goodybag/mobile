 /**
 * Create a new Class based on Object Notation. 
 * 
 * Object that allows for easy object extension and 
 * injection. Based on normal OOP standards using javascript prototypal 
 * methods and leveling javascript property cloning. Requires a constructor 
 * method to exist on the object given.
 * 
 * @param {Object} properties Object that is converted to Class Object and passed back.
 * @return {Object} Class Object
 * @constructor
 */
var Class = function (properties) {
  function clone (source, target) {
    Object.getOwnPropertyNames(source).forEach(function(prop) {
      Object.defineProperty(target, prop, Object.getOwnPropertyDescriptor(source, prop));
    });

    return target;
  }

  this.inject = function (properties) { 
    return clone(properties, this); 
  };

  this.extend = function (properties) {
    var parent = this.prototype || Class
    ,   proto  = Object.create(parent)
    ,   target = clone(properties, proto)
    ,   body   = target.Constructor;

    if (!(body instanceof Function)) {
      throw new Error("Constructor missing in a class!");
    }
    
    body.prototype = target;
    body.parent = parent;
    body.extend = this.extend;
    body.inject = this.inject;
    body.extended = true;

    return body;
  };

  return this.extend(properties);
};