(function(){
  // Probably put this in utils
  var changePage = function(page){
    $(page.el).attr('data-role', 'page');
    page.render();
    $('body').append($(page.el));
    $.mobile.changePage($(page.el), {changeHash:false});
  };

  var routes = function(){};

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
    console.log("Login Page!");
    var page = new app.Views.LoginPage();
    page.render();
    $('body').append($(page.el));
    $(page.el).page();
    $.mobile.changePage($(page.el), {changeHash: false, transition: "flip"});
  };

  this.app = window.app || {};
  this.app.routes = routes;
})(this);