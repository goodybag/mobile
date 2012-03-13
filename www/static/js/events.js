(function(){
  this.app = window.app || {};
  var events = {}, events.actions = {};

  events.on = function(name, action){
    if (utils.exists(app.events.actions[name])){
      app.events.actions[name].push(action);
    }else{
      app.events.actions[name] = [action];
    }
    return app;
  };

  events.trigger = function(name, args, bind){
    if (utils.exists(app.events.actions[name])){
      var actions = app.events.actions[name];
      bind = (utils.exists(bind)) ? bind : this;
      for (var i = 0; i < actions.length; i++){
        actions[i].apply(bind, args);
      }
    }
    return app;
  };

  // Export
  for (var key in events){
    this.app.events[key] = events[key];
  }
  // shortcut
  this.app.on = this.app.events.on;
  this.app.trigger = this.app.events.trigger;
}).call(this);