(function(){
  this.app.router = new this.app.GbMobileRouter();

  // Backbone config
  Backbone.history.start({
    pushState: true
  });

  // Disable jqm's routing to use backbone's
  $(document).bind("mobileinit", function () {
    $.mobile.ajaxEnabled = false;
    $.mobile.linkBindingEnabled = false;
    $.mobile.hashListeningEnabled = false;
    $.mobile.pushStateEnabled = false;
  });
}).call(this);