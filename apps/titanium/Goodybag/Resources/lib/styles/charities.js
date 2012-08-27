
gb.style.base.charities = {
  self: {
    width: $ui.FILL
  , height: $ui.FILL
  , top: 54
  , backgroundColor: '#ddd'
  , layout: 'vertical'
  , build: { type: 'View' }
  },
  
  charity: {
    "list": {
      base: {
        width: $ui.FILL
      , height: $ui.FILL
      , layout: 'vertical'
      , showVerticalScrollIndicator: true
      , build: { type: 'ScrollView' }
      },
      
      "header": {
        text: "Choose a Charity to Raise Funds For!"
      , width: $ui.FILL
      , height: $ui.SIZE
      , top: 16
      , bottom: 16
      , color: gb.ui.color.grayDarker
      , textAlign: "center"
      , font: {
          fontSize: 16
        , fontWeight: 'bold'
        }
      , shadowColor: '#fff'
      , shadowOffset: { x: 0, y: 1 }
      , build: { type: 'Label' }
      }
    },
    
    details: {
      base: {
        width: $ui.FILL
      , layout: 'vertical'
      , top: 10
      , build: { type: 'View' }
      },
    
      content: {
        base: {
          width: '318dp'
        , height: '333dp'
        , top: 0
        , backgroundImage: 'screens/charity/charity_backdrop.png'
        , build: { type: 'View' }
        },
        
        wrapper: {
          base: {
            width: $ui.FILL
          , height: $ui.SIZE
          , left: 12
          , right: 12
          , top: 0
          , layout: 'vertical'
          , build: { type: 'View' }
          },
          
          header: {
            base: {
              width: $ui.FILL
            , height: '44dp'
            , top: '12dp'
            , build: { type: 'View' }
            },
            
            left: {
              base: {
                width: '210dp'
              , height: $ui.SIZE
              , left: 0
              , top: '8dp'
              , layout: 'vertical'
              , build: { type: 'View' }
              },
              
              name: {
                width: $ui.FILL
              , height: $ui.SIZE
              , color: gb.ui.color.grayDark
              , font: {
                  fontSize: 14
                , fontWeight: 'bold'
                }
              , build: { type: 'Label' }
              },
              
              url: {
                width: $ui.FILL
              , height: $ui.SIZE
              , top: '-2dp'
              , color: gb.ui.color.blueBright
              , font: {
                  fontSize: 12
                }
              , build: { type: 'Label' }
              }
            },
            
            right: {
              base: {
                width: '80dp'
              , right: 0
              , build: { type: 'View' }
              },
              
              logo: {
                height: '44dp'
              , center: { x: '54dp', y: '22dp' }
              , build: { type: 'ImageView' }
              }
            }
          },
          
          content: {
            base: {
              width: $ui.FILL
            , height: $ui.SIZE
            , build: { type: 'View' }
            },
            
            text: {
              text: 'loading'
            , width: $ui.FILL
            , height: $ui.SIZE
            , color: gb.ui.color.base
            , font: {
                fontSize: gb.ui.font.fontSize
              }
            , build: { type: 'Label' }
            }
          }
        },
      }
    },
    
    select: {
      style: Titanium.UI.iPhone.SystemButtonStyle.PLAIN
    , bottom: 12
    , build: { type: 'Button' }
    },
    
    bottom: {
      base: {
        width: $ui.FILL
      , height: $ui.SIZE
      , top: 8
      , build: { type: 'View' }
      },
      
      back: {
        image: 'screens/charity/buttons/charity_back.png'
      , width: 304
      , height: 47
      , borderWidth: 0
      , borderColor: null
      , style: Titanium.UI.iPhone.SystemButtonStyle.PLAIN
      , backgroundColor: 'transparent'
      , build: { type: 'Button' }
      }
    }
  }
};
