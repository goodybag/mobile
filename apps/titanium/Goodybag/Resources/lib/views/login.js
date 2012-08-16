
gb.Windows.add('login', Window.extend({
  debug: true,
  
  elements: {
    view: gb.style.get('login.view'),
    background: gb.style.get('login.background'),
    
    buttons: {
      facebook: gb.style.get('login.buttons.facebook'),
      submit: gb.style.get('login.buttons.submit'),
      register: gb.style.get('login.buttons.register')
    },
    
    inputs: {
      background: gb.style.get('login.fields.background'),
      email: gb.style.get('login.fields.base login.fields.email'),
      password: gb.style.get('login.fields.base login.fields.password')
    }
  },
  
  window: gb.style.get('login.window'),
  
  Constructor: function () {
    var $self = this, $el = this.elements;

    // Background
    $el.view.add($el.background);
    
    // Login Form
    $el.view.add($el.inputs.background);
    $el.view.add($el.inputs.email);
    $el.view.add($el.inputs.password);
    
    // Buttons
    $el.view.add($el.buttons.facebook);
    $el.view.add($el.buttons.submit);
    $el.view.add($el.buttons.register);
    
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
      $el.view.scrollTo(0, 80);
    });
    
    $el.inputs.password.addEventListener('return', function (e) {
      $el.view.scrollTo(0, 0);
    });
    
    $el.inputs.password.addEventListener('blur', function (e) {
      $el.view.scrollTo(0, 0);
    });
    
    // Add Scroll View to window
    this.add($el.view);
    
    // Force Orientation
    this.window.orientationModes = [ Ti.UI.PORTRAIT ];
    
    return this;
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
