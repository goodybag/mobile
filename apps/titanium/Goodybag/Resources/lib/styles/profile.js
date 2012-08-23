
gb.style.base.profile = {
  self: {
    top: 54,
    backgroundColor: 'white',
    build: { type: 'createWindow' }
  },
 
  holder: {
    layout: 'vertical',
    backgroundColor: '#fafafa',
    build: { type: 'createScrollView' }
  },
 
  header: {
    base: {
      width: $ui.FILL,
      height: $ui.SIZE,
      top: 10,
      left: 10,
      right: 10,
      layout: 'horizontal',
      borderWidth: 1,
      borderRadius: 4,
      borderColor: '#b7bebf',
      backgroundColor: gb.ui.color.white,
      backgroundGradient: {
        type: 'linear',
        startPoint: { x: '0%', y: '0%' },
        endPoint: { x: '0%', y: '100%' },
        colors: [ { color: 'white', offset: 0.0}, { color: 'white', offset: 0.80 }, { color: '#f9f9f9', offset: 1.0 }  ],
      },
      build: { type: 'createView' }
    },
   
    left: {
      width: 90,
      top: 10,
      left: 5,
      bottom: 10,
      height: $ui.SIZE,
      layout: 'vertical',
      build: { type: 'createView' }
    },
   
    right: {
      width: 190,
      top: 10,
      right: 0,
      bottom: 10,
      height: $ui.SIZE,
      layout: 'vertical',
      build: { type: 'createView' }
    },
   
    image: {
      width: 80,
      height: 80,
      top: 0,
      borderWidth: 2,
      borderRadius: 5,
      borderColor: 'rgba(0,0,0,0.2)',
      build: { type: 'createImageView' }
    },
   
    sideLabel: {
      left: 10,
      right: 5,
      build: { type: 'createLabel' }
    },
    
    name: {
      color: gb.ui.color.grayDarker,
      font: {
        fontSize: 18,
        fontStyle: 'normal',
        fontWeight: 'bold'
      }
    },
    
    username: {
      top: 2,
      color: gb.ui.color.gray,
      font: {
        fontSize: 13,
        fontWeight: 'bold'
      }
    },
    
    location: {
      top: 4,
      color: gb.ui.color.gray,
      font: {
        fontSize: 12
      }
    },
    
    joined: {
      top: 2,
      color: gb.ui.color.gray,
      font: {
        fontSize: 12
      }
    },
    
    sub: {
      base: {
        width: $ui.FILL,
        height: $ui.SIZE,
        top: 10,
        left: 10,
        right: 10,
        borderWidth: 1,
        borderColor: '#bcc2c3',
        borderRadius: 4,
        backgroundColor: '#cfd3d4',
        layout: 'horizontal',
        build: { type: 'createView' }
      },
      
      inner: {
        width: $ui.FILL,
        height: $ui.SIZE,
        top: 2,
        borderWidth: 1,
        borderRadius: 3,
        borderColor: '#e9ecee',
        backgroundColor: '#e9ecee',
        layout: 'horizontal',
        build: { type: 'createView' }
      },
      
      padding: {
        height: $ui.SIZE,
        top: 6,
        bottom: 8
      },
      
      one: {
        left: 8,
        color: gb.ui.color.grayDark,
        font: {
          fontSize: 12,
          fontWeight: 'bold'
        },
        shadowColor: gb.ui.color.white,
        shadowOffset: { x: 0, y: 1 },
        build: { type: 'createLabel' }
      },
      
      two: {
        left: 5,
        color: gb.ui.color.gray,
        font: {
          fontSize: 12
        },
        shadowColor: gb.ui.color.white,
        shadowOffset: { x: 0, y: 1 },
        build: { type: 'createLabel' }
      }
    }
  },
  
  title: {
    base: {
      width: $ui.FILL,
      height: $ui.SIZE,
      left: 10,
      right: 10,
      layout: 'horizontal',
      disableBounce: true,
      build: { type: 'createView' }
    },
    
    header: {
      top: 10,
      left: 0,
      bottom: 5,
      height: $ui.SIZE,
      color: gb.ui.color.grayDarker,
      font: {
        fontSize: 14,
        fontWeight: 'bold'
      },
      build: { type: 'createLabel' }
    },
    
    subHeader: {
      top: 10,
      bottom: 5,
      left: 5,
      height: $ui.SIZE,
      color: gb.ui.color.grayLighter,
      font: {
        fontSize: 12,
        fontWeight: 'bold'
      },
      build: { type: 'createLabel' }
    }
  },
  
  locations: {
    base: {
      width: $ui.FILL,
      height: $ui.SIZE,
      left: 10,
      right: 10,
      layout: 'vertical',
      disableBounce: true,
      build: { type: 'createView' }
    },
    
    item: {
      base: {
        width: $ui.FILL,
        height: $ui.SIZE,
        bottom: 5,
        borderWidth: 1,
        borderColor: gb.ui.color.silver,
        borderRadius: 4,
        backgroundColor: gb.ui.color.platinum,
        build: { type: 'createView' }
      },
      
      inner: {
        base: {
          top: 2,
          width: $ui.FILL,
          height: $ui.SIZE,
          borderWidth: 1,
          borderRadius: 3,
          borderColor: gb.ui.color.offWhite,
          backgroundColor: gb.ui.color.offWhite,
          build: { type: 'createView' }
        },
      
        image: {
          base: {
            width: 26,
            height: 26,
            left: 5,
            borderWidth: 1,
            borderRadius: 3,
            borderColor: gb.ui.color.white,
            backgroundColor: gb.ui.color.offWhite,
            build: { type: 'createView' }
          },
          
          container: {
            width: 25,
            height: 25,
            top: 1, bottom: 1,
            left: 1, right: 1,
            build: { type: 'createImageView' }
          }
        },
        
        name: {
          height: $ui.SIZE,
          top: 8,
          left: 35,
          bottom: 10,
          color: gb.ui.color.grayDark,
          font: {
            fontSize: 12,
            fontWeight: 'bold'
          },
          build: { type: 'createLabel' }
        },
        
        tapins: {
          width: $ui.SIZE,
          height: $ui.SIZE,
          top: 7,
          right: 10,
          bottom: 10,
          color: gb.ui.color.blue,
          font: {
            fontSize: 14,
            fontWeight: 'bold'
          },
          shadowColor: gb.ui.color.white,
          shadowOffset: { x: 0, y: 1 },
          build: { type: 'createLabel' }
        }
      }
    }
  }
};