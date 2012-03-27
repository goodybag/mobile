(function(){
  this.app = window.app || {};
  this.app.routes = this.app.routes || {};
  var routes = {};
  var $container = $('#container');

  routes.everything = function(){
    console.log("BEFORE EVERYTHING!");
    app.activeRoute.setRoute(this.path);
  };

  routes.afterAll = function(){
    // Add to our previous routes model unless we clicked the back button
    if (app.previousRoutes.get('goingBack')){
      app.previousRoutes.set('goingBack', false);
    }else{
      app.previousRoutes.add(this.path);
    }
  };

  routes.landing = function(){
    console.log("[routes] - landing");
    var landingView  = new app.Views.Landing({
      authModel: new app.Models.EmailAuth()
    });
    $("#content").html(landingView.render().el);
  };

  routes.register = function(){
    console.log("[routes] - register");
    var landingView  = new app.Views.Landing({
      authModel: new app.Models.EmailAuth()
    });
    $("#content").html(landingView.render().el);
    landingView.registerView();
  };

  routes.globalStream = function(){
    var streamsView = new app.Views.Streams({});
    $("#content").html(streamsView.headerRender().el);
    $("#content").append(streamsView.render().el);
    app.router.replaceHash("/#!/streams/global");
    streamsView.loadGlobalActivity();
  };

  routes.myStream = function(){
    var streamsView = new app.Views.Streams({});
    $("#content").html(streamsView.headerRender().el);
    $('#content').append(streamsView.render().el);
    streamsView.loadMyActivity();
  };

  routes.places = function() {
    var placesView = new app.Views.Places({});
    $("#content").html(placesView.render().el);
    placesView.loadPlaces();
  };

  routes.placeDetails = function() {
    api.businesses.getOneEquipped(this.params.id, function(error, business){
      if(utils.exists(error)){
        console.log(error);
        return;
      };
      var placeDetailsView = new app.Views.PlaceDetails({
        model: new utils.Model(business)
      });
      $("#content").html(placeDetailsView.render().el);
    });
  };

  routes.tapIn = function() {
    //consider not using true
    api.auth.session(true, function(error, data){
      if(utils.exists(error)){
        console.log(error);
        return;
      };
      var model = new utils.Model({});
      if (data){
        model.set("barcodeId", data.barcodeId);
      }
      var tapInView = new app.Views.TapIn({
        model: model
      });
    $("#content").html(tapInView.render().el);
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
    console.log("[routes] - login");
    var landingView  = new app.Views.Landing({});
    $("#content").html(landingView.render().el);
    landingView.login();
  };

  routes.logout = function(){
    console.log("[routes] - logout");
    api.auth.logout(function(error, consumer){
      if (utils.exists(error)){
        console.log(error);
        return;
      }
      app.user.clear();
      window.location.replace("/#!/");
    });
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
    console.log('[routes] - goodies');
    $('#content').html(app.templates.goodies());
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
      if (goodies.length == 0){
        $('#content').html(app.templates.noGoodies());
      }else{
        for (var i = 0; i < goodies.length; i++){
          goody = new app.Views.Goody({
            model: new app.Models.Goody(goodies[i])
          });
          goody.render();
          $goodies = $goodies.add($(goody.el));
        }
        $('#goodies-list').html($goodies);
      }
    });
  };

  routes.settings = function(){
    var page = new app.Views.Settings();
    $('#content').html(page.render().el);
  };

  routes.changePassword = function(){
    var page = new app.Views.ChangePassword();
    $('#content').html(page.render().el);
  };

  routes.changeTapIn = function(){
    var page = new app.Views.ChangeTapIn();
    $('#content').html(page.render().el);
  };

  routes.changePicture = function(){
    var page = new app.Views.ChangePicture();
    $('#content').html(page.render().el);
  };

  // Export
  for (var key in routes){
    this.app.routes[key] = routes[key];
  }
})(this);