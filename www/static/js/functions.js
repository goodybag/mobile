/*
  app.functions -
  Functions that need access to the app object.
  Utils should be general helper functions that do not
  need knowledge of our application.
*/

(function(){
  this.app = window.app || {};
  this.app.functions = this.app.functions || {};
  var functions = {};

  // Pass in a function (action) that calls the supplied callback
  // Probably called done and passes a prepared view to it
  // Transition optional
  // Or just pass in the rendered view
  functions.changePage = function(action, transition){
    // Passing in a view
    if (typeof action !== "function"){
      app.functions.transitionPage($(action.el), transition);
      return app;
    }
    var pageLoader = utils.loader($('html'), {
      overlayCss: {
        'background-color': '#000'
      }
    });
    action(function(renderedView){
      pageLoader();
      app.functions.transitionPage($(renderedView.el), transition);
      console.log($(renderedView.el));
    });
    return app;
  };

  // Provides animation and content change for pages
  functions.transitionPage = function($el, transition){
    switch(transition){
      default:
        app.transitions[app.config.changePage.defaultTransition]($el);
        break;
      case 'slideLeft':
        app.transitions.slideLeft($el);
        break;
      case 'slideRight':
        app.transitions.slideLeft($el);
        break;
      case 'fade':
        app.transitions.fade($el);
        break;
    }
    return app;
  };

  // Export
  for (var key in functions){
    this.app.functions[key] = functions[key];
  }
}).call(this);