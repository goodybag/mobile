(function(){
  this.app.router = new this.app.GbMobileRouter();

  // Backbone config
  Backbone.history.start({
    pushState: true
  });

  // Prevent jqm from handling routes
  $(document).on('pagebeforechange', function(e, data){
    console.log(data.toPage);
    if (typeof data.toPage === "string") {
      e.preventDefault();
      var url = data.toPage.split('#')[1];
      console.log(url);
      app.router.navigate(url, {trigger: true});
    }
  });

}).call(this);