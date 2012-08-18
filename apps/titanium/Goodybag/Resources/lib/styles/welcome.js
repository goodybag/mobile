(function(){
  var $ui = Ti.UI;
  
  gb.style.iphone.welcome = {
    "base": {
      width: $ui.FILL
    , height: $ui.FILL
    , backgroundImage: 'background.png'
    , zIndex: 10
    , layout: 'vertical'
    }
    
  , "header": {
      width: $ui.FILL
    , height: $ui.SIZE
    , top: 120
    , textAlign: "center"
    , color: gb.ui.color.white
    , shadowOffset: { x: 0, y: -1 }
    , shadowColor: gb.ui.color.blueDark
    , font: {
        fontSize: 28
      }
    }
    
  , "smiley": {
      top: 30
    , font: {
        fontSize: 72
      }
    }
  };
})();

