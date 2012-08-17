
gb.Windows.add('login', Window.extend({
  debug: true,
  
  elements: {
    view: Titanium.UI.createView({
      contentWidth: 'auto',
      contentHeight: 'auto',
      top: 0,
      width: 320
    }),
    
    loginWrapper: Titanium.UI.createScrollView({
      width: Titanium.UI.FILL,
      height: Titanium.UI.FILL,
      showVerticalScrollIndicator: true,
      showHorizontalScrollIndicator: false,
      zIndex: 2,
      backgroundImage: gb.utils.getImage('background.png')
    }),
    
    background: Titanium.UI.createImageView({
      image: gb.utils.getImage('screens/login/background.png')
    }),
    
    registerWrapper: Titanium.UI.createView({
      width: Titanium.UI.FILL
    , height: Titanium.UI.SIZE
    , top: 0
    , zIndex: 1
    }),
    
    buttons: {
      facebook: Titanium.UI.createImageView({
        top: '150dp',
        image: gb.utils.getImage('screens/login/facebook.png')
      }),
      
      submit: Titanium.UI.createImageView({
        top: '320dp',
        image: gb.utils.getImage('screens/login/login.png')
      }),
      
      register: Titanium.UI.createImageView({
        top: '408dp',
        image: gb.utils.getImage('screens/login/register.png')
      })
    },
    
    inputs: {
      background: Titanium.UI.createImageView({
        top: '220dp',
        image: gb.utils.getImage('screens/login/inputs.png')
      }),
      
      email: Titanium.UI.createTextField({
        top: '228dp',
        left: '80dp',
        width: '195dp',
        height: '40dp',
        backgroundImage: gb.utils.getImage('screens/login/transparent.png'),
        hintText: 'Email',
        color: '#888',
        keyboardType: Titanium.UI.KEYBOARD_EMAIL,
        borderStyle: Ti.UI.INPUT_BORDERSTYLE_NONE,
        autocorrect: false,
        autocapitalization: Ti.UI.TEXT_AUTOCAPITALIZATION_NONE
      }),
      
      password: Titanium.UI.createTextField({
        top: '270dp',
        left: '80dp',
        width: '195dp',
        height: '40dp',
        backgroundImage: gb.utils.getImage('screens/login/transparent.png'),
        hintText: 'Password',
        color: '#888',
        borderStyle: Ti.UI.INPUT_BORDERSTYLE_NONE,
        autocorrect: false,
        autocapitalization: Ti.UI.TEXT_AUTOCAPITALIZATION_NONE,
        passwordMask: true,
      })
    }
  },
  
  window: Titanium.UI.createWindow({
    title: 'Login',
    top: 0.1,
    backgroundImage: gb.utils.getImage('background.png')
  }),
  
  Constructor: function () {
    var $self = this, $el = this.elements;
    
    $el.view.add($el.loginWrapper)
    
    // Registration
    gb.Views.get('register').self.setVisible(true);
    this.elements.registerWrapper.add(gb.Views.get('register').self);
    $el.view.add(this.elements.registerWrapper);
    gb.Views.get('register').setOnBackCallback(function(){
      $self.hideRegistration();
    });
    gb.Views.get('register').setOnRegisterCallback(function(){
      gb.Windows.show('main');
    });
    
    // Background
    $el.loginWrapper.add($el.background);
    
    // Login Form
    $el.loginWrapper.add($el.inputs.background);
    $el.loginWrapper.add($el.inputs.email);
    $el.loginWrapper.add($el.inputs.password);
    
    // Buttons
    $el.loginWrapper.add($el.buttons.facebook);
    $el.loginWrapper.add($el.buttons.submit);
    $el.loginWrapper.add($el.buttons.register);
    
    // Button Events
    $el.buttons.facebook.addEventListener('click', function (e) {
      console.log('clicked facebook login');
      Titanium.Facebook.authorize();  
    });
    
    Titanium.Facebook.logout();
    
    $el.buttons.submit.addEventListener('click', function (e) {
      if(gb.config.debug) console.log('[login] attempting to authenticate user.');
      
      gb.consumer.email = gb.utils.trim($el.inputs.email.getValue());
      gb.consumer.password = gb.utils.trim($el.inputs.password.getValue());
      
      gb.consumer.auth(function(error, consumer) {
        if (error) {
          alert(error); return;
        } else if (consumer) {
          gb.consumer = consumer;
        }
        
        GB.Windows.show('main');
      });
    });
    
    Titanium.Facebook.addEventListener('login', function(e) {
      console.log('signing in with facebook.');
      console.log(JSON.stringify(e));
      
      if (e.success) {
        console.log('succeeded, sending facebook authentication poll');
        console.log(JSON.stringify(gb.consumer));
        
        gb.consumer.facebookAuth(function(error, consumer) {
          console.log(error);
          console.log(consumer);
          
          if (error) {
            Titanium.Facebook.logout();
            alert(error); return;
          } else if (consumer) {
            gb.consumer = consumer;
          }
          
          GB.Windows.show('main');
        });
      } else {
        if (!e.cancelled) {
          alert('Could not login to Facebook, Try Again!');
        }
      }
    });
    
    // Input Events
    $el.inputs.email.addEventListener('return', function (e) {
      $el.inputs.password.focus();
      $el.loginWrapper.scrollTo(0, 80);
    });
    
    $el.inputs.password.addEventListener('return', function (e) {
      $el.loginWrapper.scrollTo(0, 0);
    });
    
    $el.inputs.password.addEventListener('blur', function (e) {
      $el.loginWrapper.scrollTo(0, 0);
    });
    
    $el.buttons.register.addEventListener('click', function (e) {
      $self.showRegistration();
    });
    
    // Add Main View to window
    this.add($el.view);
    
    // Force Orientation
    this.window.orientationModes = [ Ti.UI.PORTRAIT ];
    
    return this;
  },
  
  showRegistration: function () {
    this.elements.registerWrapper.setZIndex(3);
  },
  
  hideRegistration: function () {
    this.elements.registerWrapper.setZIndex(1);
  },
  
  onHide: function () {
    var $el = this.elements;
    
    $el.inputs.email.blur();
    $el.inputs.password.blur();
  },
  
  onAndroid: function () {
    var $el = this.elements;
    
    $el.inputs.email.setSoftKeyboardOnFocus(Titanium.UI.Android.SOFT_KEYBOARD_HIDE_ON_FOCUS);
    $el.inputs.password.setSoftKeyboardOnFocus(Titanium.UI.Android.SOFT_KEYBOARD_HIDE_ON_FOCUS);
  }
}));
