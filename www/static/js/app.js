$(document).ready(function(){
  this.app.cache = this.app.cache || {};
  this.app.cached = this.app.cached || {};
  this.app.user = this.app.user || new this.app.Models.Auth();
  // For the api to use
  window.exists = utils.exists;

  app.compileTemplates(function(){
    // Figure out what route to go to
    app.redirect('login');
  });

  //
  $(document).on('pagebeforechange', function(e, data){
    // Only on url updates, not jquery elements
    if (typeof data.toPage === "string") {
      if (data.pages[data.toPage].isReady())
      e.preventDefault();
      var url = app.config.pushState
                ? $('<a/>').attr('href',data.toPage)[0].pathname
                : data.toPage.split('#')[1];
      console.log(url);
      app.router.navigate(url, {trigger: true});
    }
  });
}).call(this);