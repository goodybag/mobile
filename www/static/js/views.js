(function(){
  this.app = window.app || {};
  this.app.Views = window.app.Views || {};

  var AppView = Backbone.Views.extend({
    el: '#container',
    intialize: function(){
      // create new instances of all of our apps views
    }
  });

  this.app.Views.AppView = AppView;
}).call(this);