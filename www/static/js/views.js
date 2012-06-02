(function(){
  this.app = window.app || {};
  this.app.Views = window.app.Views || {};
  var views = {};

  views.Main = utils.View.extend({
    className: 'outer-container'
    , id: "container"
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
      $('#header').html(this.subViews.headerNav.render().el);
      $('#footer').html(this.subViews.footerNav.render().el);
      if (app.functions.lacksPositionStatic()){
        var $content = $(this.el).find('#content');
        $content.wrap($('<div id="wrapper"><div id="scroller"></div></div>'));
        $(this.el).find('#scroller').prepend(this.subViews.userHeader.render().el);
        $content.css('padding-bottom', '100px');
      }else{
        $('#header').append(this.subViews.userHeader.render().el);
        this.subViews.userHeader.$el.css('margin-top', '50px');
      }
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
    , fixStatics: function(){
        $('.header-nav').css({
          top: window.pageYOffset + 'px'
        });
        $('.main-nav').css({
          top: (window.pageYOffset + window.innerHeight - $('.main-nav').height()) + 'px'
        });
      }
  });

  views.NoGoodies = utils.View.extend({
    className: 'page no-goodies',
    initialize: function(){
      return this;
    },
    render: function(){
      $(this.el).html(app.templates.noGoodies());
      return this;
    }
  });

  views.GoodiesComingSoon = utils.View.extend({
    className: 'page goodies-coming-soon'
  , render: function(){
      this.el.innerHTML = app.templates.goodiesComingSoon();
      return this;
    }
  });

  // Now incomplete until we fix API shtuff
  views.Goodies = utils.View.extend({
    className: 'page goodies',
    initialize: function(options){
      this.goodies = options.goodies;
      return this;
    },
    render: function(){
      $(this.el).html(app.templates.goodies());
      var $el = $(this.el).find('#goodies-list');
      for (var i = 0; i < this.goodies.length; i++){
        $el.append(
          new app.Views.Goody({
            json: this.goodies[i]
          }).render().el
        );
      }
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
    initialize: function(options){
      this.json = options.json;
      return this;
    },
    render: function(){
      $(this.el).html(app.fragments.goody(this.json));
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
      this.authModel.on('auth:fail', this.authFailHandler, this);
      this.loggingIn = false;
      return this;
    }
    , render: function(){
      $(this.el).html(app.templates.landing({}));
      this.delegateEvents();
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
        app.Views.Main.landingFrame();
      });
      return this;
    }
    , facebookLoginHandler: function(){
      if (this.loggingIn) return;
      var self = this;
      this.loggingIn = true;

      FB.login(function(response){
        if (response.session){
          app.functions.setFbAccessToken(
            response.session.access_token
          , response.session.expires
          );
        }else{
          app.functions.setFbAccessToken(
            response.authResponse.app.accessToken
          , response.authResponse.app.expires
          );
        }
        api.auth.facebook(app.facebook.access_token, function(error, consumer){
          if(utils.exists(error)){
            console.log(error);
            return;
          }
          app.user.set(consumer);
          app.Views.Main.authenticatedFrame(function(){
            self.authenticatedHandler();
          });
        })
      }, {
        perms: "email, user_birthday, user_likes, user_interests, user_hometown, user_location, user_activities, user_work_history, user_education_history, friends_location",
        scope: "email, user_birthday, user_likes, user_interests, user_hometown, user_location, user_activities, user_work_history, user_education_history, friends_location"
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
      window.location.href = "/#!/streams/global";
    }
    , authFailHandler: function(error){
      var errorView = new app.Views.LoginError({
        error: error
      });
      $('.errors', $(this.el)).replaceWith(errorView.render().el);
    }
  });

  views.LoginError = utils.View.extend({
    className: 'errors',
    initialize: function(attr){
      this.error = attr.error;
      return this;
    },
    render: function(){
      $(this.el).html(app.fragments.loginError(this.error));
      return this;
    }
  });

  views.FooterNav = utils.View.extend({
    tagName: 'nav',
    className: 'main-nav',
    id: 'main-nav',
    events: {
      'click a': 'anchorClick'
    },
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
  , anchorClick: function(e){
      // This is necessary for android to work for some reason
      // DON'T TAKE IT AGAIN, JOHN! -john
      window.location.href = e.target.href;
      return false;
    }
  });

  views.HeaderNav = utils.View.extend({
    className: 'header-nav'
    , id: 'header-nav'
    , events: {
      'tap .back': 'backHandler',
      'click .back': 'backHandler'
    }
    , initialize: function(){
      this.model.on("change:routes", this.render, this);
    }
    , render: function(){
      console.log('[render] - HeaderNav');
      $(this.el).html(app.fragments.headerNav({last: this.model.canGoBack()}));
      return this;
    }
    , backHandler: function(){
      if (this.model.canGoBack()){
        var route = this.model.back();
        this.model.set('goingBack', true);
        window.location.href = route;
        this.render();
      }
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
        , screenName: $('#register-screen-name', this.el).val()
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
        if(response.session || response.authResponse){
          var accessToken;
          if(response.session){
            accessToken = response.session.access_token
          } else{
            accessToken = response.authResponse.accessToken;
          }
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
        perms: "email, user_birthday, user_likes, user_interests, user_hometown, user_location, user_activities, user_work_history, user_education_history, friends_location",
        scope: "email, user_birthday, user_likes, user_interests, user_hometown, user_location, user_activities, user_work_history, user_education_history, friends_location"
      });
    }
    , authenticatedHandler: function(){
      window.location.href = "/#!/streams/global";
    }
  });

  views.Streams = utils.View.extend({
    events: {
      "click #streams-all-button": 'loadGlobalActivity'
    , "click #streams-my-button": 'loadMyActivity'
    }
    , initialize: function(){
      console.log("[Streams View] - Initialize");
      this.pageContent = new app.Views.StreamsPage({
        collection: this.collection
      });
      console.log("[Streams View] - page Content Set");

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
      console.log("[Streams View] - Page Header set");

      this.subViews = [this.pageHeader, this.pageContent];

      //this.collection.on('reset', this.renderActivity, this);
      this.collection.on('add', this.renderSingleActivity, this);
      console.log("[Streams View] - Initialize Complete");
      return this;
    }
    , render: function(){
      console.log("[Streams View] - Rendering");
      console.log(this.subViews.length);
      for (var i = 0; i < this.subViews.length; i++){
        console.log("[Streams View] - Rendering view " + i);
        $(this.el).append(this.subViews[i].render().el);
      }
      console.log("[Streams View] - Render complete");
      //Called in route now this.pageContent.renderActivity();
      return this;
    }
    , renderActivity: function(){
      this.pageContent.renderActivity();
      return this;
    }
    , renderSingleActivity: function(activity){
      this.pageContent.renderSingleActivity(activity);
    }
    , loadGlobalActivity: function(){
      window.location.href = '/#!/streams/global';
      return this;
    }
    , loadMyActivity: function(){
      window.location.href = '/#!/streams/me';
      return this;
    }
  });

  views.StreamsPage = utils.View.extend({
    className: 'page streams'
    , initialize: function(){
      return this;
    }
    , headerRender: function(){
      console.log("[Streams] - Render page header");
      return this.pageHeader.render();
    }
    , render: function(){
      $(this.el).html(app.templates.streams());
      return this;
    }
    , renderActivity: function(){
      console.log('[Streams] - renderActivity');
      var models = this.collection.models;
      $('#streams-activities', $(this.el)).html("");
      if (models.length == 0){
        $(this.el).html(app.templates.streamsNone());
        return this;
      }
      for (var i = 0; i < models.length; i++){
        this.renderSingleActivity(models[i]);
      }
      return this;
    }
    , renderSingleActivity: function(activity){
      var activityView = new app.Views.Activity({
        model: activity
      }).render();
      $('#streams-activities', $(this.el)).append(activityView.el);
      return this;
    }
  });

  views.Activity = utils.View.extend({
    initialize: function(){
      this.pictureRendered = false;
      this.pictureSourceNotFound = false;
      return this;
    }
  , render: function(){
      $(this.el).html(app.fragments.activity(this.model.toJSON()));
      if (!this.pictureRendered && !this.pictureSourceNotFound){
        this.picture = document.createElement('img');
        this.picture.src = app.config.consumerPicture.replace('{{id}}', this.model.attributes.who.id || this.model.attributes.who.screenName);
        console.log("[Attempting Picture] - " + this.picture.src);
        this.picture.onload = this.renderPicture.bind(this);
        this.picture.onerror = this.pictureLoadError.bind(this);
      }
      return this;
    }
  , renderPicture: function(){
      $(this.el).find('.picture').attr('src', this.picture.src);
    }
  , pictureLoadError: function(){
      this.pictureSourceNotFound = true;
    }
  });

  views.Places = utils.View.extend({
    className: 'page places'
    , events: {

    }
    , initialize: function(){
    }
    , render: function(){
      return this;
    }
    , loadPlaces: function(options, callback){
      if (Object.isFunction(options)){
        callback = options;
        options = {};
      }
      var self = this;
      api.businesses.listEquipped(options, function(error, businesses){
        if (utils.exists(error)){
          callback(error);
          return;
        }
        for (var i=0, length=businesses.length; i<length; i++){
          var placeView = new app.Views.Place({
            model: new utils.Model(businesses[i])
          })
          $(self.el).append(placeView.render().el);
        }
        $newImages = $("img.picture", $(self.el));
        $newImages.error(function(){
          $(this).attr('src',"https://s3.amazonaws.com/goodybag.com/default-85.jpg");
        });
        callback(error, businesses);
      });
    }
  });

  views.Place = utils.View.extend({
    className: 'inline-columns place push-link'
    , events: {
        'click': 'viewDetails'
      }
    , render: function() {
      $(this.el).html(app.fragments.place(this.model.toJSON()));
      return this;
    }
    , viewDetails: function(){
      /* display business details */
      var self = this;
      app.changePage(function(done){
        api.businesses.getOneEquipped(self.model.get('_id'), function(error, business){
          if(utils.exists(error)){
            console.log(error);
            return;
          };
          var placeDetailsView = new app.Views.PlaceDetails({
            model: new utils.Model(business)
          });
          app.router.changeHash("#!/places/"+self.model.get("_id"));
          done(placeDetailsView.render());
        });
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

      contact.save();
    }
  });

  views.TapIn = utils.View.extend({
    className: 'page tap-in'
    , events: {
      "click .save" : "saveCode"
      , "click .create" : "createCode"
    }
    , initialize: function(options){
      this.barcodeId = options.barcodeId;
      return this;
    }
    , render: function(){
      $(this.el).html(app.templates.tapIn({barcodeId: this.barcodeId}));
      $(".qrcode", this.el).qrcode({width: 200,height: 200,text: this.barcodeId});
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
          self.barcodeId = data.barcodeId;
          app.user.set('barcodeId', self.barcodeId);
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
        self.barcodeId = barcode.barcodeId;
        app.user.set('barcodeId', self.barcodeId);
        $("#content").html(self.render().el);
      });
    }
  });

  views.Settings = utils.View.extend({
    className: 'page settings'
    , events: {
      "click #settings-logout": "logout"
    }
    , initialize: function(){
      this.logout.bind(this);
      return this;
    }
    , render: function(){
      $(this.el).html(app.templates.settings());
      this.delegateEvents();
      return this;
    }
    , logout: function(){
      app.user.logout();
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

      var formData  = $('#settings-change-password-form').serializeObject()
        , self      = this
      ;
      if (formData.newPassword != formData.again){
        var errorView = new app.Views.LoginError({
          error: {
            friendlyMessage: "Passwords do not match"
          }
        });
        $('.errors', $(this.el)).replaceWith(errorView.render().el);
        return false;
      }
      api.auth.updatePassword(formData, function(error){
        if (utils.exists(error)){
          var errorView = new app.Views.LoginError({
            error: error
          });
          $('.errors', $(self.el)).replaceWith(errorView.render().el);
          return false;
        }
        app.changePage(function(done){
          var successPage = new app.Views.ChangePasswordSuccess();
          successPage.render();
          done(successPage);
        });
      });
      return false;
    }
  });

  views.GenericPage = utils.View.extend({
    className: 'page',
    initialize: function(options){
      this.options = options || {};
      if (utils.exists(this.options.classes)){
        $(this.el).addClass(this.options.classes);
      }
      return this;
    },
    render: function(){
      $(this.el).html(app.templates.genericPage(this.options));
    }
  });

  views.ChangePasswordSuccess = utils.View.extend({
    className: 'page change-password-success',
    render: function(){
      $(this.el).html(app.templates.changePasswordSuccess());
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

      var formData  = $('#settings-change-tapin-form').serializeObject()
        , self      = this
      ;
      api.auth.updateBarcodeId(formData, function(error){
        if (utils.exists(error)){
          var errorView = new app.Views.LoginError({
            error: error
          });
          $('.errors', $(self.el)).replaceWith(errorView.render().el);
          return false;
        }
        app.changePage(function(done){
          var successPage = new app.Views.GenericPage({
            classes: 'change-tapin-success',
            title: 'TapIn ID Change Success!'
          });
          successPage.render();
          done(successPage);
        });
      });

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
        app.user.logout();
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

  views.RowLoader = utils.View.extend({
    className: 'gb-row-loader',
    events: {
      'click': 'rowClick'
    },
    initialize: function(options){
      this.$el = $(this.el);
      this.$el.html("Tap to Load More");
      this.loader = new utils.loader(this.$el, options);
    },
    start: function(){
      this.loader.start();
      return this;
    },
    stop: function(){
      this.loader.stop();
      return this;
    },
    isLoading: function(){
      return this.loader.isLoading();
    },
    rowClick: function(e){
      if (this.options.onClick){
        this.options.onClick(e, this);
      }
    }
  });

  views.OneLastThing = utils.View.extend({
    className: 'page one-last-thing'
  , events: {
      'submit #one-last-thing-form': 'onFormSubmit'
    }
  , initialize: function(){
      return this;
    }
  , render: function(){
      $(this.el).html(app.templates.oneLastThing());
      return this;
    }
  , onFormSubmit: function(e){
      e.preventDefault();
      e.stopPropagation();
      var sn = $('#one-last-thing-screen-name', this.el).val();
      api.auth.updateScreenName(sn, function(error){
        if (utils.exists(error)){
          console.log(error);
          var errorView = new app.Views.LoginError({
            error: error
          });
          $('.errors', $(this.el)).replaceWith(errorView.render().el);
          return;
        }
        app.user.set('screenName', sn);
        app.user.set('setScreenName', true);
        window.location.href = "/#!/streams/global";
      });
      return false;
    }
  });

  // Export
  for (var name in views){
    this.app.Views[name] = views[name];
  }
}).call(this);
