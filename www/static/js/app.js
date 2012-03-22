(function(){
  this.app.cache = this.app.cache || {};
  this.app.cached = this.app.cached || {};
  // Give our app events -
  // We should do this first so the other files can
  // Emit events too
  Object.merge(this.app, utils.Events);
  // For the api to use
  window.exists = utils.exists;

  this.app.previousRoutes = new this.app.Models.PreviousRoutes();
  this.app.activeRoute = new this.app.Models.ActiveRoute();
  this.app.Views.Main = new this.app.Views.Main();

  this.app.user = new this.app.Models.User();

  $(document).ready(function(){
    app.compileTemplates(function(){
      app.Views.Main.render();
      $('#body').prepend(app.Views.Main.el);
      app.router.run('#!/');
    });
  });
}).call(this);