(function(){
  var $ui = Ti.UI;
  gb.style.iphone.common = {
    scrollView: {
      width: $ui.FILL
    , height: $ui.FILL
    , layout: 'vertical'
    , showVerticalScrollIndicator: true
    }
    
  , animation: {
      "fadeIn": {
        opacity: 1
      , duration: 600
      }
      
    , "fadeOut": {
        opacity: 0
      , duration: 600
      }
    }
  };
})();