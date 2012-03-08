(function(){
  this.utils = window.utils || {};
  var utils = {};

  utils.exists = function(x) {
    if (typeof x !== "undefined" && x !== null)
    return true;
    return false;
  };

  // Export
  for (var name in utils){
    this.utils[name] = utils[name];
  }
}).call(this);