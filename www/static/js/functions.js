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
    }
    $('.loading-container').css('display', 'block');
    pageLoader.start();
    action(function(renderedView){
      pageLoader.stop();
      $('.loading-container').css('display', 'none');
      app.functions.transitionPage($(renderedView.el), options, function(){
        window.scrollTo(0, 0);
        app.trigger('page:change:complete');
      });
      if (app.functions.lacksPositionStatic()) app.Views.Main.fixStatics();
    });
    return app;
  };

  // Provides animation and content change for pages
  functions.transitionPage = function($el, options, callback){
    if (!utils.exists(app.transitions[options.transition])){
      app.transitions[app.config.changePage.defaultTransition]($el, options, callback);
    }else{
      app.transitions[options.transition]($el, options, callback);
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

  // var paddingTop;
  functions.hidePositionStaticElements = function(){
    $('#main-nav').css('display', 'none');
    $('#header-nav').css('display', 'none');
    // This padding top business causes the input unfocus :(
    // Re-implement this when you can figure out, not too important now
    // paddingTop = $('.outer-container').css('padding-top');
    // $('.outer-container').css('padding-top', 0);
  };

  functions.showPositionStaticElements = function(){
    $('#main-nav').css('display', 'block');
    $('#header-nav').css('display', 'block');
    //$('.outer-container').css('padding-top', paddingTop || "49px");
  };

  // Export
  for (var key in functions){
    this.app.functions[key] = functions[key];
  }
}).call(this);