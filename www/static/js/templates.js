(function(){
  this.app = window.app || {};
  this.app.templates = this.app.templates || {};
  this.app.fragments = this.app.fragments || {};

  var templates = {}
    , fragments = {}
  ;

  templates.landing     = "landing-tmpl";
  templates.register    = "register-tmpl";
  templates.emailLogin  = "email-login-tmpl";
  templates.dashboard   = "dashboard-tmpl";

  // Goodies
  templates.goodies     = "goodies-tmpl";
  fragments.goody       = "goody-fragment";

  //Streams
  templates.streams               = "streams-tmpl"
  fragments.activity              = "activity-fragment"
  fragments.activityEventRsvped   = "activity-action-eventRsvped-fragment"
  fragments.activityPollCreated   = "activity-action-pollCreated-fragment"
  fragments.activityPollAnswered  = "activity-action-pollAnswered-fragment"
  fragments.activityBtTapped      = "activity-action-btTapped-fragment"
  fragments.activityFundsDonated  = "activity-action-fundsDonated-fragment"

  //Places
  fragments.place         = "place-fragment"
  templates.placeDetails  = "place-details-tmpl"

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