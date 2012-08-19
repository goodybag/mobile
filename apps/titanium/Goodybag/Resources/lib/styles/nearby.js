
gb.style.base.nearby = {
  self: {
    top: 54,
    backgroundColor: 'white',
    build: { type: 'createWindow' }
  },
  
  holder: {
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
  
  loc: {
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
    
    header: {
      base: {
        top: 5,
        layout: 'horizontal',
        height: $ui.SIZE,
        // backgroundColor: 'green',
        build: { type: 'createView' }
      },
      
      left: {
        left: 0,
        width: 130,
        height: $ui.SIZE,
        layout: 'vertical',
        // backgroundColor: 'yellow',
        build: { type: 'createView' }
      },
      
      right: {
        top: 0,
        right: 0,
        width: 190,
        height: $ui.SIZE,
        layout: 'vertical',
        // backgroundColor: 'red',
        build: { type: 'createView' }
      },
      
      sideLabel: {
        left: 10,
        right: 10,
        build: { type: 'createLabel' }
      },
      
      name: {
        top: 5,
        color: gb.ui.color.grayDarker,
        font: {
          fontSize: 14,
          fontStyle: 'normal',
          fontWeight: 'bold'
        }
      },
      
      details: {
        top: 4,
        color: gb.ui.color.gray,
        font: {
          fontSize: 13
        }
      },
      
      number: {
        top: 4,
        color: gb.ui.color.blue,
        font: {
          fontSize: 12
        }
      },
      
      url: {
        top: 3,
        color: gb.ui.color.blue,
        font: {
          fontSize: 12,
          fontStyle: 'underline'
        }
      },
      
      points: {
        base: {
          top: 5,
          height: $ui.SIZE,
          layout: 'horizontal',
          build: { type: 'createView' }
        },
        
        amount: {
          left: 10,
          color: gb.ui.color.blue,
          font: {
            fontSize: 14,
            fontWeight: 'bold'
          },
          build: { type: 'createLabel' }
        },
        
        text: {
          left: 5,
          bottom: 2,
          color: gb.ui.color.gray,
          font: {
            fontSize: 12,
            fontStyle: 'underline'
          },
          build: { type: 'createLabel' }
        }
      },
      
      image: {
        left: 10,
        borderColor: '#f5f5f5',
        borderWidth: 3,
        build: { type: 'createImageView' }
      }
    },
    
    goodies: {
      base: {
        // backgroundColor: 'blue',
        layout: 'vertical',
        backgroundColor: '#eee',
        disableBounce: true,
        build: { type: 'createScrollView' }
      }
    },
    
    goody: {
      base: {
        top: 1,
        height: $ui.SIZE,
        backgroundColor: 'white',
        layout: 'horizontal',
        build: { type: 'createView' }
      },
      
      spacer: {
        width: $ui.FILL,
        height: $ui.SIZE,
        top: 6,
        build: { type: 'createView' }
      },
      
      icon: {
        top: 10,
        left: 10,
        bottom: 10,
        height: 16,
        color: gb.ui.color.blueBright,
        font: {
          fontSize: 14,
          fontWeight: 'bold'
        },
        build: { type: 'createLabel' }
      },
      
      label: {
        top: 10,
        left: 10,
        bottom: 10,
        height: 16,
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
