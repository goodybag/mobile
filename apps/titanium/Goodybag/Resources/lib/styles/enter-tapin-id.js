(function(){
  var $ui = Ti.UI;
  
  gb.style.iphone.enterTapinId = {
    "base": {
    }
    
  , "wrapper": {
      width: $ui.FILL
    , height: $ui.SIZE
    , layout: 'vertical'
    , top: 10
    , left: 8
    , right: 8
    }
    
  , "header:already": {
      top: 16
    }
    
  , "form": {
      "base": {
        width: $ui.FILL
      , height: $ui.SIZE
      , layout: 'vertical'
      }
    , "row": {
        width: $ui.FILL
      , height: $ui.SIZE
      , layout: 'horizontal'
      , 
      }
    , "inputWrapper": {
        width: 160
      }
    , "input": {
      }
    , "image": {
        image: 'screens/enter-tapin-id/qr-code.png'
      , width: 100
      , height: 116
      , left: 30
      , opacity: 0.9
      }
    , "submitWrapper": {
        width: $ui.FILL
      , height: $ui.SIZE
      , top: 12
      }
    , "submit": {
        "default": {
          width: $ui.FILL
        }
      }
    }
    
  , "make": {
      width: $ui.FILL
    , height: $ui.SIZE
    , top: 20
    , layout: 'vertical'
    }
    
  , "header:makeOne": {
      
    }
    
  , "makeBtnWrapper": {
      width: $ui.FILL
    , height: $ui.SIZE
    , top: 11
    }
    
  , "makeBtn": {
      "default": {
        width: $ui.FILL
      }
    }
  };
})();

