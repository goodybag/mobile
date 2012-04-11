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

  // Don't create a new pageLoader every changePage
  var pageLoader = false;

  // Pass in a function (action) that calls the supplied callback
  // Probably called done and passes a prepared view to it
  // Transition optional
  // Or just pass in the rendered view
  functions.changePage = function(action, options){
    options = options || {};
    // Passing in a view
    if (typeof action !== "function"){
      app.functions.transitionPage($(action.el), options);
      return app;
    }
    if (!pageLoader) {
      pageLoader = new utils.loader($('html'), {
        overlayCss: {
          'background-color': '#000'
        },
        outerCss: {
          position: 'fixed',
          width: '100%',
          height: '100%'
        }
      });
    }
    pageLoader.start();
    action(function(renderedView){
      console.log('[change page] - inside done');
      pageLoader.stop();
      console.log('[change page] - loader off, transitioning');
      app.functions.transitionPage($(renderedView.el), options);
    });
    return app;
  };

  // Provides animation and content change for pages
  functions.transitionPage = function($el, options){
    if (!utils.exists(app.transitions[options.transition])){
      app.transitions[app.config.changePage.defaultTransition]($el, options);
    }else{
      app.transitions[options.transition]($el, options);
    }
    return app;
  };

  functions.stream = {};
  functions.stream.scrollListenerMy = (function(){
    var view      = this.view
      , complete  = false
      //, loader    = new utils.loader($('.gb-row-loader'), $(view.el))
    ;
    console.log("scroll listener");
    console.log(this);
    return function(e, observer){
      if (complete) return;

      //loader.start();

      /*app.api.activity.fetchGlobal(options, function(error, data){
        if (utils.exists(error)){
          console.error(error.message);
          return;
        }
        if (data.length < options.limit) complete = true;
        loader.stop();
      });*/
    };
  })();

  // Export
  for (var key in functions){
    this.app.functions[key] = functions[key];
  }
}).call(this);