(function(){
  this.app.cache = this.app.cache || {};

  app.compileTemplates(function(){
    this.app.router = new this.app.GbMobileRouter();

    // Backbone config
    Backbone.history.start({
      pushState: app.config.pushState
    });

    // Authenticate and navigate to appropriate route
    api.auth.session(function(error, consumerData){
      if(typeof error !== "undefined"){
        console.log("navigate to login");
        app.router.navigate('login', {trigger: true});
        return;
      }
      app.cache.consumer = consumerData;
      console.log("navigate to test");
      app.router.navigate('test');
    });
  });

  // Prevent jqm from handling routes
  $(document).on('pagebeforechange', function(e, data){
    // Only on url updates, not jquery elements
    if (typeof data.toPage === "string") {
      e.preventDefault();
      var url = app.config.pushState
                ? $('<a/>').attr('href',data.toPage)[0].pathname
                : data.toPage.split('#')[1];
      console.log(url);
      app.router.navigate(url, {trigger: true});
    }
  });
}).call(this);