(function(){
  this.app = window.app || {};

  var router = Backbone.Router.extend({
    routes: {
      "login": "login",
      "test": "test",
      "test/:blah/poop": "test"
    },

    landing: this.app.routes.landing,
    test: this.app.routes.test,
    login: this.app.routes.login
  });

  this.app.GbMobileRouter = router;
}).call(this);