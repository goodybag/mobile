(function(){
  this.app = window.app || {};

  app.router = $.sammy("#body", function(){
    this.before(/#!\/.*/, app.routes.everything);

    this.get ('#!/',                    app.routes.landing);
    this.get ('#!/login',               app.routes.login);
    this.get ('#!/register',            app.routes.register);
    this.get ('#!/logout',              app.routes.logout);
    this.get ('#!/streams',             app.routes.globalStream);
    this.get ('#!/streams/global',      app.routes.globalStream);
    this.get ('#!/streams/me',          app.routes.myStream);
    this.get ('#!/places',              app.routes.places);
    this.get ('#!/goodies',             app.routes.goodies);
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