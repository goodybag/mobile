
gb.style.base.login = {
  window: {
    title: 'Login',
    top: 0.1,
    backgroundImage: 'background.png',
    build: { type: 'createWindow' }
  },
  
  view: {
    contentWidth: 'auto',
    contentHeight: 'auto',
    top: 0,
    width: 320,
    build: { type: 'createView' }
  },
  
  loginWrapper: {
    width: Titanium.UI.FILL,
    height: Titanium.UI.FILL,
    showVerticalScrollIndicator: true,
    showHorizontalScrollIndicator: false,
    zIndex: 2,
    backgroundImage: 'background.png',
    build: { type: 'createScrollView' }
  },
  
  registerWrapper: {
    width: Titanium.UI.FILL,
    height: Titanium.UI.SIZE,
    top: 0,
    zIndex: 1,
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
      build: { type: 'createTextField' }
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
