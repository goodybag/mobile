/**
 * Handles the management of multiple views, each view is stored for later 
 * reference and utilization.
 * 
 * @type {Object}
 * @see Views#add
 * @see Views#get
 * @see Views#exists
 * @see Views#show
 * @see Views#hide
 * @see Views#destroy
 */
var Views = {
  /**
   * View storage object.
   * 
   * @type {Object}
   * @memberOf Views
   */
  views: {},
  
  instantiated: {},
  
  /**
   * Tracking variable used to keep up with which view has priority at the 
   * given moment.
   * 
   * @type {Mixed}
   * @memberOf Views
   */
  current: false
};

/**
 * Adds given view to view handler while initializing the view, calling the 
 * constructor function, and hiding it from view.
 *
 * **Sidenote:** The view is given a variable `viewName` that returns the 
 * name specified when the view was added, this variable can be utilized 
 * inside of the view after the constructor has been called unless the 
 * view was passed in as an object.
 * 
 * @param {String} name view identifier
 * @param {Object} view Object or Object returned from View.#extend
 * @type {Method}
 */
Views.add = function (name, view) {
  // if (typeof view.extended === 'undefined') {
    // view.viewName = name;
    // view = View.extend(view);
  // }
  // gb.utils.debug("instantiating " + name);
  // gb.utils.debug("instantiated " + name);
  view.Constructor.prototype = view;
  this.views[name] = view.Constructor;
  // gb.utils.debug("hiding " + name);
  // this.views[name].self.hide();
};

/**
 * Returns extended instance of the requested view by the given 
 * identifier.
 * 
 * @param  {String} name view identifier
 * @return {Object}
 * @type {Method}
 */
Views.get = function (name) {
  if (!this.instantiated[name]) return (this.instantiated[name] = new this.views[name]());
  return this.instantiated[name];
};

/**
 * Checks for the existence of a view by the given identifier.
 * 
 * @param {String} name View Identifier
 * @return {Boolean}
 * @type {Method}
 */
Views.exists = function (name) {
  return (this.instantiated[name]) ? true : false;
};

/**
 * Hides current view, and shows requested view, if applicable.
 * 
 * @param {String} name View Identifier
 * @param {Mixed} context Context to pass along to View#onShow (Optional)
 * @type {Method}
 */
Views.show = function (name, context) {
  if (!name) return;
  // if (!this.exists(name)) return;
  if (this.current) this.hide(this.current);
  if (!this.instantiated[name]) this.instantiated[name] = new this.views[name]();
  this.current = name;
  if (typeof this.instantiated[name].onShow != 'undefined') this.instantiated[name].onShow(context);
  gb.utils.debug("showing " + name);
  this.instantiated[name].self.show();
  gb.utils.debug("showed " + name);
  
  if (typeof this.instantiated[name].afterShow != 'undefined' && gb.isIOS) this.instantiated[name].afterShow(context);
};

/**
 * Hides requested view by given view identifier.
 * 
 * @param {String} name View Identifier
 * @param {Mixed} context Context to pass along to View#onHide (Optional)
 * @type {Method}
 */
Views.hide = function (name, context) {
  if (!name) return;
  if (!this.exists(name)) return;
  console.log('HIDING view ' + name);
  this.instantiated[name].self.hide();
  if (typeof this.instantiated[name].onHide != 'undefined') this.instantiated[name].onHide(context);
  if (this.instantiated[name].destroyOnHide) this.destroy(name);
};

/**
 * Destroy requested view by given view identifier.
 * 
 * @param {String} name View Identifier
 * @type {Method}
 */
Views.destroy = function (name) {
  if (typeof this.instantiated[name].onDestroy != 'undefined') this.instantiated[name].onDestroy();
  this.instantiated[name].self = null;
  this.instantiated[name].views = null;
  delete this.instantiated[name].views;
  delete this.instantiated[name].self;
  this.instantiated[name] = null;
  delete this.instantiated[name];
};

/**
 * Create or extend a new instance of View.
 *
 * Wrapper for Titanium Views that allows us to handle code in a more efficient 
 * manner like specific device support, visibility events, and easy object 
 * management through the view handler.
 * 
 * @type {Object}
 */
var View = new Class({
  /**
   * Holds titanium view object.
   * 
   * @type {Boolean}
   * @memberOf View
   */
  self: false,
  
  /**
   * Constructor Function for View Class
   *
   * @param {Object} view Titanium View Object
   * @constructor
   */
  Constructor: function (view) {
    this.self = view;
  }
});

// Assignment
GB.Views = Views;