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
    
    // Events
    this.events = {
      "facebookLoginClick": {
        type: 'click'
      , target: $el.buttons.facebook
      , action: function (e) {
          if ($self.loggingIn || Titanium.Facebook.getAccessToken()) return;
          $self.showLoader();
          $self.checkingFbLogin = true;
          Titanium.Facebook.authorize();
        }
      }
    , "facebookLoginEvent": {
        type: 'login'
      , target: Titanium.Facebook
      , action: function (e) {
          if ($self.called) return;
          if (e.success) {
            $self.facebookLogin();
          } else Titanium.Facebook.logout();
          
          $self.called = true;
          $self.loggingIn = false;
          $self.checkingFbLogin = false;
          $self.hideLoader();
        }
      }
    , "emailLoginClick": {
        type: 'click'
      , target: $el.buttons.submit
      , action: function (e) {
          if ($self.loggingIn) return;
          
          $self.showLoader();
          
          if (gb.config.debug) gb.utils.debug('[login] attempting to authenticate user.');
          
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
      if ($self.destroyedEvents || typeof $self.destroyedEvents === 'undefined') 
        $self.delegateEvents(), $self.destroyedEvents = false;
    };
    
    this.onHide = function () {
      $self.elements.inputs.email.blur();
      $self.elements.inputs.password.blur();
      $self.destroyEvents();
      $self.destroyedEvents = true;
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
    if (this.loggingIn) return;
    if (this.checkingFbLogin && !Titanium.Facebook.getAccessToken()) return Titanium.Facebook.logout(), this.logginIn = false, this.checkingFbLogin = false, this.called = false;
    var $this = this; this.showLoader(); this.loggingIn = true;
    
    gb.utils.debug('[LOGIN] Attempting to login through Facebook SSO.');
    gb.consumer.facebookAuth(function(error, consumer) {
      if (error) {
        Titanium.Facebook.logout();
        alert(error);
      } else if (consumer) {
        gb.consumer = consumer;
        if (gb.consumer.hasCompletedRegistration()) GB.Windows.show('main');
        else GB.Windows.show('complete-registration');
      }
      
      $this.loggingIn = false;
      $this.called = false;
      $this.checkingFbLogin = false;
      $this.hideLoader();
    }, true);
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
