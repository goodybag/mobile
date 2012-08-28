(function(){
  var $ui = Ti.UI, settingRightWidth;
  
  gb.style.base.settings = {
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
      text: "Connect with Facebook"
    }
    
  , "signOutBtn": {
      text: "Sign Out"
    }
    
  , "island": {
      //
    }
    
  , "setting": {
      "base": {
        width: $ui.FILL
      , height: $ui.SIZE
      , build: { type: "createView" }
      }
      
    , "field": {
        width: $ui.SIZE
      , height: $ui.SIZE
      , left: 10
      , top: 10
      , bottom: 10
      , right: 25
      , color: gb.ui.color.grayDark
      , shadowOffset: { x: 0, y: 1 }
      , shadowColor: '#fff'
      , font: {
          fontSize: gb.ui.font.base.fontSize + 1
        , fontWeight: 'bold'
        }
      , build: { type: "createLabel" }
      }
      
    , "right": {
        width: 25
      , height: $ui.SIZE
      , right: 6
      }
      
    , "edit": {
        "default": {
          width: $ui.FILL
        , height: 30
        , borderRadius: 0
        }
      }
      
    , "editBar": {
        backgroundColor: '#bbb'
      , width: $ui.FILL
      , height: 30
      , style: $ui.iPhone.SystemButtonStyle.BAR                  
      }
      
    , "separator": {
        width: $ui.FILL
      , height: 1
      , backgroundColor: '#ddd'
      , bottom: 0
      , build: { type: "createView" }
      }
    }
    
    // Sub-pixel rendering was messing up the button render clarity
  , "setting:avatar": {
      "base": {
        top: 0
      }
    , "field": {
        left: 8
      , width: 85
      , height: 85
      , borderRadius: 3
      , build: { type: "createImageView" }
      }
    , "edit": {
        "default": {
          top: 1
        }
      }
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
