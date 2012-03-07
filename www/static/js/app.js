(function(){
  this.app.router = new this.app.GbMobileRouter();

  // Backbone config
  Backbone.history.start({
    pushState: true
  });

}).call(this);