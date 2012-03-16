(function(){
  this.app = window.app || {};
  this.app.routes = this.app.routes || {};
  var routes = {};
  var $container = $('#container');

  routes.everything = function(){
    console.log("BEFORE EVERYTHING!");
    // Probably ensure we're logged in and redirect if we're not
  };

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
    $('#container').html(app.templates.login());
  };

  routes.emailLogin = function(){
    $('#container').html(app.templates.emailLogin());
  };

  routes.emailLoginSubmit = function(){
    var login = $('#email-login-form').serializeObject();
    api.auth.login(login, function(error, user){
      if (utils.exists(error)){
        console.log(error);
        return;
      }
      app.router.runRoute('get', '#!/dashboard');
    });
  };

  routes.dashboard = function(){
    $('#container').html(app.templates.dashboard());
  };

  routes.goodies = function(){
    $('#container').html(app.templates.goodies());
    var options = {
      media: 1,
      progress: 1
    };
    api.loyalties.list(options, function(error, loyaltiesProgressAndMedia){
      if(utils.exists(error)){
        console.log(error.message);
        return;
      }
      var goodies   = utils.goodyJoin(loyaltiesProgressAndMedia)
        , $goodies  = $()
        , goody
      ;
      for (var i = 0; i < goodies.length; i++){
        goody = new app.Views.Goody({
          model: new app.Models.Goody(goodies[i])
        });
        goody.render();
        $goodies = $goodies.add($(goody.el));
      }
      $('#goodies-list').html($goodies);
    });
  };

  // Export
  for (var key in routes){
    this.app.routes[key] = routes[key];
  }
})(this);