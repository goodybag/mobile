/*
  Be careful of adding any console.logs of complex data structures
  It seems iOS is not taking kindly to that kind.
*/

(function(){

  this.app.cache = this.app.cache || {};
  this.app.cached = this.app.cached || {};
  // Give our app events -
  // We should do this first so the other files can
  // Emit events too
  Object.merge(this.app, utils.Events);
  // For the api to use
  window.exists = utils.exists;
  // Set some app shortcuts
  this.app.changePage = this.app.functions.changePage;
  this.app.user = new this.app.Models.User();

  // Round all of funds down
  this.app.user.on('change:funds', function(u){
    for (var key in u.attributes.funds){
      u.attributes.funds[key] = u.attributes.funds[key].floor(1);
    }
  });

  app.on('logout:success', function(){
    window.location.href = "/#!/";
  });

  // Load in facebook stuff
  if (!!localStorage["facebook.access_token"]){
    app.facebook = {
      access_token: localStorage["facebook.access_token"]
    , expires: new Date(localStorage["facebook.expires"])
    }
    app.facebook.expired = app.facebook.expires < new Date();
  }

  api.auth.session(function(error, consumer){
    if(exists(error)){
      console.log(error.message);
      return;
    };
    if (utils.exists(consumer)){
      app.user.set(consumer);
      window.location.href = utils.isRootHash() ? app.config.postLoginUrl : window.location.hash;
    }else{
      // Check Local storage to see if we can auto fb-login
      if (utils.exists(app.facebook) && !app.facebook.expired){
        api.auth.facebook(app.facebook.access_token, function(error, consumer){
          if (utils.exists(error)){
            console.log(error.message);
            return;
          }
          app.user.set(consumer);
          window.location.href = utils.isRootHash() ? app.config.postLoginUrl : window.location.hash;
        });
      }
    }
  });

  // Position Static fix for inputs on ios
  if (app.functions.lacksPositionStatic()){
    app.on('page:change:complete', function(){
      app.scroller.refresh();
      app.scroller.scrollTo(0,0,0);
      app.functions.showPositionStaticElements();
    });
  }

  // Hide/Show statics on input focus/blur for all devices
  app.on('page:change:complete', function(){
    $('input').unbind('.position-static-fix');
    $('input').on('focus.position-static-fix', function(){
      app.functions.hidePositionStaticElements();
    }).on('blur.position-static-fix', function(){
      app.functions.showPositionStaticElements();
    });
  });

  // Setup fake scroller to remove any chance of undefined poop
  app.scroller = { refresh: function(){}, scrollTo: function(){} };

  app.ready = function(){
    if (!app.templatesCompiled || !app.scriptsReady) return;
    app.previousRoutes = new app.Models.PreviousRoutes();
    app.activeRoute = new app.Models.ActiveRoute();

    // insert main view
    app.Views.Main = app.mainView = new app.Views.Main();
    app.Views.Main.render();
    $('#body').append(app.Views.Main.el);

    // insert page loader
    app.pageLoader = new app.Views.PageLoader();
    app.pageLoader.render();
    $('#body').append(app.pageLoader.el);

    // Fix position static shtuff
    if (app.functions.lacksPositionStatic()){
      $('.main-nav').css('position', 'absolute');
      $('.header-nav').css('position', 'absolute');
      $('.page-loader').css('position', 'absolute');
      setTimeout(function(){ app.scroller = new iScroll('wrapper', app.config.iscroll); }, 1000);
      $(window).on('resize', function(){
        app.mainView.fixStatics();
        app.functions.fitBodyToWindow();
        app.scroller.refresh();
      });
    }

    if (app.functions.lacksInsetShadow()){
      $('.main-nav .nav-shadow').css('display', 'block');
    }

    app.router.run('#!/');
  };

  $(document).ready(function(){
    app.compileTemplates(function(){
      app.templatesCompiled = true;
      app.ready();
    });
  });
}).call(this);