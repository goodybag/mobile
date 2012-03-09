(function(){
  this.utils = window.utils || {};
  var utils = {};

  utils.exists = function(x) {
    if (typeof x !== "undefined" && x !== null)
    return true;
    return false;
  };

  // Pass in a backbone view
  utils.changePage = function(page, options){
    options = options || {};
    var defaults = app.config.changePage;
    $.extend(defaults, options);
    page.render();
    $('body').append($(page.el));
    $(page.el).page();
    $.mobile.changePage($(page.el), defaults);
  };

  // Export
  for (var name in utils){
    this.utils[name] = utils[name];
  }
}).call(this);