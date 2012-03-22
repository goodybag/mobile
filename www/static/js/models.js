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
          self.trigger("authenticated");
        };
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
          self.trigger("authenticated");
        };
      });
      return this;
    }
  });

  models.Activity = utils.Model.extend({
    //who.id
    //who.name
    //action
    //timestamp
  });

  models.PreviousRoutes = utils.Model.extend({
    defaults: {
      routes: [],
      maxLength: 5,
      last: false,
      goingBack: false
    },
    add: function(route){
      this.attributes.routes.push(route);
      if (this.get('routes').length > this.get('maxLength')){
        this.set('routes', this.get('routes').slice(1));
      }
      if (this.get('routes').length > 1){
        this.set('last', this.get('routes')[this.get('routes').length - 2]);
        this.trigger('change:routes');
      }
    },
    pop: function(route){
      var r = this.attributes.routes.shift();
      if (this.get('routes').length == 1) this.set('last', false);
      this.trigger('change:routes');
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
        places: 'places'
      }
    },
    initialize: function(){},
    setRoute: function(route){
      this.set('current', route);
      this.set('active', this.get('keys')[route.split('/')[2]] || false);
      this.trigger('change:active');
      console.log('[Active Route] - ' + this.get('keys')[route.split('/')[2]]);
      return this;
    }
  });

  // Export
  for (var key in models){
    this.app.Models[key] = models[key];
  }
}).call(this);