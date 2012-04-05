(function(){
  this.app = window.app || {};
  this.app.templates = this.app.templates || {};
  this.app.fragments = this.app.fragments || {};

  var templates = {}
    , fragments = {}
  ;

  templates.mainFrame   = "main-frame-tmpl";
  fragments.headerNav   = "header-nav-fragment";
  fragments.userHeader  = "user-header-fragment";
  fragments.pageNav     = "page-nav-fragment";
  fragments.footerNav   = "footer-fragment";
  templates.genericPage = "generic-page-tmpl";

  templates.landing     = "landing-tmpl";
  templates.register    = "register-tmpl";
  templates.emailLogin  = "email-login-tmpl";
  fragments.loginError  = "login-error-fragment";
  templates.dashboard   = "dashboard-tmpl";

  // Settings
  templates.settings                = "settings-tmpl";
  templates.changePassword          = "change-password-tmpl";
  templates.changePasswordSuccess   = "change-password-success-tmpl";
  templates.changeTapIn             = "change-tapin-tmpl";
  templates.changePicture           = "change-picture-tmpl";

  // Goodies
  templates.goodies     = "goodies-tmpl";
  templates.noGoodies   = "no-goodies-tmpl";
  fragments.goody       = "goody-fragment";
  fragments.simpleGoody = "simple-goody-fragment";

  //Streams
  templates.streams               = "streams-tmpl";
  fragments.activity              = "activity-fragment";
  fragments.activityEventRsvped   = "activity-action-eventRsvped-fragment";
  fragments.activityPollCreated   = "activity-action-pollCreated-fragment";
  fragments.activityPollAnswered  = "activity-action-pollAnswered-fragment";
  fragments.activityBtTapped      = "activity-action-btTapped-fragment";
  fragments.activityFundsDonated  = "activity-action-fundsDonated-fragment";

  //Places
  fragments.place         = "place-fragment";
  templates.placeDetails  = "place-details-tmpl";

  //TapIn
  templates.tapIn = "tap-in-tmpl";

  this.app.compileTemplates = function(callback){
    $.get('/partials.html?rand='+ Math.floor(Math.random()*1000), function(content, status){
      $('body').append(content);
      var compile = function(obj){
        var compiled = {};
        for (var key in obj){
          if (typeof obj[key] !== "string"){
            compiled[key] = compile(obj[key]);
          }else {
            compiled[key] = Handlebars.compile($("#" + obj[key]).html());
          }
        }
        return compiled;
      };
      // Export
      app.templates = compile(templates);
      app.fragments = compile(fragments);

      app.trigger("templates:compiled");
      if (utils.exists(callback)) callback();
    });
  };
}).call(this);