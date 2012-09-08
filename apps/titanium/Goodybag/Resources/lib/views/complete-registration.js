GB.Windows.add('complete-registration', Window.extend({
  window: $ui.createWindow(gb.style.get('main.self')),
  
  Constructor: function () {
    var $this = this;
    
    this.location = null;
    
    // Force orientation
    this.window.orientationModes = [ Ti.UI.PORTRAIT ];
    
    this.views = {
      "base": $ui.createView(gb.style.get('main.views.holder'))
    
    , "main": {
        "base":   $ui.createView(gb.style.get('main.views.main'))

      , "header": $ui.createImageView(gb.style.get('main.header.background'))
      , "logo":   $ui.createImageView(gb.style.get('main.header.logo'))
      
        // Attached page views
      // , "charities": GB.Views.get('charities').self
      // , "welcome": GB.Views.get('welcome').self
      // , "set-screen-name": GB.Views.get('set-screen-name').self
      // , "enter-tapin-id": GB.Views.get('enter-tapin-id').self
      }
    };
    
    gb.utils.compoundViews(this.views);
    this.add(this.views.base);
    
    // Loader
    this.initializeLoader();
    
    return this;
  },
  
  onShow: function () {
    var $this = this;
    
    // New users get the welcome screen upon logging in
    if (gb.consumer.newlyRegistered){
      this.flashWelcomeScreen();
    }
    
    var onComplete = function(){ console.log("ON COMPLETE SHOWING NEXT"); $this.showNextScreen(); };
    GB.Views.get('charities').setOnComplete(onComplete);
    GB.Views.get('set-screen-name').setOnComplete(onComplete);
    GB.Views.get('enter-tapin-id').setOnComplete(onComplete);
    this.showNextScreen();
  },
  
  showPage: function (view) {
    if (this.location) {
      gb.utils.debug('attempting to remove view ' + this.location);
      this.views.main.base.remove(GB.Views.get(this.location).self)
      GB.Views.hide(this.location);
    }
    console.log("[Complete Registration] - Showing " + view)
    this.location = view;
    GB.Views.show(view);
    this.views.main.base.add(GB.Views.get(view).self);
  },
  
  showNextScreen: function () {
    // Facebook regs don't set their screen name like email regs
    console.log("[Complete Registration] - Checking for Set Screen Name");
    if (!gb.consumer.hasSetScreenName())  return this.showPage('set-screen-name');
    // Show Charity if necessary
    console.log("[Complete Registration] - Checking for Set Charities");
    if (!gb.consumer.hasCharity())        return this.showPage('charities');
    // Show QR Code
    console.log("[Complete Registration] - Checking for Set TapIn ID");
    if (!gb.consumer.getBarcodeID())      return this.showPage('enter-tapin-id');
    
    // Else we're done with registration Show Main Window
    console.log("[Complete Registration] - Complete showing main");
    GB.Windows.show('main');
  },
  
  /**
   * Displays the welcome screen and then hides it after a specified period
   */
  flashWelcomeScreen: function (time) {
    var $this = this;
    this.showWelcomeScreen();
    setTimeout(function(){
      $this.hideWelcomeScreen();
    }, time || 3000);
  },
  
  /**
   * Opens the welcome screen
   */
  showWelcomeScreen: function (callback) {
    if (this.welcomeScreenOpen) return;
    this.welcomeScreenOpen = true;
    var welcome = GB.Views.get('welcome').views.base;
    welcome.setOpacity(0);
    welcome.show();
    welcome.animate({ opacity: 0.8 }, callback || function(){});
  },
  
  /**
   * Hides the welcome screen
   */
  hideWelcomeScreen: function (callback) {
    if (!this.welcomeScreenOpen) return;
    this.welcomeScreenOpen = false;
    callback || (callback = function(){});
    var welcome = GB.Views.get('welcome').views.base;
    welcome.show();
    welcome.animate(gb.style.get('common.animation.fadeOut'), function(){
      welcome.hide();
      callback();
    });
  }
}));
