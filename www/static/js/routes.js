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
    console.log("Test success!");
  };

  this.app = window.app || {};
  this.app.routes = routes;
})(this);