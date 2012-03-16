(function(){
  this.app.cache = this.app.cache || {};
  this.app.cached = this.app.cached || {};
  Object.merge(this.app, utils.Events);
  // For the api to use
  window.exists = utils.exists;

  $(document).ready(function(){
    app.compileTemplates(function(){
      app.router.run('#!/login');
    });
  });
}).call(this);