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
  if (typeof view.extended === 'undefined') {
    view.viewName = name;
    view = View.extend(view);
  }
  
  this.views[name] = new view();
  this.views[name].viewName = name;
  this.views[name].self.hide();
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
  return this.views[name];
};

/**
 * Checks for the existence of a view by the given identifier.
 * 
 * @param {String} name View Identifier
 * @return {Boolean}
 * @type {Method}
 */
Views.exists = function (name) {
  return (this.views[name]) ? true : false;
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
  if (!this.exists(name)) return;
  if (this.current) this.hide(this.current);
  if (typeof this.views[name].onShow != 'undefined') this.views[name].onShow(context);
  
  this.views[name].self.show();
  this.current = name;
  
  if (typeof this.views[name].afterShow != 'undefined' && gb.isIOS) this.views[name].afterShow(context);
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
  if (typeof this.views[name].onHide != 'undefined') this.views[name].onHide(context);
  
  this.views[name].self.hide();
};

/**
 * Destroy requested view by given view identifier.
 * 
 * @param {String} name View Identifier
 * @type {Method}
 */
Views.destroy = function (name) {
  if (!name) return;
  if (!this.exists(name)) return;
  
  this.views[name].self = null;
  delete this.views[name];
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