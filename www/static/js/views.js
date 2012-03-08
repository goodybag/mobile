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

  views.LoginPage = Backbone.View.extend({
    attributes: {
      "data-role" : "page",
      "class"     : "page",
      "id"        : "login-page"
    },
    render: function(){
      $(this.el).html(app.templates.login());
      return this;
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