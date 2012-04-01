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

    intitialize: function(){
      return this;
    },

    push: function(data, options){
      options = options || {};
      var model = new this.Model(data);
      this.models(model);
      if (!options.silent) this.trigger('add', model, this, options);
    },

    reset: function(options){
      options = options || {};
      this.models = [];
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

    fetch: function(options, callback){
      if (typeof options == "function") {
        callback = options;
        options = {};
      }
      _fetch(options, callback);
    },
    _fetch: function(options, callback){
      var self = this;
      options = options || {add: false};
      this.api.list(options, function(error, data){
        if (!utils.exists(error)){
          for (var i = 0; i < data.length; i++){
            self.push(data[i], {silent: options.add});
          }
          if (!options.add) self.trigger('reset', this);
        }
        callback(error, data);
      });
    }
  };

  collections.activity = {
    Model: app.Models.Activity,
    api: api.streams,

    fetchGlobal: function(options, callback){
      var self = this;
      options = options || {add: false};
      this.api.global(options, function(error, data){
        if (!utils.exists(error)){
          for (var i = 0; i < data.length; i++){
            self.push(data[i], {silent: !options.add});
          }
          if (!options.add) self.trigger('reset', this);
        }
        callback(error, data);
      });
    },
    fetchSelf: function(options, callback){
      var self = this;
      options = options || {add: false};
      this.api.self(options, function(error, data){
        if (!utils.exists(error)){
          for (var i = 0; i < data.length; i++){
            self.push(data[i], {silent: options.add});
          }
          if (!options.add) self.trigger('reset', this);
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
    this.app.api[name] = new Collection();
  }
}).call(this);