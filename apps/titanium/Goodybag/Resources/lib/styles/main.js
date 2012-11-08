(function ($dp, $ui, $color, $font, $base, $iphone, $android, $retina, $xhdpi, $hdpi, $mdpi, $ldpi) {
  $base.main = {
    self: {
      top: 0,
      title: 'Main',
      fullscreen: false,
      navBarHidden: true,
      backgroundImage: 'background.png',
      backgroundColor: 'white',
      build: { type: 'Window' }
    },
    
    views: {
      holder: {
        contentWidth: 'auto',
        layout: 'horizontal',
        scrollType: 'horizontal',
        horizontalBounce: false,
        horizontalWrap: false,
        disableBounce: true,
        focusable: false,
        nomagic: true
      },
      
      main: {
        left: 0,
        zIndex: 10,
        width: 'platform',
        backgroundColor: 'white'
      }
    },
    
    header: {
      background: {
        top: 0,
        height: $ui.SIZE,
        zIndex: 20,
        canScale: false,
        backgroundImage: 'screens/main/header.png',
        backgroundColor: 'black',
        build: { type: 'createView' }
      },
      
      logo: {
        top: '5dp',
        zIndex: 21,
        image: 'screens/main/logo.png',
        build: { type: 'createImageView' }
      },
      
      buttons: {
        sidebar: {
          top: '10dp',
          left: '10dp',
          zIndex: 21,
          width: 'auto',
          height: 'auto',
          canScale: false,
          image: 'screens/main/buttons/sidebar_default.png'
        },
        
        qrcode: {
          top: '10dp',
          right: '10dp',
          zIndex: 21,
          width: 'auto',
          height: 'auto',
          canScale: false,
          image: 'screens/main/buttons/qrcode_default.png'
        }
      }
    },
    
    animations: {
      right: { 
        left: $dp.platformWidth - 40,
        duration: 250,
        locked: true
      },
      
      left: {
        left: 0, 
        duration: 250,
        locked: true
      }
    }
  };
  
  $retina.main = {
    animations: {
      right: {
        left: $dp.platformWidth - 50
      }
    }
  };
  
  if (Ti.Android) {
    $mdpi.main = {
      header: {
        background: { height: 54 }
      }
    }
    
    $hdpi.main = {
      self: { width: 'platform' },
      
      header: {
        background: { width: 'platform', height: 54 },
        logo: { height: '64px' },
        buttons: {
          sidebar: { top: 3 },
          qrcode: { top: 3 }
        }
      },
      
      animations: {
        right: {
          left: $dp.platformWidth - 60
        }
      }
    };
  }
})(
  Ti.Platform.displayCaps, Ti.UI, gb.ui.color, gb.ui.font,
  gb.style.base, gb.style.iphone, gb.style.android,
  gb.style.retina, gb.style.xhdpi, gb.style.hdpi, gb.style.mdpi, gb.style.ldpi
);