(function(){
  this.app = window.app || {};

  app.router = $.sammy("#body", function(){
    this.before(/#!\/.*/, app.routes.everything);
    this.after(app.routes.afterAll);

    this.get ('#!/',                            app.routes.landing);
    this.get ('#!/login',                       app.routes.login);
    this.get ('#!/register',                    app.routes.register);
    this.get ('#!/logout',                      app.routes.logout);
    this.get ('#!/tapin',                       app.routes.tapIn);
    this.get ('#!/streams',                     app.routes.globalStream);
    this.get ('#!/streams/global',              app.routes.globalStream);
    this.get ('#!/streams/me',                  app.routes.myStream);
    this.get ('#!/places',                      app.routes.places);
    this.get ('#!/places/:id',                  app.routes.placeDetails);
    this.get ('#!/goodies',                     app.routes.goodies);
    this.get ('#!/settings',                    app.routes.settings);
    this.get ('#!/settings/change-password',    app.routes.changePassword);
    this.get ('#!/settings/change-tapin',       app.routes.changeTapIn);
    this.get ('#!/settings/change-picture',     app.routes.changePicture);
  });

  app.router.changeHash = function(hash){
    if (hash.indexOf("/") != 0){
      hash = "/"+hash;
    }
    if (hash == app.router.last_location[1]){
      return;
    }
    app.router.last_location = ["get", hash];
    window.location.href = hash;
    app.previousRoutes.add(hash);
  };

  app.router.replaceHash = function(hash){
    if (hash.indexOf("/") != 0){
      hash = "/"+hash;
    }
    if (hash == app.router.last_location[1]){
      return;
    }
    app.router.last_location = ["get", hash];
    window.location.replace(hash);
  };
}).call(this);