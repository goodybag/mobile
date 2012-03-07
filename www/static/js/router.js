(function(){
  this.app = window.app || {};

  var router = Backbone.Router.extend({
    routes: {
      "": "landing"
    },
    initialize: function(){
      // Authenticate and generate appropriate view
      var view = new app.Views.AppView();
    }

    landing: this.app.routes.landing
  });

  this.app.GbMobileRouter = router;
}).call(this);