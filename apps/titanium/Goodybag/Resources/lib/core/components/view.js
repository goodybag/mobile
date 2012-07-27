!(function (GB) {
  var Views = {
    views: {},
    current: false
  };
  
  Views.add = function (name, view) {
    if(typeof view.extended == 'undefined')
      view = View.extend(view);
    
    this.views[name] = new view();
    this.views[name].viewName = name;
    
    this.views[name].self.hide();
  };
  
  Views.get = function (name) {
    return this.views[name];
  };
  
  Views.exists = function (name) {
    return (this.views[name]) ? true : false;
  };
  
  Views.show = function (name, context) {
    if(!name) return;
    if(!this.exists(name)) return;
    if(this.current) this.hide(this.current);
    if(typeof this.views[name].onShow != 'undefined') this.views[name].onShow(context);
  
    this.views[name].self.show();
    this.current = name;
  };
  
  Views.hide = function (name, context) {
    if(!name) return;
    if(!this.exists(name)) return;
    if(typeof this.views[name].onHide != 'undefined') this.views[name].onHide(context);
    
    this.views[name].self.hide();
  };

  Views.destroy = function (name) {
    if(!name) return;
    if(!this.exists(name)) return;
    
    this.views[name].self = null;
    delete this.views[name];
  }

  GB.Views = Views;
})(
  gb
);

var View = new Class({
  extended: true,
  showing: false,
  self: false,
  
  Constructor: function (view) {
    this.self = view;
  }
});