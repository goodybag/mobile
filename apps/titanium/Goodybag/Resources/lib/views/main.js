
GB.Windows.add('main', Window.extend({
  debug: true,
  animated: false,
  
  window: $ui.createWindow(gb.style.get('main.self')),
  
  location: 'nearby',
  
  elements: {
    views: {
      holder: $ui.createView(gb.style.get('main.views.holder')),
      main: $ui.createView(gb.style.get('main.views.main'))
    },
    
    header: {
      background: $ui.createImageView(gb.style.get('main.header.background')),
      logo: $ui.createImageView(gb.style.get('main.header.logo')),
      
      buttons: {
        sidebar: $ui.createImageView(gb.style.get('main.header.buttons.sidebar'))
      }
    }
  },
  
  Constructor: function () {
    var $self = this, $el = this.elements, $file = Titanium.Filesystem, $window = this.window;
    
    // Force orientation
    $window.orientationModes = [ Ti.UI.PORTRAIT ];
    
    // Views
    Titanium.include('/lib/views/qrcode.js');
    Titanium.include('/lib/views/nearby.js');
    Titanium.include('/lib/views/sidebar.js');
    Titanium.include('/lib/views/stream.js');
    Titanium.include('/lib/views/stream-no-data.js');
    Titanium.include('/lib/views/charities.js');
    Titanium.include('/lib/views/welcome.js');
    Titanium.include('/lib/views/set-screen-name.js');
    Titanium.include('/lib/views/enter-tapin-id.js');
    
    // Attach Views
    $el.views.main.add(GB.Views.get('qrcode').self);
    $el.views.main.add(GB.Views.get('nearby').self);
    $el.views.main.add(gb.Views.get('stream').self);
    $el.views.main.add(gb.Views.get('stream-no-data').self);
    $el.views.main.add(gb.Views.get('charities').self);
    $el.views.main.add(gb.Views.get('welcome').self);
    $el.views.main.add(gb.Views.get('set-screen-name').self);
    $el.views.main.add(gb.Views.get('enter-tapin-id').self);
    
    // Attach Header
    $el.views.main.add($el.header.background);
    $el.views.main.add($el.header.logo);
    $el.views.main.add($el.header.buttons.sidebar);
    
    // Events
    $el.header.buttons.sidebar.addEventListener('click', function (e) {
      $self.toggleSidebar.apply($self, [ e ]);
    });
    
    // Add views to scrollable view
    GB.Views.get('sidebar').self.setVisible(true);
    GB.Views.get('sidebar').parent = this;
    $el.views.holder.add(GB.Views.get('sidebar').self);
    $el.views.holder.add($el.views.main);
    
    // Add scrollable to window.
    this.add($el.views.holder);
    
    // Setup Welcome screen animation
    this.welcomeFadeIn = Ti.UI.createAnimation
    
    return this;
  },
  
  onShow: function () {
    var $self = this, $el = this.elements, $file = Titanium.Filesystem, $user = gb.consumer, $url, written = true;
    
    // New users get the welcome screen upon logging in
    if (gb.consumer.newlyRegistered){
      this.flashWelcomeScreen();
    }
    
    // If we a user doesn't have a charity, let's send them to the charity page
    if (!gb.consumer.getCharityId()){
      this.location = "charities";
    }
    
    this.location = "enter-tapin-id";
    
    // Direct Pages, then delegate background tasks.
    GB.Views.show(this.location);
    
    // User setup
    GB.Views.get('sidebar').setDetails($user);
  },
  
  /**
   * Toggle sidebar state and slide main screen in and out.
   */
  toggleSidebar: function (e) {
    var $el = this.elements;
    
    if (!this.animated) {
      this.animated = !0;
      $el.views.main.animate(gb.style.get('main.animations.right'));
      $el.header.buttons.sidebar.setImage(gb.utils.getImage('screens/main/buttons/sidebar_active.png'));
    } else {
      this.animated = !1;
      $el.views.main.animate(gb.style.get('main.animations.left'));
      $el.header.buttons.sidebar.setImage(gb.utils.getImage('screens/main/buttons/sidebar_default.png'));
    }
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
