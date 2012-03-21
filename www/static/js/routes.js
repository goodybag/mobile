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
    console.log("[routes] - landing");
    var landingView  = new app.Views.Landing({
      authModel: new app.Models.EmailAuth()
    });
    $("#container").html(landingView.render().el);
  };

  routes.register = function(){
    console.log("[routes] - register");
    var landingView  = new app.Views.Landing({
      authModel: new app.Models.EmailAuth()
    });
    $("#container").html(landingView.render().el);
    landingView.registerView();
  };

  routes.globalStream = function(){
    var streamsView = new app.Views.Streams({});
    $("#container").html(streamsView.render().el);
    app.router.replaceHash("/#!/streams/global");
    streamsView.loadGlobalActivity();
  }

  routes.myStream = function(){
    var streamsView = new app.Views.Streams({});
    $("#container").html(streamsView.render().el);
    streamsView.loadMyActivity();
  }

  routes.places = function() {
    var placesView = new app.Views.Places({});
    $("#container").html(placesView.render().el);
    placesView.loadPlaces();
  };

  routes.placeDetails = function() {
    api.businesses.getOneEquipped = function(bid, callback){
      api._get('/api/consumers/businesses/' + bid, callback);
    };
    api.businesses.getOneEquipped(this.params.id, function(error, business){
      if(utils.exists(error)){
        console.log(error);
        return;
      };
      var placeDetailsView = new app.Views.PlaceDetails({
        model: new utils.Model(business)
      });
      $("#container").html(placeDetailsView.render().el);
    });
  };

  routes.test = function(){
    console.log("Test Success!");
    var page = new app.Views.TestPage();
    page.render();
    console.log("woot!");
    $.mobile.changePage($(page.el), {changeHash: false, transition: "flip"});
  };

  routes.login = function(){
    console.log("[routes] - register");
    var landingView  = new app.Views.Landing({});
    $("#container").html(landingView.render().el);
    landingView.login();
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

  /* Finish implementation
  routes.logout = function(){
    var self = this;
    app.user = {}; //clean up anything left behind in the cache
    api.auth.logout(function(error,data){
      if(exists(error))
        notify.error(error.message);
      //redirect regardless of error.
      removeGbModals();
      //_kmq.push(['clearIdentity']); //kissmetrics - clear ident
      _kmqRecord('', 'Signed Out');
      self.redirect('#!/');
    });
  };*/

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