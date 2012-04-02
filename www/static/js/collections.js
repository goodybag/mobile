/*
  Provides a Backbone-like experience with collections
  that conforms to our existing api setup

  Be sure that when you override default crud functions
  to fire off the appropriate events.
*/

(function(){
  this.app = window.app || {};
  this.app.api = window.app.api || {};
  var collections = {};

  var collectionConstructor = function(options){
    this.models = [];
    this.initialize.call(this, options);
  };
  collectionConstructor.prototype = {
    Model: null,
    api: null,

    initialize: function(){
      return this;
    },

    push: function(data, options){
      options = options || {};
      var model = new this.Model(data);
      this.models.push(model);
      if (!options.silent) this.trigger('add', model, this, options);
    },

    reset: function(data, options){
      options = options || {};
      this.models = [];
      for (var i = 0; i < data.length; i++){
        this.push(data[i], {silent: !options.add});
      }
      if (!options.silent) this.trigger('reset', this);
    },

    get: function(id, callback){
      this._get(id, callback);
    },
    _get: function(id, callback){
      if (!utils.exists(callback))
      this.api.single(id, callback);
    },

    add: function(model, callback){
      this._add(model, callback);
    },
    _add: function(model, callback){
      var self = this;
      this.api.add(model, function(error, data){
        if (!utils.exists(error)){
          self.push(data);
        }
        callback(error, data);
      });
    },

    del: function(id, callback){
      this._del(id, callback);
    },
    _del: function(id, callback){
      var self = this;
      this.api.del(id, function(error){
        self.trigger('remove');
        callback(error);
      });
    },

    fetch: utils.overload({
      "": function(){
        this._fetch({add: false, silent: false}, function(){});
      },
      "f": function(callback){
        this._fetch({add: false, silent: false}, callback);
      },
      "o": function(options){
        this._fetch(options, function(){})
      },
      "o,f": function(options, callback){
        this._fetch(options, callback);
      }
    }),
    _fetch: function(options, callback){
      var self = this;
      this.api.list(options, function(error, data){
        if (!utils.exists(error)){
          self.reset({silent: options.silent, add: options.add});
        }
        callback(error, data);
      });
    }
  };

  collections.activity = {
    Model: app.Models.Activity,
    api: api.streams,

    fetchGlobal: function(options, callback){
      options.which = "global";
      this.fetch(options, callback);
    },
    fetchSelf: function(options, callback){
      options.which = "self";
      this.fetch(options, callback);
    },
    fetch: function(options, callback){
      var self = this
        , defaults = {
          add: false,
          silent: false,
          which: "global"
        }
      ;
      options = options || {add: false};
      this.api[options.which](options, function(error, data){
        if (!utils.exists(error)){
          self.reset(data, {silent: options.silent, add: options.add});
        }
        callback(error, data);
      });
    }
  };

  // Export
  var Collection;
  for (var name in collections){
    Collection = collectionConstructor;
    utils.extend(Collection.prototype, collections[name]);
    utils.extend(Collection.prototype, utils.Events);
    this.app.api[name] = new Collection();
  }
}).call(this);