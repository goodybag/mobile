(function(){
  this.app = window.app || {};
  this.app.Models = window.app.Models || {};

  var Auth = Backbone.Models.extend({
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

  this.app.Models.Auth = Auth;
}).call(this);