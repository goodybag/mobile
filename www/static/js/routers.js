(function(){
  this.app = window.app || {};

  var router = Backbone.Router.extend({
    routes: {
      "": "landing",
      "/#!/test": "test"
    },
    initialize: function(){
      console.log('test1');
      // Load templates and Fragments
      app.compileTemplates(function(){
        console.log("compiled templates");
        // Authenticate and generate appropriate view
        var view = new app.Views.LoggedOut();
        view.render();
      });
    },

    landing: this.app.routes.landing,
    test: this.app.routes.test
  });

  this.app.GbMobileRouter = router;
}).call(this);