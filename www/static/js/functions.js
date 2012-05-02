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
    $('.loading-container').css({
      width: $(window).width() + "px"
    , height: window.innerHeight + "px"
    , top: window.pageYOffset + "px"
    });
    if (!pageLoader) {
      console.log("[change page] - Creating Loader");
      pageLoader = new utils.loader($('.loading-container'), {
        overlayCss: {
          'background-color': '#000'
        , opacity: '0.5'
        , width: '100%'
        , height: '100%'
        }
      , outerCss: {
          position: 'absolute'
        }
      });
      console.log("[change page] - Loader Created");
    }
    $('.loading-container').css('display', 'block');
    pageLoader.start();
    console.log("[change page] - Loader Started");
    action(function(renderedView){
      console.log('[change page] - inside done');
      pageLoader.stop();
      $('.loading-container').css('display', 'none');
      console.log('[change page] - loader off, transitioning');
      app.functions.transitionPage($(renderedView.el), options, function(){
        window.scrollTo(0, 0);
      });
      if (app.functions.lacksPositionStatic()) app.Views.Main.fixStatics();
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

  functions.lacksPositionStatic = function(){
    if (app.config.iosLt5) return true;
    return false;
  };

  functions.lacksInsetShadow = function(){
    if (app.config.iosLt5) return true;
    return false;
  };

  // Export
  for (var key in functions){
    this.app.functions[key] = functions[key];
  }
}).call(this);