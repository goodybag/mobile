
gb.style.base.nearby = {
  self: {
    top: 54,
    backgroundColor: 'white',
    build: { type: 'createWindow' }
  },
  
  holder: {
    bottom: 44,
    backgroundColor: 'white',
    build: { type: 'createView' }
  },
  
  places: {
    backgroundColor: 'white',
    layout: 'vertical',
    build: { type: 'createScrollView' }
  },
  
  menu: {
    base: {
      layout: 'horizontal',
      height: 44,
      bottom: 0,
      zIndex: 4,
      backgroundImage: 'screens/stream/Menu.png',
      build: { type: 'createView' }
    }
  },
  
  place: {
    row: {
      view: {
        color: 'black',
        borderColor: '#eceece',
        backgroundColor: 'white',
        height: 50,
        build: { type: 'createView' }
      },
      
      name: {
        left: 10,
        top: 5,
        color: gb.ui.color.grayDark,
        font: {
          fontSize: 14,
          fontStyle: 'normal',
          fontWeight: 'bold'
        },
        build: { type: 'createLabel' }
      },
      
      locations: {
        left: 15,
        top: 24,
        color: gb.ui.color.gray,
        font: {
          fontSize: 12,
          fontStyle: 'normal',
          fontWeight: 'bold'
        },
        build: { type: 'createLabel' }
      }
    }
  },
  
  location: {
    buttons: {
      back: {
        left: 10,
        top: 5,
        text: 'Back',
        color: gb.ui.color.gray,
        font: {
          fontSize: 14,
          fontStyle: 'normal',
          fontWeight: 'bold'
        },
        build: { 
          type: 'createLabel' 
        },
        events: {
          click: function (args, ctx) {
            var $this = ctx.$this, $self = $this.self, $el = $this.elements;
            $el.place.setVisible(false);
            $el.holder.setVisible(true);
            $el.menu.base.setVisible(true);
          }
        }
      }
    },
    
    modal: {
      modal: true
    },
    
    holder: {
      layout: 'vertical',
      backgroundColor: '#fafafa',
      build: { type: 'createScrollView' }
    },
 
    header: {
      base: {
        height: $ui.SIZE,
        top: 10,
        left: 10,
        right: 10,
        layout: 'horizontal',
        borderWidth: 1,
        borderRadius: 4,
        borderColor: '#ccc',
        backgroundGradient: {
          type: 'linear',
          startPoint: { x: '0%', y: '0%' },
          endPoint: { x: '0%', y: '100%' },
          colors: [ { color: 'white', offset: 0.0}, { color: 'white', offset: 0.80 }, { color: '#f9f9f9', offset: 1.0 }  ],
        },
        build: { type: 'createView' }
      },
      
      left: {
        left: 10,
        width: 80,
        height: $ui.SIZE,
          layout: 'vertical',
        build: { type: 'createView' }
      },
      
      right: {
        top: 0,
        left: 10,
        right: 0,
        width: 190,
        height: $ui.SIZE,
        layout: 'vertical',
        build: { type: 'createView' }
      },
      
      image: {
        width: 80,
        height: 80,
        top: 10,
        bottom: 10,
        borderWidth: 2,
        borderRadius: 5,
        borderColor: 'rgba(0,0,0,0.2)',
        build: { type: 'createImageView' }
      },
      
      name: {
        top: 15,
        color: gb.ui.color.grayDarker,
        font: {
          fontSize: 14,
          fontStyle: 'normal',
          fontWeight: 'bold'
        },
        build: { type: 'createLabel' }
      },
      
      details: {
        top: 4,
        color: gb.ui.color.gray,
        font: {
          fontSize: 12
        },
        build: { type: 'createLabel' }
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
          color: '#aaa',
          font: {
            fontSize: 10,
            fontWeight: 'bold'
          },
          shadowColor: gb.ui.color.white,
          shadowOffset: { x: 0, y: 1 },
          build: { type: 'createLabel' }
        },
        
        two: {
          left: 5,
          color: gb.ui.color.blue,
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
      
    goodies: {
      base: {
        height: $ui.SIZE,
        layout: 'vertical',
        build: { type: 'createView' }
      },
      
      err: {
        height: $ui.FILL,
        color: gb.ui.color.grayLighter,
        font: {
          fontSize: 18,
          fontWeight: 'bold'
        },
        build: { type: 'createLabel' }
      }
    },
    
    goody: {
      base: {
        top: 1,
        height: $ui.SIZE,
        backgroundColor: 'white',
        build: { type: 'createView' }
      },
      
      spacer: {
        width: $ui.FILL,
        height: $ui.SIZE,
        top: 6,
        build: { type: 'createView' }
      },
      
      icon: {
        base: {
          width: $ui.SIZE,
          height: 16,
          top: 10,
          bottom: 10,
          right: 10,
          backgroundColor: gb.ui.color.white,
          layout: 'horizontal',
          build: { type: 'createView' }
        },
        
        amount: {
          color: gb.ui.color.blue,
          font: {
            fontSize: 14,
            fontWeight: 'bold'
          },
          build: { type: 'createLabel' }
        },
        
        text: {
          left: 2,
          color: gb.ui.color.grayLighter,
          font: {
            fontSize: 10,
            fontWeight: 'bold'
          },
          build: { type: 'createLabel' }
        }
      },
      
      label: {
        top: 10,
        left: 10,
        right: 60,
        bottom: 10,
        height: $ui.SIZE,
        color: gb.ui.color.gray,
        font: {
          fontSize: 13,
          fontWeight: 'bold'
        },
        build: { type: 'createLabel' }
      }
    },
    
    row: {
      view: {
        color: 'black',
        borderColor: '#eceece',
        backgroundColor: 'white',
        height: 50,
        build: { type: 'createView' }
      },
      
      name: {
        left: 10,
        top: 5,
        color: '#555',
        font: {
          fontSize: 14,
          fontStyle: 'normal',
          fontWeight: 'bold'
        },
        build: { type: 'createLabel' }
      },
      
      distance: {
        left: 15,
        top: 24,
        color: '#aaaaaa',
        font: {
          fontSize: 12,
          fontStyle: 'normal',
          fontWeight: 'bold'
        },
        build: { type: 'createLabel' }
      }
    }
  }
};

gb.style.iphone.nearby = {
  location: {
    modal: {
      modalStyle: $ui.iPhone.MODAL_PRESENTATION_FORMSHEET
    }
  }
}
