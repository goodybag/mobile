(function(){
  var $ui = Ti.UI;
  gb.style.iphone.common = {
    scrollView: {
      width: $ui.FILL
    , height: $ui.FILL
    , layout: 'vertical'
    , showVerticalScrollIndicator: true
    }
    
  , "fieldset": {
      width: $ui.FILL
    , height: $ui.SIZE
    , top: 10
    , layout: 'vertical'
    , borderRadius: 10
    , borderWidth: '1dp'
    , borderColor: '#2e6284'
    , backgroundColor: '#fff'
    }
    
  , "field": {
      "wrapper": {
        width: $ui.FILL
      , height: $ui.SIZE
      , layout: 'horizontal'
      }
    , "input": {
        width: 260
      , height: 40
      , left: 10
      , color: gb.ui.color.gray
      , borderStyle: Ti.UI.INPUT_BORDERSTYLE_NONE
      , autocorrect: false
      , autocapitalization: Ti.UI.TEXT_AUTOCAPITALIZATION_NONE
      }
    , "indicator": {
        "base": {
          width: $ui.FILL
        , height: 20
        , right: 10
        , backgroundImage: 'screens/register/indicator-gray.png'
        }
      , "green": {
          backgroundImage: 'screens/register/indicator-green.png'
        }
      , "red": {
          backgroundImage: 'screens/register/indicator-red.png'
        }
      }
    , "password": {
        passwordMask: true,
      }
    , "separator": {
        width: $ui.FILL
      , height: 1
      , backgroundColor: gb.ui.color.grayLighter
      }
    }
    
  , "buttons": {
      "blue": {
        "default": {
          width: '100dp'
        , height: '40dp'
        , borderRadius: 5
        , borderWidth: 1
        , borderColor: '#165b87'
        , color: '#fff'
        , font: {
            fontSize: 12
          , fontWeight: 'bold'
          }
        , shadowOffset: { x: 0, y: -1 }
        , shadowColor: gb.ui.color.blueDark
        , opacity: 1
        , backgroundGradient: {
            type: 'linear'
          , startPoint: { x: 0, y: 0 }
          , endPoint:   { x: 0, y: '100%' }
          , colors: [{ color: '#1f7eba', offset: 0.0 }, { color: '#0667a0', offset: 1.0 }]
          }
        , topShadow: {
            color: '#fff'
          , opacity: 0.1
          }
        , bottomShadow: {
            color: '#fff'
          , opacity: 0.07
          }
        }
      , "active": {
          backgroundGradient: {
            type: 'linear'
          , startPoint: { x: 0, y: 0 }
          , endPoint:   { x: 0, y: '100%' }
          , colors: [{ color: '#0667a0', offset: 0.0 }, { color: '#0667a0', offset: 1.0 }]
          }
        , topShadow: {
            color: '#0667a0'
          , opacity: 1
          }
        , opacity: 1
        }
      , "disabled": {
          opacity: 0.4
        }
      }
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