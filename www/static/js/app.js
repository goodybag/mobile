(function(){
  this.app.cache = this.app.cache || {};
  this.app.cached = this.app.cached || {};
  // Give our app events -
  // We should do this first so the other files can
  // Emit events too
  Object.merge(this.app, utils.Events);
  // For the api to use
  window.exists = utils.exists;

  this.app.changePage = this.app.functions.changePage;

  this.app.user = new this.app.Models.User();
  api.auth.session(function(error, consumer){
    if(exists(error)){
      console.error(error.message);
      return;
    };
    if (utils.exists(consumer)){
      if (window.location.hash){
        window.location.href = window.location.hash;
      }else{
        window.location.href = '#!/streams/global';
      }
      app.user.set(consumer);
    }
  });

  $(document).ready(function(){
    app.compileTemplates(function(){
      app.previousRoutes = new this.app.Models.PreviousRoutes();
      app.activeRoute = new this.app.Models.ActiveRoute();
      app.Views.Main = app.mainView = new this.app.Views.Main();
      app.Views.Main.render();
      $('#body').prepend(app.Views.Main.el);

      app.router.run('#!/');
    });
  });
}).call(this);