(function(){
  this.app = window.app || {};
  this.app.Views = window.app.Views || {};
  var views = {};

  // Default jquery mobile page
  /*views.Page = Backbone.View.extend({
    attributes: {
      "data-role" : "page",
      "class"     : "page"
    },
    render: function(){
      $(this.el).html(this.template());
      return this;
    }
  });*/

  views.LoggedOut = Backbone.View.extend({
    el: 'body',
    initialize: function(){
      console.log('test2');
      /*this.subviews = [
        new app.Views.LoginPage()
      ];*/
      this.view = new app.Views.LoginPage();
    },
    render: function(){
      console.log('test3');
      /*$(this.el).empty();
      for (var i  = 0; i < this.subviews.length; i++){
        $(this.el).append(this.subviews[i].render().el);
      }*/
      $(this.el).append(this.view.render().el);
      //$.mobile.changePage($(this.view.el), {changeHash: false});
    }
  });

  views.LoggedIn = Backbone.View.extend({
    el: '#container',
    intialize: function(){
    }
  });

  /*views.TestPage = Backbone.View.extend({
    events: {
      'pagehide': 'onPageHide'
    },
    attributes: {
      "data-role" : "page",
      "class"     : "page"
    },
    render: function(){
      $(this.el).html(app.templates.test());
      $('body').append($(this.el));
      $(this.el).page();
      return this;
    },
    onPageHide: function(){
      $(this.el).remove()
    }
  });*/

  views.TestPage = Backbone.View.extend({
    events: {
      'pagehide': 'onPageHide'
    },
    attributes: {
      "data-role" : "page",
      "class"     : "page",
      "data-transition": "turn"
    },
    render: function(){
      $(this.el).html(app.templates.test());
      $('body').append($(this.el));
      $(this.el).page();
      return this;
    },
    onPageHide: function(){
      $(this.el).remove()
    }
  });

  views.Page = Backbone.View.extend({
    events: {
      'pagehide': 'onPageHide'
    },
    attributes: {
      "data-role" : "page",
      "class"     : "page"
    },
    render: function(){
      $(this.el).html(this.template());
      return this;
    },
    onPageHide: function(){
      $(this.el).remove();
    }
  });

  views.LoginPage = views.Page.extend({
    attributes: {
      "data-role" : "page",
      "class"     : "page",
      "id"        : "login-page"
    },
    events: {
      'tap #login-facebook': 'facebookLogin',
      'pagehide': 'onPageHide'
    },
    initialize: function(){
      this.template = app.templates.login;
    },
    facebookLogin: function(){
      app.user.facebookLogin(function(error){
        if (utils.exists(error)){
          alert("Facebook Login error");
        }else{
          alert("Facebook Login success!");
          app.router.navigate(app.cache.previousRoute || '');
        }
      });
    }
  });

  views.EmailLoginPage = views.Page.extend({
    attributes: {
      "id": "email-login-page"
    },
    events: {
      'submit #email-login-form': 'emailLogin',
      'pagehide': 'onPageHide'
    },
    initialize: function(){
      var self = this;
      this.template = app.templates.emailLogin;
      this.model.on('login:success', this.loginSuccess);
      this.model.on('login:failure', this.loginFailure);
    },
    loginSuccess: function(){
      console.log('LOGIN SUCCESS');
    },
    loginFailure: function(error){
      var error = new app.Models.Error();
      for (var key in error){
        error.set(key, error[key]);
      }
      var errorMsg = new app.Views.ErrorNotification({
        model: error
      });
      $(this.el).before($(errorMsg.el));
    },
    emailLogin: function(e){
      e.preventDefault();
      e.stopPropagation();
      this.model.set('email', $('#email-login-username').val());
      this.model.set('password', $('#email-login-password').val());
      this.model.emailLogin();
      return false;
    }
  });

  views.ErrorNotification = Backbone.View.extend({
    events: {
      'tap': 'hide'
    },
    initialize: function(){
      this.template = app.fragments.errorNotification;
    },
    render: function(){
      $(this.el).html(this.template(this.model.toJSON()));
    }
  });

  views.Button = Backbone.View.extend({
    tagname: 'a',
    events: {
      'click': 'onClick'
    },
    defaults: {
      href: "#",
      "data-role": "button",
      "data-theme": "b"
    },
    initialize: function(options){
      this.options = options;
      _.defaults(this.options, this.defaults);
      _.extend(this.attributes, this.options);
    },
    onClick: function(){
      this.options.click();
    }
  });

  // Export
  for (var name in views){
    this.app.Views[name] = views[name];
  }
}).call(this);