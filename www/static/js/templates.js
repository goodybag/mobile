(function(){
  this.app = window.app || {};
  this.app.templates = this.app.templates || {};
  this.app.fragments = this.app.fragments || {};

  var templates = {}
    , fragments = {}
  ;


  templates.login    = "login-tmpl";
  templates.barcode  = "barcode-tmpl";


  this.app.compileTemplates = function(callback){
    $.get('/partials.html', function(content, status){
      $('body').append(content);
      var compile = function(obj){
        var compiled = {};
        for (var key in obj){
          if (Object.isObject(obj[key])){
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
      callback();
    });
  };
}).call(this);