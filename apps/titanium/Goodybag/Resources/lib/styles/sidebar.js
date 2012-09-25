
gb.style.base.sidebar = {
  self: {
    right: -$dp.platformWidth,
    width: 'platform',
    bottom: 0,
    backgroundColor: '#24303b',
    build: { type: 'createView' }
  },
  
  header: {
    background: {
      top: 0,
      zIndex: 1,
      image: 'screens/sidebar/header.png',
      build: { type: 'createImageView' },
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
      image: {
        top: 3,
        left: 4,
        width: 46,
        height: 46,
        zIndex: 3,
        build: { type: 'createImageView' }
      },
      
      background: {
        top: 2,
        left: 3,
        width: 48,
        height: 48,
        zIndex: 2,
        backgroundColor: '#1d2730',
        build: { type: 'createLabel' }
      },
    }
  },
  
  bank: {
    background: {
      top: 54,
      image: 'screens/sidebar/bank.png',
      build: { type: 'createImageView' }
    },
    
    slots: {
      base: {
        top: 62,
        zIndex: 2,
        color: '#888888',
        shadowColor: '#ffffff',
        shadowOffset: { 
          x: -1, y: 0 
        },
        font: { 
          fontSize: '13dp', 
          fontFamily: 'Helvetica Neue', 
          fontStyle: 'normal', 
          fontWeight: 'bold' 
        },
        build: { 
          type: 'createLabel'
        },
        visible: false
      },
      
      one:    { left: 14,    text: '$', visible: true },
      two:    { left: 32,    text: ' ' },
      three:  { left: 48,    text: '2' },
      four:   { left: 64,    text: '3' },
      five:   { left: 80,    text: '4' },
      six:    { left: 96,    text: ',' },
      seven:  { left: 112,   text: '6' },
      eight:  { left: 128,   text: '7' },
      nine:   { left: 144,   text: '8' },
      ten:    { left: 160,   text: ',' },
      eleven: { left: 176,   text: '0' },
      twelve: { left: 192,   text: '1' },
      thteen: { left: 208,   text: '2' },
      frteen: { left: 224,   text: '.' },
      ffteen: { left: 240,   text: '3' },
      sxteen: { left: 255,   text: '4' }
    }
  },
  
  list: {
    base: {
      top: 88,
      layout: 'vertical',
      build: { type: 'createView' },
    },
    
    item: {
      base: {
        top: -1,
        left: -1,
        height: 50,
        width: Ti.UI.FILL,
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
        font: {
          fontWeight: 'bold'
        },
        build: { type: 'createLabel' }
      }
    }
  }
};

gb.style.retina.sidebar = {
  bank: {
    slots: {
      base: {
        top: 60
      },
      
      one:    { left: 10 },
      two:    { left: 27 },
      three:  { left: 42 },
      four:   { left: 58 },
      five:   { left: 73 },
      six:    { left: 91 },
      seven:  { left: 105 },
      eight:  { left: 121 },
      nine:   { left: 137 },
      ten:    { left: 154 },
      eleven: { left: 169 },
      twelve: { left: 185 },
      thteen: { left: 201 },
      frteen: { left: 219 },
      ffteen: { left: 234 },
      sxteen: { left: 249 }
    }
  }
};
