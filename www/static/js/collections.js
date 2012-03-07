(function(){
  this.app = window.app || {};
  this.app.Collections = window.app.Collections || {};
  var collections = {};

  // Export
  for (var name in collections){
    this.app.Collections[name] = collections[name];
  }
}).call(this);