(function(){
  this.app = window.app || {};
  this.app.config = this.app.config || {};

  var config = {
    backbone: {
      pushState: false
    },
    changePage: {
      transition: "flip",
      changeHash: false
    }
  };

  // Export
  for (var key in config){
    this.app.config[key] = config[key];
  }
}).call(this);