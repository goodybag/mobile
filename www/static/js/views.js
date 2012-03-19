(function(){
  this.app = window.app || {};
  this.app.Views = window.app.Views || {};
  var views = {};

  views.Main = utils.View.extend({
    className: 'main'
    , events : { //for Backbone Views these events are binded to the DOM object, not the view object
    }
    , initialize: function (){
      this.currentFrame = "landingFrame";
      return this;
    }
    , authenticatedFrame: function(callback){
      console.log("[change-frame] authenticated");
      if(this.currentFrame == "authenticatedFrame") return;
      this.currentFrame = "authenticatedFrame";

      if(utils.exists(callback)){
        callback();
      }
      return this;
    }
    , landingFrame: function(callback){
      console.log("[change-frame] landing");
      if(this.currentFrame == "landingFrame") return;
      this.currentFrame = "landingFrame";


      if(utils.exists(callback)){
        callback();
      }
      return this;
    }
  })

  views.Goody = utils.View.extend({
    className: 'goody',
    events: {
      'click': 'goodyClick'
    },
    initialize: function(){
      return this;
    },
    render: function(){
      $(this.el).html(app.fragments.goody(this.model.toJSON()));
      return this;
    },
    goodyClick: function(e){
      console.log("GOODY CLICKED!!!!!!!!");
      return this;
    }
  });

  views.Landing = utils.View.extend({
    className: 'landing'
    , events: {
      'click #landing-register-button': 'registerView'
      , 'click #landing-login-facebook-button': 'facebookLoginHandler'
      , 'submit #landing-login-form': 'emailLoginHandler'
    }
    , initialize: function(){
      this.authModel = this.options.authModel;
      this.authModel.on("authenticated", this.authenticatedHandler, this);
      return this;
    }
    , render: function(){
      $(this.el).html(app.templates.landing({}));
      return this;
    }
    , registerView: function(){
      console.log("[view] landing-register");
      event.preventDefault();
      app.router.changeHash("/#!/register");

      var registerView = new app.Views.Register({
        authModel: new app.Models.EmailAuth()
      });
      $("#container").html(registerView.render().el);
      return this;
    }
    , facebookLoginHandler: function(){
      var self = this;
      FB.login(function(response){
        if(response.session){
          var accessToken = response.session.access_token;
          FB.api('/me', function(response) {
            api.auth.facebook(accessToken,function(error,consumer){
              if(utils.exists(error)){
                console.log(error);
                return;
              }
              console.log("[facebook] authenticated");
              app.Views.Main.authenticatedFrame(function(){
                self.authenticatedHandler();
              });
            });
          });
        } else{
          console.log("[facebook] error authenticating");
        }
      }
      , {
        perms: "email, user_birthday, user_likes, user_interests, user_hometown, user_location, user_activities, user_work_history, user_education_history, friends_location"
      });
    }
    , emailLoginHandler: function(){
      console.log("[handler] landing-email-login");
      var options = {
        email: $("#landing-login-email", this.el).val()
        , password: $("#landing-login-password", this.el).val()
      };

      this.authModel.set(options);
      this.authModel.login();

      return false;
    }
    , authenticatedHandler: function(){
      console.log("[handler] landing-authenticated");
      var streamsView = new app.Views.Streams({});
      $("#container").html(streamsView.render().el);
      streamsView.loadGlobalActivity();
      return this;
    }
  });

  views.Register = utils.View.extend({
    className: 'register'
    , events: {
      'submit #register-form': 'registerHandler'
    }
    , initialize: function(options){
      this.authModel = this.options.authModel;
      this.authModel.on("authenticated", this.authenticatedHandler, this);
      return this;
    }
    , render: function(){
      $(this.el).html(app.templates.register({}));
      return this;
    }
    , registerHandler: function(){
      var options = {
        firstName: $("#register-first-name", this.el).val()
        , lastName: $("#register-last-name", this.el).val()
        , email: $("#register-email-name", this.el).val()
        , password: $("#register-password", this.el).val()
      };
      if(options.password != $("#register-password-repeat", this.el).val()){
        alert("passwords don't match");
        return false;
      };

      this.authModel.set(options);
      this.authModel.register();

      event.preventDefault();
      return false;
    }
    , authenticatedHandler: function(){
      var streamsView = new app.Views.Streams({});
      $("#container").html(streamsView.render().el);
      streamsView.loadGlobalActivity();
      return this;
    }
  });

  views.Streams = utils.View.extend({
    className: 'streams'
    , events: {
      "click #streams-all-button": 'loadGlobalActivity'
      , "click #streams-my-button": 'loadMyActivity'
    }
    , initialize: function(){
    }
    , render: function(){
      $(this.el).html(app.templates.streams());
      return this;
    }
    , loadGlobalActivity: function(){
      app.router.changeHash("/#!/streams/global");
      var self = this;
      api.streams.global(function(error, stream){
        if(exists(error)){
          notify.error(error.message);
          return;
        };

        var $activitiesContainer = $("#streams-activities", self.el);

        $activitiesContainer.html("");

        var sentences = "";
        for(var i=0; i<stream.length; i++){
          sentences += streamParser.render(stream[i]);
          //$(sentence).css("opacity", "0").appendTo($dashboardActivityFeed).delay(100*i).animate({opacity:1}, 250, "swing");
        }
        var $sentences = $(sentences);
        $activitiesContainer.append($sentences);
        $newImages = $("img.picture",$sentences);
        $newImages.error(function(){
          //since profile pictures are assumed to be s3/<id...>.png
          //if the picture is not found we will replace it with the default goodybag pic
          $(this).attr('src',"https://goodybag-uploads.s3.amazonaws.com/consumers/000000000000000000000000-85.png");
        });
      });
    }
    , loadMyActivity: function(){
      var self = this;
      app.router.changeHash("/#!/streams/me");
      api.streams.self(function(error, stream){
        if(exists(error)){
          notify.error(error.message);
          return;
        };

        var $activitiesContainer = $("#streams-activities", self.el);

        $activitiesContainer.html("");

        var sentences = "";
        for(var i=0; i<stream.length; i++){
          sentences += streamParser.render(stream[i]);
          //$(sentence).css("opacity", "0").appendTo($dashboardActivityFeed).delay(100*i).animate({opacity:1}, 250, "swing");
        }
        var $sentences = $(sentences);
        $activitiesContainer.append($sentences);
        $newImages = $("img.picture",$sentences);
        $newImages.error(function(){
          //since profile pictures are assumed to be s3/<id...>.png
          //if the picture is not found we will replace it with the default goodybag pic
          $(this).attr('src',"https://goodybag-uploads.s3.amazonaws.com/consumers/000000000000000000000000-85.png");
        });
      });
    }
  });

  views.Places = utils.View.extend({
    className: 'places'
    , events: {

    }
    , initialize: function(){
    }
    , render: function(){
      //$(this.el).html(app.templates.places());
      return this;
    }
    , loadPlaces: function(){
      var self = this;
      api.businesses.listEquipped(function(error, businesses){
        //ideally we would want to create a model for each business
        for (var i=0, length=businesses.length; i<length; i++){
          var placeView = new app.Views.Place({
            model: new utils.Model(businesses[i])
          })
          $(self.el).append(placeView.render().el);
        }
      });
    }
  });

  view.Place = utils.View.extend({
    className: 'place'
    , events: {
      'click .view-details': 'viewDetails'
    }
    , initialize: function(){
    }
    , render: function() {
      $(this.el).html(app.fragments.place(this.model.toJSON()));
      return this;
    }
    , viewDetails: function(){
      /* display business details */
      var placeDetailsView = new app.Views.Place({
        model: this.model
      });
      app.router.changeHash("#!/places/"+this.model._id);
    }
  });

  views.PlaceDetails = utils.View.extend({
    className: 'place-details'
    , events: {
    }
    , initialize: function(){
    }
    , render: function() {
      $(this.el).html(app.templates.placeDetails(this.model.toJSON()));
      return this;
    }
  })

  // Export
  for (var name in views){
    this.app.Views[name] = views[name];
  }
}).call(this);