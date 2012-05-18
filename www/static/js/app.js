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

  // Load in facebook stuff
  console.log("Checking Local Storage for facebook")
  if (localStorage["facebook.access_token"]){
    console.log("Local Storage found facebook, setting local variable")
    app.facebook = {
      access_token: localStorage["facebook.access_token"]
    , expires: new Date(localStorage["facebook.expires"])
    }
    app.facebook.expired = app.facebook.expires < new Date();
    console.log(JSON.stringify(app.facebook));
  }

  console.log("Checking session for logged in user");
  api.auth.session(function(error, consumer){
    if(exists(error)){
      console.log(error.message);
      return;
    };

    if (utils.exists(consumer)){
      app.user.set(consumer);
      console.log("Redirecting to Global Stream or requested page");
      window.location.href = utils.isRootHash() ? app.config.postLoginUrl : window.location.hash;
    }else{
      // Check Local storage to see if we can auto fb-login
      console.log("Check local storage to see if we can auto fb-login");
      if (utils.exists(app.facebook) && !app.facebook.expired){
        console.log("Go ahead with the fb-login")
        api.auth.facebook(app.facebook.access_token, function(error, consumer){
          if (utils.exists(error)){
            console.log(error.message);
            return;
          }
          console.log("Login Success!");
          app.user.set(consumer);
          console.log("Redirecting to Global Stream or requested page");
          window.location.href = utils.isRootHash() ? app.config.postLoginUrl : window.location.hash;
        });
      }
    }
  });

  // Position Static fix for inputs on ios
  if (app.config.isIos){
    app.on('page:change:complete', function(){
      //$('input').undbind('.position-static-fix');
      $('input').on('focus.position-static-fix', function(){
        app.functions.hidePositionStaticElements();
      }).on('blur.position-static-fix', function(){
        app.functions.showPositionStaticElements();
      });
    });
  }

  $(document).ready(function(){
    app.compileTemplates(function(){
      app.previousRoutes = new this.app.Models.PreviousRoutes();
      app.activeRoute = new this.app.Models.ActiveRoute();
      app.Views.Main = app.mainView = new this.app.Views.Main();
      app.Views.Main.render();
      $('#body').prepend(app.Views.Main.el);

      // Fix position static shtuff
      if (app.functions.lacksPositionStatic()){
        $('.main-nav').css('position', 'absolute');
        $('.header-nav').css('position', 'absolute');
        window.addEventListener('scroll', function(){
          app.Views.Main.fixStatics();
        });
        document.addEventListener('touchend', function(){
          app.Views.Main.fixStatics();
        });
        app.Views.Main.fixStatics();
        app.on('page:change:complete', function(){
          console.log("FIX STATICS!");
          app.Views.Main.fixStatics();
        });
      }

      if (app.functions.lacksInsetShadow()){
        $('.main-nav .nav-shadow').css('display', 'block');
      }

      app.router.run('#!/');
    });
  });
}).call(this);