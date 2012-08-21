(function(){
  var $ui = Ti.UI, settingRightWidth;
  
  gb.style.iphone.settings = {
    "base": {
      zIndex: 15
    }
    
  , "header": {
      textAlign: "left"
    , top: 12
    , bottom: 8
    }
    
  , "facebookWrapper": {
      width: $ui.FILL
    , height: $ui.SIZE
    , top: 4
    , bottom: 8
    }
    
  , "facebookBtn": {
      "default": {
        width: $ui.FILL
      }
    }
    
  , "island": {
      
    }
    
  , "setting": {
      "base": {
        width: $ui.FILL
      , height: $ui.SIZE
      , top: 7
      }
      
    , "field": {
        width: $ui.SIZE
      , height: $ui.SIZE
      , left: 2
      , right: settingRightWidth = 60
      , color: gb.ui.color.grayDark
      , shadowOffset: { x: 0, y: 1 }
      , shadowColor: '#fff'
      , font: {
          fontSize: gb.ui.font.base.fontSize + 1
        , fontWeight: 'bold'
        }
      }
      
    , "right": {
        width: settingRightWidth
      , height: $ui.SIZE
      , right: 0
      }
      
    , "edit": {
        "default": {
          width: $ui.FILL
        , height: 30
        }
      }
      
    , "separator": {
        width: $ui.FILL
      , height: 1
      , backgroundColor: gb.ui.color.grayLightest
      , top: 6
      }
      
    , "avatar": {
        width: 85
      , height: $ui.SIZE
      }
    }
    
    // Sub-pixel rendering was messing up the button render clarity
  , "setting:avatar": {
      "base": {
        top: 2        
      }
    , "field": {
        left: 0
      }
    , "edit": {
        "default": {
          top: 1
        }
      }
    }
    
  , "signOutWrapper": {
      width: $ui.FILL
    , height: $ui.SIZE
    , top: 8
    }
    
    /**
     * Edit Settings
     */
  , "edit": {
    
      "fields": {
        "base": {
          width: $ui.FILL
        , height: $ui.SIZE
        , layout: 'vertical'
        }
        
      , "field": {
          top: 4
        , bottom: 4
        }
      } // End Fields
        
    , "backBtn": {
        "default": {
          width: 100
        , left: 0
        }
      }
      
    , "saveBtn": {
        "default": {
          width: 100
        , right: 0
        }
      }
    } // End Edit
  };
  
})();
