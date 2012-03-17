(function(){
  this.app = window.app || {};
  this.app.Views = window.app.Views || {};
  var views = {};

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
      var options = {
        email: $("#landing-login-email", this.el).val()
        , password: $("#landing-login-password", this.el).val()
      };

      this.authModel.set(options);
      this.authModel.login();

      event.preventDefault();
      return false;
    }
    , authenticatedHandler: function(){
      var streamsView = new app.Views.Streams({});
      $("#container").html(streamsView.render().el);
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
      return this;
    }
  });

  views.Streams = utils.View.extend({
    className: 'streams'
    , events: {

    }
  });

  // Export
  for (var name in views){
    this.app.Views[name] = views[name];
  }
}).call(this);