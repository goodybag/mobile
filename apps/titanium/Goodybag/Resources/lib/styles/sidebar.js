(function ($dp, $ui, $color, $font, $base, $iphone, $android, $retina, $xhdpi, $hdpi, $mdpi, $ldpi) {
  $base.sidebar = {
    self: {
      top: 0,
      right: -$dp.platformWidth,
      bottom: 0,
      zIndex: 4,
      width: 'platform',
      backgroundColor: '#24303b',
      build: { type: 'createView' }
    },
    
    header: {
      background: {
        width: 'platform',
        height: $ui.SIZE,
        top: 0,
        left: 0,
        zIndex: 1,
        backgroundImage: 'screens/sidebar/header.png',
        build: { type: 'createView' },
      },
      
      username: {
        top: 14,
        left: 58,
        zIndex: 2,
        color: '#FFFFFF',
        shadowColor: '#27333e',
        shadowOffset: {  x: -1, y: 0 },
        font: { 
          fontSize: '18dp',
          fontFamily: 'Helvetica Neue',
          fontStyle: 'normal',
          fontWeight: 'bold' 
        },
        build: { type: 'createLabel' }
      },
      
      avatar: {
        background: {
          top: 2,
          left: 3,
          width: 48,
          height: 48,
          zIndex: 1,
          backgroundColor: '#1d2730',
          build: { type: 'createView' }
        },
        
        image: {
          top: 1,
          left: 1,
          width: 46,
          height: 46,
          zIndex: 3,
          build: { type: 'createImageView' }
        }
      }
    },
    
    bank: {
      background: {
        width: 'platform',
        height: $ui.SIZE,
        top: 54,
        backgroundImage: 'screens/sidebar/bank.png',
        build: { type: 'createView' }
      },
      
      slots: {
        base: {
          top: 62,
          zIndex: 2,
          color: '#888888',
          shadowColor: '#f0f0f0',
          shadowOffset: { 
            x: -1, y: 0 
          },
          font: { 
            fontSize: '24dp', 
            fontFamily: 'Helvetica Neue', 
            fontStyle: 'normal', 
            fontWeight: 'bold' 
          },
          build: { 
            type: 'createLabel'
          },
          visible: false
        },
  
        one:    { left: 22,    text: '$', visible: true },
        two:    { left: 57,    text: '9' },
        three:  { left: 95,    text: '9' },
        four:   { left: 130,   text: '9' },
        five:   { left: 170,   text: '.' },
        six:    { left: 203,   text: '9' },
        seven:  { left: 240,   text: '9' }
      }
    },
    
    list: {
      base: {
        top: '102dp',
        layout: 'vertical',
        build: { type: 'createView' },
      },
      
      item: {
        base: {
          top: -1,
          left: -1,
          height: 50,
          width: $ui.FILL,
          layout: 'horizontal',
          background: '#24303b',
          borderWidth: 1,
          borderColor: '#2f3b45',
          build: { type: 'createView' }
        },
        
        inactive: {
          top: 5,
          bottom: 5,
          left: 5,
          color: '#9baab9',
          font: {
            fontSize: 20
          },
          shadowColor: '#1c262f',
          shadowOffset: { x: 0, y: 1 }
        },
        
        active: {
          color: '#cfdae4',
          background: '#1c2228'
        },
      },
      
      nearby: {
        icon: {
          left: 10,
          width: 28,
          textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
          text: Ligature.get('pin'),
          font: {
            fontFamily: Ligature.typeface(),
            fontSize: 36
          },
          build: { type: 'createLabel' }
        },
        
        text: {
          text: 'Nearby Places',
          left: 8,
          font: {
            fontWeight: 'bold'
          },
          build: { type: 'createLabel' }
        },
      },
      
      activity: {
        icon: {
          left: 10,
          width: 28,
          textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
          text: Ligature.get('globe'),
          font: {
            fontFamily: Ligature.typeface(),
            fontSize: 36
          },
          build: { type: 'createLabel' }
        },
        
        text: {
          text: 'Activity Stream',
          left: 8,
          font: {
            fontWeight: 'bold'
          },
          build: { type: 'createLabel' }
        }
      },
      
      settings: {
        icon: {
          left: 10,
          width: 28,
          textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
          text: Ligature.get('setting'),
          font: {
            fontFamily: Ligature.typeface(),
            fontSize: 36
          },
          build: { type: 'createLabel' }
        },
        
        text: {
          text: 'Settings',
          left: 8,
          font: {
            fontWeight: 'bold'
          },
          build: { type: 'createLabel' }
        }
      },
      
      update: {
        icon: {
          left: 10,
          width: 28,
          textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
          text: Ligature.get('save'),
          font: {
            fontFamily: Ligature.typeface(),
            fontSize: 36
          },
          build: { type: 'createLabel' }
        },
        
        text: {
          text: 'Download Update',
          left: 8,
          font: {
            fontWeight: 'bold'
          },
          build: { type: 'createLabel' }
        }
      }
    }
  };
  
  $retina.sidebar = {
    bank: {
      slots: {
        base: {
          top: 60
        },
        
        one:    { left: 16 },
        two:    { left: 53 },
        three:  { left: 90 },
        four:   { left: 130 },
        five:   { left: 169 },
        six:    { left: 203 },
        seven:  { left: 238 }
      }
    }
  };
  
  $mdpi.sidebar = {
    header: {
      background: {
        width: 'platform',
        height: 54
      },
      
      avatar: {
      }
    },
    
    bank: {
      background: {
        width: 'platform',
        height: 50,
        top: 54,
        left: 0
      },
      
      slots: {
        base: {
          top: 8
        }
      }
    }
  };
  
  $hdpi.sidebar = {
    self: {
      right: -gb.utils.px2dp($dp.platformWidth)
    },
    
    header: {
      background: {
        width: 'platform',
        height: 54,
        left: 0
      },
      
      avatar: {
        background: {
          height: 46.7,
          width: 46.7
        },
        image: {
          top: .7,
          left: .7,
          width: 45,
          height: 45
        }
      }
    },
    
    bank: {
      background: {
        width: 'platform',
        height: 45,
        top: 54,
        left: 0
      },
      
      slots: {
        base: {
          top: 3
        }
      }
    }
  };
  
  $xhdpi.sidebar = {
    self: {
      right: -gb.utils.px2dp($dp.platformWidth)
    },
    
    header: {
      background: {
        width: 'platform',
        height: 54,
        left: 0
      },
      
      avatar: {
        background: {
          height: 46.7,
          width: 46.7
        },
        image: {
          top: .7,
          left: .7,
          width: 45,
          height: 45
        }
      }
    },
    
    bank: {
      background: {
        width: 'platform',
        height: 45,
        top: 54,
        left: 0
      },
      
      slots: {
        base: {
          top: 3
        },
        
        one:    { left: 17 },
        two:    { left: 56 },
        three:  { left: 100 },
        four:   { left: 143 },
        five:   { left: 190 },
        six:    { left: 228 },
        seven:  { left: 268 }
      }
    }
  };
})(
  Ti.Platform.displayCaps, Ti.UI, gb.ui.color, gb.ui.font,
  gb.style.base, gb.style.iphone, gb.style.android,
  gb.style.retina, gb.style.xhdpi, gb.style.hdpi, gb.style.mdpi, gb.style.ldpi
);