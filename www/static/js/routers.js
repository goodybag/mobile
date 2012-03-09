(function(){
  this.app = window.app || {};

  var router = Backbone.Router.extend({
    routes: {
      "login": "login",
      "test": "test",
      "test/:blah/poop": "test",
      "email-login": "emailLogin",
      "email-login-submit": "emailLoginSubmit"
    },

    landing: this.app.routes.landing,
    test: this.app.routes.test,
    login: this.app.routes.login,
    emailLogin: this.app.routes.emailLogin
  });

  this.app.GbMobileRouter = router;
}).call(this);