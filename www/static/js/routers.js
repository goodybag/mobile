(function(){
  this.app = window.app || {};
  var router = {};

  router.run = function(route){
    app.trigger('route:before', [route], app);
    app.routes[route]();
  };

  // Export
  for (var key in router){
    this.app.router[key] = router[key];
  }
}).call(this);