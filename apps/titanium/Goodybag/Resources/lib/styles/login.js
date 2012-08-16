
gb.style.base.login = {
  window: {
    title: 'Login',
    top: 0.1,
    backgroundImage: 'background.png',
    build: { type: 'createWindow' }
  },
  
  view: {
    top: 0,
    width: 320,
    contentWidth: 'auto',
    contentHeight: 'auto',
    backgroundImage: 'background.png',
    showVerticalScrollIndicator: true,
    showHorizontalScrollIndicator: false,
    build: { type: 'createScrollView' }
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
