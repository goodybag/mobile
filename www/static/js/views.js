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
        userHeader: new app.Views.UserHeader({model: app.user}),
        headerNav: new app.Views.HeaderNav({model: app.previousRoutes}),
        footerNav: new app.Views.FooterNav({model: app.activeRoute})
      };

      return this;
    }
    , render: function(){
      $(this.el).html(app.templates.mainFrame());
      $('#header', this.el).append(this.subViews.headerNav.render().el);
      $('#header', this.el).append(this.subViews.userHeader.render().el);
      console.log(this.subViews.footerNav);
      $('#footer', this.el).html(this.subViews.footerNav.render().el);
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

  views.NoGoodies = utils.View.extend({
    className: 'page no-goodies',
    initialize: function(){
      return this;
    },
    render: function(){
      $(this.el).html(app.fragments.noGoodies());
      return this;
    }
  });

  views.Goodies = utils.View.extend({
    className: 'page goodies',
    initialize: function(){
      return this;
    },
    render: function(){
      $(this.el).html(app.templates.goodies());
      return this;
    },
    addGoody: function(goody){
      goody.render();
      $('#goodies-list', $(this.el)).append($(goody.el));
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

      app.changePage(function(done){
        var registerView = new app.Views.Register({
          authModel: new app.Models.EmailAuth()
        });
        registerView.render();
        done(registerView);
      });
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
              app.user.set(consumer);
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
      app.changePage(function(done){
      var streamsView = new app.Views.Streams({
        collection: app.api.activity
      }).render();
      app.api.activity.fetchGlobal({add: true}, function(error,data){
        if (utils.exists(error)){
          console.error(error.message);
          return;
        }
        done(streamsView);
      });
    });
    }
  });

  views.FooterNav = utils.View.extend({
    tagname: 'nav',
    className: 'main-nav',
    initialize: function(){
      this.model.on('change', this.updateActive, this);
    },
    render: function(){
      $(this.el).html(app.fragments.footerNav());
      this.updateActive();
      return this;
    },
    updateActive: function(){
      $('.menu-item').removeClass('active');
      if (this.model.get('active')){
        $('.menu-item.' + this.model.get('active')).addClass('active');
      }
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
      this.model.on("change", this.render, this);
      return this;
    },
    render: function(){
      console.log('[render] - UserHeader');
      $(this.el).html(app.fragments.userHeader(this.model.toJSON()));
      $newImages = $("img.picture", this.el);
      $newImages.error(function(){
        $(this).attr('src',"https://goodybag-uploads.s3.amazonaws.com/consumers/000000000000000000000000-85.png");
      });
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
        this.buttons.leftButton.handler();
      }
      return this;
    },
    rightHandler: function(){
      if (utils.exists(this.buttons.rightButton.handler)){
        this.buttons.rightButton.handler();
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
        , email: $("#register-email-address", this.el).val()
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
              app.user.set(consumer);
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
      $("#content").html(streamsView.headerRender().el);
      $("#content").append(streamsView.render().el);
      streamsView.loadGlobalActivity();
      return this;
    }
  });

  views.Streams = utils.View.extend({
    events: {
      "click #streams-all-button": 'loadGlobalActivity'
      , "click #streams-my-button": 'loadMyActivity'
    }
    , initialize: function(){
      this.pageContent = new app.Views.StreamsPage({
        collection: this.collection
      });

      this.pageHeader = new app.Views.PageNav({
        leftButton: {
          id: "streams-all-button",
          text: "All Activity",
          classes: "",
        },
        rightButton: {
          id: "streams-my-button",
          text: "My Activity",
          classes: "",
        }
      });

      this.subViews = [this.pageHeader, this.pageContent];

      return this;
    }
    , render: function(){
      console.log(this.subViews);
      for (var i = 0; i < this.subViews.length; i++){
        $(this.el).append(this.subViews[i].render().el);
      }
      return this;
    }
    , loadGlobalActivity: function(){
      this.pageContent.loadGlobalActivity();
      return this;
    }
    , loadMyActivity: function(){
      this.pageContent.loadMyActivity();
      return this;
    }
  });

  views.StreamsPage = utils.View.extend({
    className: 'page streams'
    , initialize: function(){
      console.log("[StreamsPage] - initialize");
      console.log(this.collection);
      this.collection.on('reset', this.renderActivity, this);
      this.collection.on('add', this.renderSingleActivity, this);
    }
    , headerRender: function(){
      console.log("[Streams] - Render page header");
      return this.pageHeader.render();
    }
    , render: function(){
      $(this.el).append(app.templates.streams());
      return this;
    }
    , renderActivity: function(){
      console.log('[Streams] - renderActivity');
      var models = this.collection.models;
      console.log(models);
      $('#streams-activities', $(this.el)).html("");
      for (var i = 0; i < models.length; i++){
        this.renderSingleActivity(models[i]);
      }
      return this;
    }
    , renderSingleActivity: function(activity){
      console.log('[Streams] - renderSingleActivity');
      console.log(activity.toJSON());
      var activityView = new app.Views.Activity({
        model: activity
      }).render();
      console.log(activityView.el);
      $('#streams-activities', $(this.el)).append(activityView.el);
      return this;
    }
    , loadGlobalActivity: function(){
      var self = this;
      app.changePage(function(done){
        $('#streams-activities', this.el).html("");
        this.collection.fetchGlobal({add: true}, function(error){
          if (utils.exists(error)){
            console.error(error.message);
            return;
          }
          done(self);
        });
      });
    }
    , loadMyActivity: function(){
      var self = this;
      console.log(self.collection);
      app.changePage(function(done){
        $('#streams-activities', self.el).html("");
        self.collection.fetchSelf({add: true}, function(error){
          if (utils.exists(error)){
            console.error(error.message);
            return;
          }
          done(self);
        });
      });
      return this;
    }
    /*, loadGlobalActivityOld: function(){
      console.log("[handler] streams-loadGlobalActivity");
      app.router.changeHash("/#!/streams/global");
      var self = this;
      api.streams.global(function(error, stream){
        if(exists(error)){
          console.error(error.message);
          return;
        }

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
    , loadMyActivityOld: function(){
      console.log("[handler] streams-loadMyActivity");
      var self = this;
      app.router.changeHash("/#!/streams/me");
      api.streams.self(function(error, stream){
        if(exists(error)){
          console.error(error.message);
          return;
        };

        console.log(self.el);
        var $activitiesContainer = $("#streams-activities", self.el);
        console.log($activitiesContainer);

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
    }*/
  });

  views.Activity = utils.View.extend({
    initialize: function(){
      return this;
    },
    render: function(){
      $(this.el).html(app.fragments.activity(this.model.toJSON()));
      return this;
    }
  });

  views.Places = utils.View.extend({
    className: 'page places'
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
          $newImages = $("img.picture", this.el);
          $newImages.error(function(){
            $(this).attr('src',"https://s3.amazonaws.com/goodybag.com/default-85.jpg");
          });
        }
      });
    }
  });

  views.Place = utils.View.extend({
    className: 'inline-columns place'
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
    className: 'page place-details'
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
    className: 'page tap-in'
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
          console.log(error);
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
  });

  views.Settings = utils.View.extend({
    className: 'page settings'
    , events: {
      "click #settings-logout": "logout"
    }
    , initialize: function(){ return this; }
    , render: function(){
      $(this.el).html(app.templates.settings());
      return this;
    }
    , logout: function(){
      window.location.href = "/#!/logout";
      return this;
    }
  });

  views.ChangePassword = utils.View.extend({
    className: 'page change-password',
    events: {
      'submit #settings-change-password-form': 'formHandler'
    },
    render: function(){
      $(this.el).html(app.templates.changePassword());
      return this;
    },
    formHandler: function(e){
      e.preventDefault();
      e.stopPropagation();
      // Do your thang
      return false;
    }
  });

  views.ChangeTapIn = utils.View.extend({
    className: 'page change-tapin',
    events: {
      'submit #settings-change-tapin-form': 'formHandler'
    },
    render: function(){
      $(this.el).html(app.templates.changeTapIn());
      return this;
    },
    formHandler: function(e){
      e.preventDefault();
      e.stopPropagation();
      // Do your thang
      return false;
    }
  });

  views.ChangePicture = utils.View.extend({
    className: 'page change-picture',
    events: {
      'click #change-picture-choose' : 'choosePic'
    },
    render: function(){
      $(this.el).html(app.templates.changePicture());
      return this;
    },
    choosePic: function(){
      var self = this;

      if(!app.user || !app.user.get("_id") || app.user.get("_id") == null || app.user.get("_id") == ""){
        alert("Please login first");
        window.location.href = "/#!/logout";
        return;
      };

      navigator.camera.getPicture(
        uploadPhoto,
        function(message){
          //alert('get picture failed or you clicked cancel');
        },
        { quality: 50,
          destinationType: navigator.camera.DestinationType.FILE_URI,
          sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY
        }
      );

      function uploadPhoto(imageURI) {
        var options = new FileUploadOptions();
        options.fileKey="file";
        options.fileName=imageURI.substr(imageURI.lastIndexOf('/')+1);
        options.mimeType="image/jpeg";

        var userId = app.user.get("_id");
        options.params = {
          'params': JSON.stringify({
            'auth': {
              'key': "5a93b0ae8fae41699bd720cb34e63623"
            },
            'template_id': "dbdc34e64b9348c881351ea714fce75e",
            'notify_url': "http://biz.goodybag.com/hooks/transloadit",
            'steps': {
              'export85': {
                "path": "consumers/"+userId+"-85.png"
              },
              'export128': {
                "path": "consumers/"+userId+"-128.png"
              },
              'export85Secure': {
                'path': "consumers-secure/"+userId+"-85.png"
              },
              'export128Secure': {
                'path': "consumers-secure/"+userId+"-128.png"
              }
            }
          })
        };

        var ft = new FileTransfer();
        ft.upload(imageURI, "http://api2.transloadit.com/assemblies", success, fail, options);
        $("#change-picture-choose", this.el).text("Uploading").attr("disabled", true);
      };

      function success(r) {
        console.log("Code = " + r.responseCode);
        console.log("Response = " + r.response);
        console.log("Sent = " + r.bytesSent);
        var response = JSON.parse(r.response);
        $("#change-picture-choose", self.el).text("Choose Photo").attr("disabled", false);
        $("#user-header .picture").attr("src", response.uploads[0].url);
      };

      function fail(error) {
        alert("An error has occurred: Code = " = error.code);
      };
    }
  });

  // Export
  for (var name in views){
    this.app.Views[name] = views[name];
  }
}).call(this);