(function(){
  this.app = window.app || {};

  app.router = $.sammy("#body", function(){
    this.before(/#!\/.*/, app.routes.everything);

    this.get ('#!/',            app.routes.landing);
    this.get ('#!/login',       app.routes.login);
    this.get ('#!/logout',      app.routes.logout);
    this.get ('#!/email-login', app.routes.emailLogin);
    this.post('#!/email-login', app.routes.emailLoginSubmit);
    this.get ('#!/dashboard',   app.routes.dashboard);
    this.get ('#!/goodies',     app.routes.goodies);
  });
}).call(this);