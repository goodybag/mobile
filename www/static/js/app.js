(function(){
  this.app.cache = this.app.cache || {};
  this.app.user = this.app.user || new this.app.Models.Auth();

  app.compileTemplates(function(){
    this.app.router = new this.app.GbMobileRouter();

    // Backbone config
    Backbone.history.start({
      pushState: app.config.pushState
    });
  });

  /*$(document).on('deviceready', function(){
    try {
      //alert('Device is ready! Make sure you set your app_id below this alert.');
      FB.init({
        appId: "152282721508707",
        nativeInterface: PG.FB
      });
    } catch (e) {
      alert('woot');
      alert(e);
    }
    // Get session and navigate to appropriate route
    app.user.updateSession(function(error, data){
      if (utils.exists(error) || !utils.exists(data)){
        if (app.config.pushState)
          app.cache.previousRoute = $('<a/>').attr('href', location.path)[0].pathname;
        else
          app.cache.previousRoute = location.hash.split('#')[1];

        console.log("navigate to login");
        app.router.navigate('login', {trigger: true});
      }*//*else{
        // Navigate to previous state or home
        var url = app.config.pushState
                  ? $('<a/>').attr('href', location.path)[0].pathname
                  : location.hash.split('#')[1];
        if (url == "login") url = "";
        app.router.navigate(url);
      }*/
    //});
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