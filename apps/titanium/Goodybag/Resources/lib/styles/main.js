
gb.style.iphone.main = {
  self: {
    top: 0,
    title: 'Main',
    backgroundImage: 'background.png'
  },
  
  views: {
    holder: {
      layout: 'horizontal',
      contentWidth: 'auto',
      scrollType: 'horizontal',
      horizontalBounce: false,
      horizontalWrap: false,
      disableBounce: true,
      focusable: false,
      nomagic: true
    },
    
    main: {
      width: 'platform',
      backgroundColor: 'black'
    }
  },
  
  header: {
    background: {
      top: 0,
      zIndex: 1,
      image: 'screens/main/header.png'
    },
    
    logo: {
      top: 5,
      zIndex: 2,
      image: 'screens/main/logo.png'
    },
    
    buttons: {
      sidebar: {
        top: 10,
        left: 10,
        zIndex: 2,
        width: 'auto',
        height: 'auto',
        canScale: false,
        image: 'screens/main/buttons/sidebar_default.png'
      }
    }
  },
  
  animations: {
    right: { 
      left: $dp.platformWidth - 40, 
      duration: 250 
    },
    
    left: {
      left: 0, 
      duration: 250
    }
  }
};

gb.style.retina.main = {
  animations: {
    right: {
      left: $dp.platformWidth - 50
    }
  }
}