(function ($dp, $ui, $color, $font, $base, $iphone, $android, $retina, $xhdpi, $hdpi, $mdpi, $ldpi) {
  $base.login = {
    window: {
      title: 'Login',
      top: 0.1,
      fullscreen: false,
      navBarHidden: true,
      backgroundImage: 'background.png',
      build: { type: 'createWindow' }
    },
  
    view: {
      contentWidth: 'auto',
      contentHeight: 'auto',
      top: 0,
      width: $dp.platformWidth,
      build: { type: 'createView' }
    },
  
    loginWrapper: {
      width: $ui.FILL,
      height: $ui.FILL,
      showVerticalScrollIndicator: true,
      showHorizontalScrollIndicator: false,
      zIndex: 2,
      backgroundImage: 'background.png',
      build: { type: 'createScrollView' }
    },
  
    registerWrapper: {
      width: $ui.FILL,
      height: $ui.SIZE,
      contentWidth: 'auto',
      contentHeight: 'auto',
      top: 0,
      zIndex: 1,
      visible: false,
      build: { type: 'createView' }
    },
  
    background: {
      image: 'screens/login/background.png',
      build: { type: 'createImageView' }
    },
  
    buttons: {
      facebook: {
        top: 150,
        image: 'screens/login/facebook.png',
        build: { type: 'createImageView' }
      },
  
      submit: {
        top: 320,
        image: 'screens/login/login.png',
        build: { type: 'createImageView' }
      },
  
      register: {
        top: 408,
        image: 'screens/login/register.png',
        build: { type: 'createImageView' }
      }
    },
  
    fields: {
      base: {
        left: 80,
        width: 195,
        height: 40,
        color: '#888',
        backgroundImage: 'screens/login/transparent.png',
        borderStyle: $ui.INPUT_BORDERSTYLE_NONE,
        autocapitalization: $ui.TEXT_AUTOCAPITALIZATION_NONE,
        autocorrect: false,
        build: {
          type: 'createTextField'
        }
      },
  
      background: {
        top: 220,
        image: 'screens/login/inputs.png',
        build: { type: 'createImageView' }
      },
  
      email: {
        top: 228,
        hintText: 'Email',
        keyboardType: $ui.KEYBOARD_EMAIL,
      },
  
      password: {
        top: 270,
        hintText: 'Password',
        passwordMask: true
      }
    }
  };
  
  if (Ti.Android) {
    $android.login = {
      loginWrapper: { windowSoftInputMode: Ti.UI.Android.SOFT_INPUT_ADJUST_PAN },
      
      registerWrapper: {
        width: $dp.platformWidth,
        height: $ui.FILL
      },
      
      fields: {
        email: { softKeyboardOnFocus : Ti.UI.Android.SOFT_KEYBOARD_HIDE_ON_FOCUS },
        password: { softKeyboardOnFocus : Ti.UI.Android.SOFT_KEYBOARD_HIDE_ON_FOCUS }
      }
    };
    
    $hdpi.login = {
      registerWrapper: {
        width: $ui.SIZE,
        height: $ui.FILL
      },
      
      buttons: {
        facebook: {
          top: 160,
          width: '60%',
          height: $ui.SIZE,
        },
        
        submit: {
          top: 340,
          width: '60%',
          height: $ui.SIZE,
        },
        
        register: { top: 420 }
      },
      
      fields: {
        base: { left: 130, width: 205 },
        email: { top: 240 },
        password: { top: 290 },
        
        background: {
          width: '60%',
          height: $ui.SIZE,
        }
      }
    };
  }
})(
  Ti.Platform.displayCaps, Ti.UI, gb.ui.color, gb.ui.font,
  gb.style.base, gb.style.iphone, gb.style.android,
  gb.style.retina, gb.style.xhdpi, gb.style.hdpi, gb.style.mdpi, gb.style.ldpi
);