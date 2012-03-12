(function(){
  this.app = window.app || {};
  this.app.templates = this.app.templates || {};
  this.app.fragments = this.app.fragments || {};

  var templates = {}
    , fragments = {}
  ;


  templates.login       = "login-tmpl";
  templates.emailLogin  = "email-login-tmpl";
  templates.barcode     = "barcode-tmpl";
  templates.test        = "test-tmpl";


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

      app.trigger("templates-compiled");
      if (utils.exists(callback)) callback();
    });
  };
}).call(this);