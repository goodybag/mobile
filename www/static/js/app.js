(function(){
  this.app.cache = this.app.cache || {};
  this.app.user = this.app.user || new this.app.Models.Auth();
  _.extend(this.app, Backbone.Events);
  // For the api to use - Eventually, we'll stop using the consumer api
  // And just use backbone collections
  window.exists = utils.exists;

  app.compileTemplates(function(){
    this.app.router = new this.app.GbMobileRouter();

    // Backbone config
    Backbone.history.start({
      pushState: app.config.backbone.pushState
    });

    // Get session and navigate to appropriate route
    app.user.updateSession(function(error, data){
      if (utils.exists(error) || !utils.exists(data)){
        if (app.config.pushState)
          app.cache.previousRoute = $('<a/>').attr('href', location.path)[0].pathname;
        else
          app.cache.previousRoute = location.hash.split('#')[1];

        console.log("navigate to login");
        app.router.navigate('login', {trigger: true});
      }else{
        // Navigate to previous state or home
        var url = app.config.pushState
                  ? $('<a/>').attr('href', location.path)[0].pathname
                  : location.hash.split('#')[1];
        if (url == "login") url = "";
        app.router.navigate(url);
      }
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