(function(){
  this.app = window.app || {};
  this.app.Models = window.app.Models || {};
  var models = {};

  models.Goody = utils.Model.extend({
    initialize: function(attributes, options){
      // Set the percentage field
      var percentage = Math.ceil((attributes.funds.charityCentsRemaining / attributes.funds.centsRequired)*100);
      var funds = attributes.funds;
      funds.centsTilGoody = attributes.funds.centsRequired - attributes.funds.charityCentsRemaining;
      if (percentage > 100){
        percentage = 100;
        funds.centsTilGoody = 0;
      }
      if (percentage < 0){
        //this shouldnt be possible..
        percentage = 0
        funds.centsTilGoody = goody.funds.centsRequired;
      };
      this.set('funds', funds);
      this.set('percentage', percentage);

      return this;
    }
  });

  models.User = utils.Model.extend({
    hasUserCache: function(){
      return !!this.get('email');
    }
  , logout: function(callback){
      callback || (callback = function(){});
      app.trigger('logout:begin');
      var self = this;
      FB.logout(function(){
        api.auth.logout(function(error, consumer){
          if (utils.exists(error)){
            console.log(error);
            app.trigger('logout:fail', error);
            return;
          }
          self.clear();
          app.previousRoutes.clear();
          app.functions.clearFbAccessToken();
          callback();
          app.trigger('logout:success');
        });
      });
    }
  });

  models.EmailAuth = utils.Model.extend({
    defaults: {
      authenticated: false
    }
    , login: function() {
      var self = this;
      var options = {email: this.get("email"), password: this.get("password")};
      api.auth.login(options, function(error, consumer){
        self.unset("password", {silent: true}); //clear for safety
        if(!utils.exists(error)){
          app.user.set(consumer);
          self.trigger("authenticated");
        }else{
          self.trigger("auth:fail", error);
        }
      });
      return this;
    }
    , register: function(){
      var self = this;
      var options = {
        firstName: this.get("firstName")
        , lastName: this.get("lastName")
        , email: this.get("email")
        , password: this.get("password")
      };
      api.auth.register(options, function(error, consumer){
        self.unset("password", {silent: true}); //clear for safety
        if(!utils.exists(error)){
          app.user.set(consumer);
          self.trigger("authenticated");
        };
      });
      return this;
    }
  });

  models.Activity = utils.Model.extend({
    initialize: function(attributes){
      this.set('action', streamParser.renderSentence(attributes));
      this.set('timestamp', moment(Date.create(attributes.dates.lastModified)).from());
      return this;
    },
    toJSON: function(){
      var self = this;
      return {
        who: {
          id: self.get('who').id,
          name: self.get('who').name,
          screenName: self.get('who').screenName
        },
        action: self.get('action'),
        timestamp: self.get('timestamp')
      };
    }
  });

  models.PreviousRoutes = utils.Model.extend({
    defaults: {
      routes: [],
      maxLength: 10,
      goingBack: false
    },
    add: function(route){
      this.attributes.routes.push(route);
      if (this.get('routes').length > this.get('maxLength')){
        this.set('routes', this.get('routes').slice(1));
      }
      if (this.get('routes').length > 1){
        this.set('last', this.get('routes')[this.get('routes').length - 2]);
      }
      this.trigger('change:routes', route, this.get('routes'));
      return this;
    },
    back: function(route){
      this.attributes.routes.pop();
      return this.attributes.routes[this.attributes.routes.length - 1];
    },
    canGoBack: function(){
      return (this.get('routes').length > 1);
    },
    clear: function(){
      this.set('routes', []);
      this.set('goingBack', false);
      this.trigger('change:routes');
      return this;
    },
    previousRoute: function(){
      var routes = this.attributes.routes;
      if (routes.length > 1)
        return routes[routes.length - 2];
    }
  });

  models.ActiveRoute = utils.Model.extend({
    defaults: {
      active: false,
      current: false,
      keys: {
        goodies: 'goodies',
        streams: 'activity',
        tapin: 'tapin',
        me: 'me',
        places: 'places',
        settings: 'settings'
      }
    },
    initialize: function(){},
    setRoute: function(route){
      this.set('current', route);
      this.set('active', this.get('keys')[route.split('/')[2]] || false);
      this.trigger('change:active');
      return this;
    }
  });

  // Export
  for (var key in models){
    this.app.Models[key] = models[key];
  }
}).call(this);