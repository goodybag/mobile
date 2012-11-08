gb.Windows.add('login', Window.extend({
  debug: true,
  
  Constructor: function () {
    this.window = gb.loginWindow = gb.style.get('login.window');
    
    this.elements = {
      view: gb.style.get('login.view'),
      background: gb.style.get('login.background'),
      
      loginWrapper: gb.style.get('login.loginWrapper'),
      registerWrapper: gb.style.get('login.registerWrapper'),
      
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
    };

    var $self = this, $el = this.elements;
    
    $el.view.add($el.loginWrapper);
    
    // Registration
    gb.Views.get('register').self.setVisible(true);
    this.elements.registerWrapper.add(gb.Views.get('register').self);
    $el.view.add(this.elements.registerWrapper);
    
    gb.Views.get('register').setOnBackCallback(function(){
      $self.hideRegistration();
    });
    
    gb.Views.get('register').setOnRegisterCallback(function(){
      if (gb.consumer.hasCompletedRegistration()) GB.Windows.show('main');
      else GB.Windows.show('complete-registration');
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
    
    // Loader
    this.initializeLoader();
    
    // Time out for checking to see if they logged in to facebook
    var fbTimeout = 1000 * 10, fbCurrTime;
    
    // Events
    this.events = {
      "facebookLoginClick": {
        type: 'click'
      , target: $el.buttons.facebook
      , action: function (e) {
          gb.utils.debug('clicked facebook login');
          if ($self.loggingIn) return;
          
          $self.showLoader();
          Titanium.Facebook.authorize();
          
          // Start checking to see if we're logged in yet
          // Titaniums fb login event does not always fire
          $self.checkingFbLogin = true;
          
          if ($self.fbLoginCheck) 
            clearInterval($self.fbLoginCheck);
          
          fbCurrTime = 0;
          
          $self.fbLoginCheck = setInterval(function(){
            if (Ti.Facebook.getLoggedIn()) {
              $self.hideLoader();
              clearInterval($self.fbLoginCheck);
              $self.checkingFbLogin = false;
              $self.facebookLogin();
            }
            
            fbCurrTime += 200;
            
            if (fbCurrTime >= fbTimeout) clearInterval($self.fbLoginCheck);
          }, 200);  
        }
      }
    , "emailLoginClick": {
        type: 'click'
      , target: $el.buttons.submit
      , action: function (e) {
          if ($self.loggingIn) return;
          $self.showLoader();
          if (gb.config.debug) 
            gb.utils.debug('[login] attempting to authenticate user.');
          
          // Logging in
          $self.loggingIn = true;
          
          // Trim and grab values
          gb.consumer.email = gb.utils.trim($el.inputs.email.getValue());
          gb.consumer.password = gb.utils.trim($el.inputs.password.getValue());
          
          // Set password to empty
          $el.inputs.password.setValue("");
          
          gb.consumer.auth(function(error, consumer) {
            $self.loggingIn = false;
            $self.hideLoader();
            
            if (error || !consumer) {
              if (error) alert(error);
              else if (!consumer) alert('Error checking account details!');
              return;
            } else if (consumer) 
              gb.consumer = consumer;
              
            $self.showLoader('Logged In.. Please wait...');
            if (gb.consumer.hasCompletedRegistration()) GB.Windows.show('main');
            else GB.Windows.show('complete-registration');
            $self.hideLoader();
          });
        }
      }
    , "emailOnClick": {
        type: 'click'
      , target: $el.inputs.email
      , action: function (e) {
          if (Ti.Android) 
            $el.inputs.email.softKeyboardOnFocus = Ti.UI.Android.SOFT_KEYBOARD_SHOW_ON_FOCUS,
            $el.inputs.email.focus();
        }
    }
    , "passwordOnClick": {
        type: 'click'
      , target: $el.inputs.password
      , action: function (e) {
          if (Ti.Android) 
            $el.inputs.password.softKeyboardOnFocus = Ti.UI.Android.SOFT_KEYBOARD_SHOW_ON_FOCUS,
            $el.inputs.password.focus();
        }
    }
    , "emailOnReturn": {
        type: 'return'
      , target: $el.inputs.email
      , action: function (e) {
          $el.inputs.email.blur();
          $el.inputs.password.focus();
        }
      }
    , "passwordOnReturn": {
        type: 'return'
      , target: $el.inputs.password
      , action: function (e) {
          $el.loginWrapper.scrollTo(0, 0);
        }
      }
    , "passwordOnBlur": {
        type: 'blur'
      , target: $el.inputs.password
      , action: function (e) {
          $el.loginWrapper.scrollTo(0, 0);
        }
      }
    , "registerClick": {
        type: 'click'
      , target: $el.buttons.register
      , action: function (e) {
          $self.showRegistration();
          Ti.Facebook.fireEvent('login');
        }
      }
    }; // End events
    
    this.delegateEvents();
        
    Titanium.Facebook.logout();
    
    // Add Main View to window
    this.add($el.view);
    
    // Force Orientation
    this.window.orientationModes = [ Ti.UI.PORTRAIT ];
    
    this.onShow = function () {
      $self.delegateEvents();
    };
    
    this.onHide = function () {
      $self.elements.inputs.email.blur();
      $self.elements.inputs.password.blur();
      $self.destroyEvents();
    };
    
    this.onDestroy = function () {
      gb.utils.debug('calling onHide');
      // GB.Views.hide('register');
      $self.destroyEvents();
      $self.window.remove($self.elements.view);
      $self.elements = null;
      delete $self.elements;
      $self = null;
      $el = null;
    };
    
    return this;
  },
  
  facebookLogin: function() {
    if (gb.consumer.isAuthenticated() || !Ti.Facebook.getLoggedIn()) 
      return;
    
    var $this = this;
    this.showLoader();
    this.loggingIn = true;
    gb.utils.debug('Attempting to login via facebook');
    
    gb.consumer.facebookAuth(function(error, consumer) {
      $this.loggingIn = false;
      
      if (error) {
        $this.hideLoader();
        Titanium.Facebook.logout();
        alert(error); return;
      } else if (consumer) {
        gb.consumer = consumer;
      }
      
      $this.hideLoader();
      if (gb.consumer.hasCompletedRegistration()) GB.Windows.show('main');
      else GB.Windows.show('complete-registration');
    });
  },
  
  showRegistration: function () {
    this.elements.registerWrapper.show();
    this.elements.registerWrapper.setZIndex(3);
  },
  
  hideRegistration: function () {
    gb.utils.debug('Hiding registration');
    this.elements.registerWrapper.hide();
    this.elements.registerWrapper.setZIndex(0);
  },
  
  onAndroid: function () {
    var $el = this.elements;
  }
}));
