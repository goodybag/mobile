(function(){
  this.app = window.app || {};
  this.app.Models = window.app.Models || {};
  var models = {};

  models.Auth = Backbone.Model.extend({
    defaults: {

    },
    intialize: function(){

    },
    login: function(){

    },
    logout: function(){

    },
    isLoggedIn: function(){

    }
  });

  // Export
  for (var name in models){
    this.app.Models[name] = models[name];
  }
}).call(this);