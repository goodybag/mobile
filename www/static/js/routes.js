(function(){
  var routes = function(){};

  routes.landing = function(){
    console.log("Hello World!");
  };

  this.app = window.app || {};
  this.app.routes = routes;
})(this);