(function(){
  var $ui = Ti.UI;
  gb.style.iphone.register = {
    "self": {
      backgroundImage: 'screens/login/background.png'
    }
    
  , "wrapper": {
      width: $ui.FILL
    , height: $ui.SIZE
    , left: 10
    , right: 10
    , top: 126
    , layout: 'vertical'
    }
    
  , "header": {
      width: $ui.FILL
    , height: $ui.SIZE
    , top: 10
    , left: 2
    , color: gb.ui.color.blueDark
    , font: {
        fontSize: 20
      , fontWeight: "bold"
      }
    , shadowOffset: { x: 0, y: 1 }
    , shadowColor: '#63a5cf'
    }
    
  , "fields": {
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
    
  , "nav": {
      width: $ui.FILL
    , height: $ui.SIZE
    , top: 8
    , layout: 'horizontal'
    }
  };
})();