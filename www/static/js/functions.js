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

  // Provides animation and content change for pages
  functions.transitionPage = function($el, transition){
    switch(transition){
      default:
        app.transitions[app.config.changePage.transition]($el);
        break;
      case 'slideLeft':
        app.transitions.slideLeft($el);
        break;
      case 'slideRight':
        app.transitions.slideLeft($el);
        break;
    }
  };

  // Export
  for (var key in functions){
    this.app.functions[key] = functions[key];
  }
}).call(this);