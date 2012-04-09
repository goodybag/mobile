(function(){
  this.app = window.app || {};
  this.app.routes = this.app.routes || {};
  var routes = {};
  var $container = $('#container');

  routes.everything = function(){
    console.log("BEFORE EVERYTHING!");

    if (!app.user.hasUserCache()
        && this.path != "/#!"
        && this.path != "/#!/"
        && this.path.indexOf("android") == -1){
      this.redirect('/#!/');
      return false;
    }

    app.activeRoute.setRoute(this.path);
  };

  routes.afterAll = function(){
    // Add to our previous routes model unless we clicked the back button
    if (app.previousRoutes.get('goingBack')){
      app.previousRoutes.set('goingBack', false);
    }else{
      app.previousRoutes.add(this.path);
    }
  };

  routes.landing = function(){
    console.log("[routes] - landing");
    app.functions.changePage(function(done){
      var landingView  = new app.Views.Landing({
        authModel: new app.Models.EmailAuth()
      });
      done(landingView.render());
    });
  };

  routes.register = function(){
    var landingView  = new app.Views.Landing({
      authModel: new app.Models.EmailAuth()
    });
    landingView.render();
    landingView.registerView();
  };

  routes.globalStream = function(){
    var options  = {
      page: this.params.page || 0,
      limit: 15,
      add: true
    };

    app.changePage(function(done){
      var streamsView = new app.Views.Streams({
        collection: app.api.activity
      }).render();
      app.api.activity.fetchGlobal(options, function(error){
        if (utils.exists(error)){
          console.error(error.message);
          return;
        }
        done(streamsView);
      });
    });

    // Load next page of results
    /*var canScrollLoad = true
      , $win          = $(window)
    ;
    $(window).scroll(function(e){
      if ($(window).offsetHeight + $(window).scrollTop >= $(window).scrollHeight && canScrollLoad) {
        options.page++;
        app.api.activity.fetchGlobal(options, function(error, data){
          if (utils.exists(error)){
            console.error(error.message);
            return;
          }
          if (data.length < options.limit) canScrollLoad = false;
        });
      }
    });*/
  };

  routes.myStream = function(){
    var options  = {
      page: this.params.page || 0,
      add: true
    };

    app.changePage(function(done){
      var streamsView = new app.Views.Streams({
        collection: app.api.activity
      }).render();
      app.api.activity.fetchSelf(options, function(error){
        if (utils.exists(error)){
          console.error(error.message);
          return;
        }

        // Scroll to end load more
        var scrollObserver  = new utils.scrolledToEndObserver($(window), app.functions.stream.scrollListenerMy);
        // Make sure we remove the scroll listener after leaving this page
        $(window).off('hashchange.stream').on('hashchange.stream', function(e){
          scrollObserver.off();
        });

        done(streamsView);
      });
    });
  };

  routes.places = function() {
    app.changePage(function(done){
      var placesView = new app.Views.Places({});
      placesView.loadPlaces(function(){
        done(placesView);
      });
    });
  };

  routes.placeDetails = function() {
    var self = this;
    app.changePage(function(done){
      api.businesses.getOneEquipped(self.params.id, function(error, business){
        if(utils.exists(error)){
          console.log(error);
          return;
        };
        var placeDetailsView = new app.Views.PlaceDetails({
          model: new utils.Model(business)
        });
        done(placeDetailsView.render());
      });
    });
  };

  routes.tapIn = function() {
    //consider not using true
    api.auth.session(true, function(error, data){
      if(utils.exists(error)){
        console.log(error);
        return;
      };
      var model = new utils.Model({});
      if (data){
        model.set("barcodeId", data.barcodeId);
      }
      var tapInView = new app.Views.TapIn({
        model: model
      });
    $("#content").html(tapInView.render().el);
    });
  };

  routes.login = function(){
    console.log("[routes] - login");
    var landingView  = new app.Views.Landing({});
    $("#content").html(landingView.render().el);
    landingView.login();
  };

  routes.logout = function(){
    console.log("[routes] - logout");
    api.auth.logout(function(error, consumer){
      if (utils.exists(error)){
        console.log(error);
        return;
      }
      app.user.clear();
      app.previousRoutes.clear();
      window.location.replace("/#!/");
    });
  };

  routes.emailLogin = function(){
    $('#container').html(app.templates.emailLogin());
  };

  routes.emailLoginSubmit = function(){
    var login = $('#email-login-form').serializeObject();
    api.auth.login(login, function(error, user){
      if (utils.exists(error)){
        console.log(error);
        return;
      }
      app.router.runRoute('get', '#!/dashboard');
    });
  };

  /* Finish implementation
  routes.logout = function(){
    var self = this;
    app.user = {}; //clean up anything left behind in the cache
    api.auth.logout(function(error,data){
      if(exists(error))
        notify.error(error.message);
      //redirect regardless of error.
      removeGbModals();
      //_kmq.push(['clearIdentity']); //kissmetrics - clear ident
      _kmqRecord('', 'Signed Out');
      self.redirect('#!/');
    });
  };*/

  routes.dashboard = function(){
    $('#container').html(app.templates.dashboard());
  };

  routes.goodies = function(){
    console.log('[routes] - goodies');

    app.functions.changePage(function(done){
      var goodiesPage = new app.Views.Goodies();
      var options = {
        media: 1,
        progress: 1
      };
      goodiesPage.render();
      api.loyalties.list(options, function(error, loyaltiesProgressAndMedia){
        if(utils.exists(error)){
          console.log(error.message);
          done(new app.Views.NoGoodies().render())
          return;
        }
        var goodies   = utils.goodyJoin(loyaltiesProgressAndMedia)
          , $goodies  = $()
          , goody
        ;
        if (goodies.length == 0){
          done(new app.Views.NoGoodies().render());
        }else{
          for (var i = 0; i < goodies.length; i++){
            goody = new app.Views.Goody({
              model: new app.Models.Goody(goodies[i])
            });
            goodiesPage.addGoody(goody);
          }
          done(goodiesPage);
        }
      });
    });
  };

  routes.settings = function(){
    app.functions.changePage(function(done){
      done(new app.Views.Settings().render());
    });
  };

  routes.changePassword = function(){
    app.functions.changePage(function(done){
      done(new app.Views.ChangePassword().render());
    });
  };

  routes.changeTapIn = function(){
    app.functions.changePage(function(done){
      done(new app.Views.ChangeTapIn().render());
    });
  };

  routes.changePicture = function(){
    app.functions.changePage(function(done){
      done(new app.Views.ChangePicture().render());
    });
  };

  routes.androidConfig = function(){
    var version = this.params.version
      , link    = '<link rel="stylesheet" href="/static/css/{name}.css" id="{name}" />'
    ;
    // http://developer.android.com/reference/android/os/Build.VERSION_CODES.html
    // For version codes - or go to globals
    console.log("[android] - version: " + version);
    if (version < app.globals.android.versionCodes['3.0']){
      // Android styles
      $('head').append($(link.replace('{name}', 'androidlt3')));
      // Use simple goodies
      app.fragments.goody = app.fragments.simpleGoody;
    }
    window.location = '/#!/';
  };

  // Export
  for (var key in routes){
    this.app.routes[key] = routes[key];
  }
})(this);