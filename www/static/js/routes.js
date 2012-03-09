(function(){
  this.app = window.app || {};
  this.app.routes = this.app.routes || {};
  var routes = {};

  routes.landing = function(){
    console.log("Hello World!");
  };

  routes.test = function(){
    console.log("Test Success!");
    var page = new app.Views.TestPage();
    page.render();
    console.log("woot!");
    $.mobile.changePage($(page.el), {changeHash: false, transition: "flip"});
  };

  routes.login = function(){
    utils.changePage(new app.Views.LoginPage());
  };

  routes.emailLogin = function(){
    var page = new app.Views.EmailLoginPage({
      model: app.user
    });
    utils.changePage(page);
  };

  routes.emailLoginSubmit = function(){
    console.log("SSSSSUUUUUBBMITTT!!!");

    console.log($('#email-login-form').serializeObject());
  };

  // Export
  for (var key in routes){
    this.app.routes[key] = routes[key];
  }
})(this);