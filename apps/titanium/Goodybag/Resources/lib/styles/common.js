/**
 * Common stylings
 * 
 * TODO:
 * A lot of these stylings have been specific to the blue background. Need to differentiate 
 */

(function(){
  var $ui = Ti.UI;
  gb.style.iphone.common = {
    scrollView: {
      width: $ui.FILL
    , height: $ui.FILL
    , layout: 'vertical'
    , showVerticalScrollIndicator: true
    }
    
  , "grayPage": {
      "base": {
        backgroundColor: '#ddd'
      , top: 54
      }
        
    , "header1": {
        width: $ui.FILL
      , height: $ui.SIZE
      , color: gb.ui.color.grayDarker
      , shadowOffset: { x: 0, y: 1 }
      , shadowColor: '#fff'
      , font: {
          fontSize: gb.ui.font.base.fontSize + 4
        , fontWeight: "bold"
        }
      }
      
    , "wrapper": {
        width: $ui.FILL
      , height: $ui.SIZE
      , layout: 'vertical'
      , left: 8
      , right: 8
      , bottom: 8
      }
      
      /**
       * Island
       */
    , "island": {
        "base": {
          width: $ui.FILL
        , height: $ui.SIZE
        , borderRadius: 7
        }
        
      , "header1": {
          width: $ui.FILL
        , height: $ui.SIZE
        , color: gb.ui.color.grayDarker
        , font: {
            fontSize: gb.ui.font.base.fontSize + 4
          , fontWeight: "bold"
          }
        }
        
      , "header2": {
          width: $ui.FILL
        , height: $ui.SIZE
        , color: gb.ui.color.grayDark
        , font: {
            fontSize: gb.ui.font.base.fontSize + 2
          , fontWeight: "bold"
          }
        }
        
      , "paragraph": {
          width: $ui.FILL
        , height: $ui.SIZE
        , color: gb.ui.color.grayDark
        , font: {
            fontSize: gb.ui.font.base.fontSize
          }
        }
        
      , "inputWrapper": {
          width: $ui.FILL
        , height: $ui.SIZE
        , borderRadius: 2
        , borderWidth: 1
        , borderColor: gb.ui.color.grayLightest
        , backgroundGradient: {
            type: 'linear'
          , startPoint: { x: 0, y: '100%' }
          , endPoint:   { x: 0, y: 0 }
          , colors: [{ color: '#f1f1f1', offset: 0.0 }, { color: '#fff', offset: 1.0 }]
          }
        }
        
      , "input": {
          width: $ui.FILL
        , height: $ui.SIZE
        , top: 9
        , bottom: 9
        , left: 6
        , right: 5
        , color: gb.ui.color.grayDark
        , font: {
            fontSize: gb.ui.font.base.fontSize
          }
        }
        
      , "input:indicated": {
          width: $ui.FILL
        , height: $ui.SIZE
        , top: 10
        , bottom: 10
        , left: 6
        , right: 50
        , color: gb.ui.color.grayDark
        , font: {
            fontSize: gb.ui.font.base.fontSize
          }
        }
        
      , "indicator": {
          width: $ui.SIZE
        , height: $ui.SIZE
        , right: 10
        , bottom: -10
        , text: "*"
        , shadowOffset: { x: 0, y: 1 }
        , color: gb.ui.color.green
        , font: {
            fontSize: 36
          , fontWeight: 'bold'
          }
        , opacity: 0
        , build: { type: "createLabel" }
        }
        
      , "wrapper": {
          width: $ui.FILL
        , height: $ui.SIZE
        , left: 6
        , right: 6
        , top: 6
        , bottom: 6
        , layout: 'vertical'
        }  
        
      , "fill": {
          width: $ui.FILL
        , height: $ui.SIZE
        , bottom: 1
        , borderRadius: 5
        , borderWidth: 1
        , borderColor: '#f1f1f1'
        , backgroundColor: '#fff'
        , backgroundGradient: {
            type: 'linear'
          , startPoint: { x: 0, y: '100%' }
          , endPoint:   { x: 0, y: '20%' }
          , colors: [{ color: '#eee', offset: 0.0 }, { color: '#fff', offset: 1.0 }]
          }
        }
        
      , "shadow": {
          width: $ui.FILL
        , height: 5
        , left: 1
        , bottom: 0
        , backgroundColor: '#000'
        , opacity: 0.05
        }
        
      , "bottomNavWrapper": {
          width: $ui.FILL
        , height: $ui.SIZE
        , top: 8
        // , layout: 'horizontal'
        }
        
        /**
         * Island Buttons
         */
      , "buttons": {
          "gray": {
            "default": {
              width: '100dp'
            , height: '40dp'
            , borderRadius: 5
            , borderWidth: 1
            , borderColor: '#D6D6D6'
            , color: gb.ui.color.grayDark
            , font: {
                fontSize: 13
              , fontWeight: 'bold'
              }
            , shadowOffset: { x: 0, y: 1 }
            , shadowColor: gb.ui.color.white
            , opacity: 1
            , backgroundGradient: {
                type: 'linear'
              , startPoint: { x: 0, y: 0 }
              , endPoint:   { x: 0, y: '100%' }
              , colors: [{ color: '#fafafa', offset: 0.0 }, { color: '#e3e3e3', offset: 1.0 }]
              }
            , topShadow: {
                color: '#fff'
              , opacity: 1
              }
            , bottomShadow: {
                color: '#fff'
              , opacity: 1
              }
            }
          , "active": {
              backgroundGradient: {
                type: 'linear'
              , startPoint: { x: 0, y: 0 }
              , endPoint:   { x: 0, y: '100%' }
              , colors: [{ color: '#e3e3e3', offset: 0.0 }, { color: '#e3e3e3', offset: 1.0 }]
              }
            , topShadow: {
                color: '#e3e3e3'
              , opacity: 1
              }
            , opacity: 1
            }
          , "disabled": {
              opacity: 0.4
            }
          } // Gray
        }
      }
       
     /**
      * Gray page buttons
      */ 
    , "buttons": {
        "red": {
          "default": {
            width: $ui.FILL
          , height: '40dp'
          , borderRadius: 5
          , borderWidth: 1
          , borderColor: '#802420'
          , color: gb.ui.color.white
          , font: {
              fontSize: 13
            , fontWeight: 'bold'
            }
          , shadowOffset: { x: 0, y: -1 }
          , shadowColor: '#9f342e'
          , opacity: 1
          , backgroundGradient: {
              type: 'linear'
            , startPoint: { x: 0, y: 0 }
            , endPoint:   { x: 0, y: '100%' }
            , colors: [{ color: '#EE5F5B', offset: 0.0 }, { color: '#BD362F', offset: 1.0 }]
            }
          , topShadow: {
              color: '#f38b88'
            , opacity: 1
            }
          , bottomShadow: {
              color: '#fff'
            , opacity: 0.4
            }
          }
        , "active": {
            backgroundGradient: {
              type: 'linear'
            , startPoint: { x: 0, y: 0 }
            , endPoint:   { x: 0, y: '100%' }
            , colors: [{ color: '#BD362F', offset: 0.0 }, { color: '#BD362F', offset: 1.0 }]
            }
          , topShadow: {
              color: '#BD362F'
            , opacity: 1
            }
          , bottomShadow: {
              color: '#fff'
            , opacity: 0.4
            }
          , opacity: 1
          }
        , "disabled": {
            opacity: 0.4
          }
        } // Red
        
      , "green": {
          "default": {
            width: $ui.FILL
          , height: '40dp'
          , borderRadius: 5
          , borderWidth: 1
          , borderColor: '#387038'
          , color: gb.ui.color.white
          , font: {
              fontSize: 13
            , fontWeight: 'bold'
            }
          , shadowOffset: { x: 0, y: -1 }
          , shadowColor: '#4b904b'
          , opacity: 1
          , backgroundGradient: {
              type: 'linear'
            , startPoint: { x: 0, y: 0 }
            , endPoint:   { x: 0, y: '100%' }
            , colors: [{ color: '#62C462', offset: 0.0 }, { color: '#51A351', offset: 1.0 }]
            }
          , topShadow: {
              color: '#8dd58d'
            , opacity: 1
            }
          , bottomShadow: {
              color: '#fff'
            , opacity: 0.4
            }
          }
        , "active": {
            backgroundGradient: {
              type: 'linear'
            , startPoint: { x: 0, y: 0 }
            , endPoint:   { x: 0, y: '100%' }
            , colors: [{ color: '#51A351', offset: 0.0 }, { color: '#51A351', offset: 1.0 }]
            }
          , topShadow: {
              color: '#51A351'
            , opacity: 1
            }
          , bottomShadow: {
              color: '#fff'
            , opacity: 0.4
            }
          , opacity: 1
          }
        , "disabled": {
            opacity: 0.4
          }
        } // Green
        
          /**
           * Gray Page gray has a less pronounced bottom shadow
           */
        , "gray": {
            "default": {
              width: '100dp'
            , height: '40dp'
            , borderRadius: 5
            , borderWidth: 1
            , borderColor: '#ccc'
            , color: gb.ui.color.grayDark
            , font: {
                fontSize: 13
              , fontWeight: 'bold'
              }
            , shadowOffset: { x: 0, y: 1 }
            , shadowColor: gb.ui.color.white
            , opacity: 1
            , backgroundGradient: {
                type: 'linear'
              , startPoint: { x: 0, y: 0 }
              , endPoint:   { x: 0, y: '100%' }
              , colors: [{ color: '#fafafa', offset: 0.0 }, { color: '#e3e3e3', offset: 1.0 }]
              }
            , topShadow: {
                color: '#fff'
              , opacity: 1
              }
            , bottomShadow: {
                color: '#fff'
              , opacity: 0.4
              }
            }
          , "active": {
              backgroundGradient: {
                type: 'linear'
              , startPoint: { x: 0, y: 0 }
              , endPoint:   { x: 0, y: '100%' }
              , colors: [{ color: '#e3e3e3', offset: 0.0 }, { color: '#e3e3e3', offset: 1.0 }]
              }
            , topShadow: {
                color: '#e3e3e3'
              , opacity: 1
              }
            , opacity: 1
            }
          , "disabled": {
              opacity: 0.4
            }
          } // Gray
      }
    }
    
  , "bluePage": {
      "base": {
        backgroundColor: '#1f7eba'
      }
      
    , "baseText": {
        width: $ui.FILL
      , height: $ui.SIZE
      , shadowOffset: { x: 0, y: -1 }
      , shadowColor: gb.ui.color.blueDark
      , color: gb.ui.color.white
      , font: {
          fontSize: 14
        }
      }
      
    , "header1": {
        width: $ui.FILL
      , height: $ui.SIZE
      , textAlign: "center"
      , color: gb.ui.color.white
      , shadowOffset: { x: 0, y: -1 }
      , shadowColor: gb.ui.color.blueDark
      , font: {
          fontSize: 28
        }
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
          width: $ui.FILL
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
      
      /**
       * Blue Page Buttons
       */
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
              fontSize: 13
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
              color: '#5097c6'
            , opacity: 1
            }
          , bottomShadow: {
              color: '#fff'
            , opacity: 0.08
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
        
      , "gray": {
          "default": {
            width: '100dp'
          , height: '40dp'
          , borderRadius: 5
          , borderWidth: 1
          , borderColor: '#1d70a5'
          , color: gb.ui.color.grayDark
          , font: {
              fontSize: 13
            , fontWeight: 'bold'
            }
          , shadowOffset: { x: 0, y: 1 }
          , shadowColor: gb.ui.color.white
          , opacity: 1
          , backgroundGradient: {
              type: 'linear'
            , startPoint: { x: 0, y: 0 }
            , endPoint:   { x: 0, y: '100%' }
            , colors: [{ color: '#ffffff', offset: 0.0 }, { color: '#b3c8d9', offset: 1.0 }]
            }
          , topShadow: {
              color: '#fff'
            , opacity: 1
            }
          , bottomShadow: {
              color: '#1c73aa'
            , opacity: 1
            }
          }
        , "active": {
            backgroundGradient: {
              type: 'linear'
            , startPoint: { x: 0, y: 0 }
            , endPoint:   { x: 0, y: '100%' }
            , colors: [{ color: '#b3c8d9', offset: 0.0 }, { color: '#b3c8d9', offset: 1.0 }]
            }
          , opacity: 1
          }
        , "disabled": {
            opacity: 0.4
          }
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