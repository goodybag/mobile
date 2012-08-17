
gb.style.base.nearby = {
  self: {
    top: 54,
    backgroundColor: 'white',
    build: { type: 'createView' }
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
        color: '#555',
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
        color: '#aaaaaa',
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
        top: 10,
        text: 'Back',
        color: '#aaa',
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
            ctx.$this.self.remove(ctx.$this.elements.place);
            ctx.$this.self.add(ctx.save[0]);
            ctx.$this.self.add(ctx.save[1]);
          }
        }
      }
    },
    
    image: {
      top: 30,
      left: 10,
      build: { type: 'createImageView' }
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