(function(){
  this.app = window.app || {};
  this.app.Views = window.app.Views || {};
  var views = {};

  views.Main = utils.View.extend({
    className: 'outer-container'
    , id: "container"
    , events : { //for Backbone Views these events are binded to the DOM object, not the view object
    }
    , initialize: function (){
      this.currentFrame = "landingFrame";
      // Setup sub-views
      this.subViews = {
        userHeader: new app.Views.UserHeader(),
        headerNav: new app.Views.HeaderNav({model: app.previousRoutes})
      };
      return this;
    }
    , render: function(){
      $(this.el).html(app.templates.mainFrame());
      $('#header', this.el).append(this.subViews.headerNav.render().el);
      //if (this.currentFrame == "authenticatedFrame"){
        $('#header', this.el).append(this.subViews.userHeader.render().el);
      //}
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
  });

  views.Goody = utils.View.extend({
    className: 'goody',
    initialize: function(){
      return this;
    },
    render: function(){
      $(this.el).html(app.fragments.goody(this.model.toJSON()));
      return this;
    }
  });

  views.Landing = utils.View.extend({
    className: 'page landing'
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
      $("#content").html(registerView.render().el);
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
      $("#content").html(streamsView.render().el);
      streamsView.loadGlobalActivity();
      return this;
    }
  });

  views.HeaderNav = utils.View.extend({
    className: 'header-nav'
    , events: {
      'tap .back': 'backHandler',
      'click .back': 'backHandler'
    }
    , initialize: function(){
      this.model.on("change:routes", this.render, this);
    }
    , render: function(){
      console.log('[render] - HeaderNav');
      $(this.el).html(app.fragments.headerNav(this.model.toJSON()));
      return this;
    }
    , backHandler: function(){
      this.model.pop();
      this.model.set('goingBack', true);
      return this;
    }
  });

  views.UserHeader = utils.View.extend({
    className: 'sub-header profile inline-columns',
    id: "user-header",
    initialize: function(){
      return this;
    },
    render: function(){
      $(this.el).html(app.fragments.userHeader());
      return this;
    }
  });

  views.PageNav = utils.View.extend({
    className: 'sub-nav columns',
    events: {
      'click .left button': 'leftHandler',
      'click .right button': 'rightHandler',
      'tap .left button': 'leftHandler',
      'tap .right button': 'rightHandler'
    },
    initialize: function(options){
      this.buttons = {};
      this.buttons.leftButton = options.leftButton || false;
      this.buttons.rightButton = options.rightButton || false;
    },
    render: function(){
      $(this.el).html(app.fragments.pageNav(this.buttons));
      return this;
    },
    leftHandler: function(){
      if (utils.exists(this.buttons.leftButton.handler)){
        this.buttons.leftButton.handler.call(this);
      }
      return this;
    },
    rightHandler: function(){
      if (utils.exists(this.buttons.rightButton.handler)){
        this.buttons.rightButton.handler.call(this);
      }
      return this;
    }
  });

  views.Register = utils.View.extend({
    className: 'page register'
    , events: {
      'submit #register-form': 'registerHandler'
      , 'click #register-facebook': 'facebookLoginHandler'
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
    , authenticatedHandler: function(){
      var streamsView = new app.Views.Streams({});
      $("#content").html(streamsView.render().el);
      streamsView.loadGlobalActivity();
      return this;
    }
  });

  views.Streams = utils.View.extend({
    className: 'page streams'
    , events: {
      "click #streams-all-button": 'loadGlobalActivity'
      , "click #streams-my-button": 'loadMyActivity'
    }
    , initialize: function(){
      this.pageHeader = new app.Views.PageNav({
        leftButton: {
          id: "streams-all-button",
          text: "All Activity",
          classes: "",
          handler: this.loadGlobalActivity
        },
        rightButton: {
          id: "streams-my-button",
          text: "My Activity",
          classes: "",
          handler: this.loadMyActivity
        }
      });
    }
    , headerRender: function(){
      return this.pageHeader.render();
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

  views.Place = utils.View.extend({
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
      var self = this;
      api.businesses.getOneEquipped(this.model.get("_id"), function(error, business){
        if(utils.exists(error)){
          console.log(error);
          return;
        };

        var placeDetailsView = new app.Views.PlaceDetails({
          model: new utils.Model(business)
        });
        $("#content").html(placeDetailsView.render().el);
        app.router.changeHash("#!/places/"+self.model.get("_id"));
      });
    }
  });

  views.PlaceDetails = utils.View.extend({
    className: 'place-details'
    , events: {
      "click .save" : "createContact"
    }
    , initialize: function(){
    }
    , render: function() {
      $(this.el).html(app.templates.placeDetails(this.model.toJSON()));
      return this;
    }
    , createContact: function(event) {
      console.log("[handler] save contact");
      var $location = $(event.currentTarget).parent();

      var name = new ContactName();
      name.formatted = this.model.get("publicName")+" - "+$(".name", $location).text();
      name.givenName = this.model.get("publicName")+" - "+$(".name", $location).text();;

      var address = new ContactAddress();
      address.pref = true;
      address.streetAddress = $(".street1", $location).text();
      address.type = "work";
      address.streetAddress = $(".street1", $location).text();
      address.locality = $(".city", $location).text();
      address.region = $(".state", $location).text();
      address.postalCode = $(".zip", $location).text();
      address.country = "USA";

      var phoneNumber = new ContactField('work', $(".phone", $location).text(), true);

      var contact = navigator.contacts.create();
      contact.name = name;
      contact.phoneNumbers = [phoneNumber];
      contact.addresses = [address];

      contact.save(function(){alert('Contact Saved');}, function(){alert('Error Saving Contact');});
    }
  });

  views.TapIn = utils.View.extend({
    className: 'tap-in'
    , events: {
      "click .save" : "saveCode"
      , "click .create" : "createCode"
    }
    , initialize: function(){
    }
    , render: function(){
      $(this.el).html(app.templates.tapIn({barcodeId: this.model.get("barcodeId")}));
      $(".qrcode", this.el).qrcode({width: 200,height: 200,text: this.model.get("barcodeId")});
      return this;
    }
    , saveCode: function(){
      var self = this;
      var barcodeId = $("#tap-in-existing-barcodeId", this.el).val();
      api.auth.updateBarcodeId({barcodeId: barcodeId}, function(error, data){
        if(utils.exists(error)){
          alert(error.message);
          return;
        };
        if(data === true){
          self.model.set("barcodeId", barcodeId);
          $("#content").html(self.render().el);
        } else {
          alert("There was an error linking your barcode");
        }
      })
    }
    , createCode: function(){
      var self = this;
      api.barcodes.create(function(error, barcode){
        if(utils.exists(error)){
          console.log(error);
          return;
        };
        self.model.set("barcodeId", barcode.barcodeId);
        $("#content").html(self.render().el);
      });
    }
  })

  // Export
  for (var name in views){
    this.app.Views[name] = views[name];
  }
}).call(this);