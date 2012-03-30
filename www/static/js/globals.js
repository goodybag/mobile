(function(){
  this.app = window.app || {};
  this.app.globals = this.app.globals || {};

  var globals = {
    android: {
      versionCodes: {
        '1.0': 1,
        '1.1': 2,
        '1.5': 3,
        '1.6': 4,
        '2.0': 5,
        '2.0.1': 6,
        '2.1': 7,
        '2.2': 8,
        '2.3': 9,
        '2.3.3': 10,
        '3.0': 11,
        '3.1': 12,
        '3.2': 13,
        '4.0': 14,
        '4.0.3': 15,
        dev: 1000
      }
    }
  };

  // Export
  for (var key in globals){
    this.app.globals[key] = globals[key];
  }
}).call(this);