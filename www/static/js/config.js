(function(){
  this.app = window.app || {};
  this.app.config = this.app.config || {};

  var config = {
    pushState: false
  };

  // Export
  for (var key in config){
    this.app.config[key] = config[key];
  }
}).call(this);