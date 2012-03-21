(function(){
  this.app.cache = this.app.cache || {};
  this.app.cached = this.app.cached || {};
  // Give our app events -
  // We should do this first so the other files can
  // Emit events too
  Object.merge(this.app, utils.Events);
  // For the api to use
  window.exists = utils.exists;

  //replace app.Views.Main with an instance of itself
  this.app.Views.Main = new this.app.Views.Main();

  $(document).ready(function(){
    app.compileTemplates(function(){
      app.Views.Main.render();
      $('#body').prepend(app.Views.Main.el);
      app.router.run('#!/');
    });
  });
}).call(this);