(function(){
  this.app = window.app || {};
  this.app.config = this.app.config || {};

  var config = {
    backbone: {
      pushState: false
    },
    changePage: {
      transition: "slideLeft",
      transitions: [
        'slideLeft',
        'slideRight'
      ],
      changeHash: false
    },
    theme: 'b'
  };

  // Export
  for (var key in config){
    this.app.config[key] = config[key];
  }
}).call(this);