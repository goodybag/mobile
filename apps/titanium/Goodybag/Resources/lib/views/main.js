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

    header : {
      background : $ui.createImageView(gb.style.get('main.header.background')),
      logo : $ui.createImageView(gb.style.get('main.header.logo')),

      buttons : {
        sidebar : $ui.createImageView(gb.style.get('main.header.buttons.sidebar'))
      }
    }
  },

  Constructor : function() {
    var $self = this, $el = this.elements, $file = Titanium.Filesystem, $window = this.window;

    // Force orientation
    $window.orientationModes = [ Ti.UI.PORTRAIT ];
    
    // Load Sidebar and reference it
    Titanium.include('/lib/views/sidebar.js');
    $el.views.holder.sidebar = GB.Views.get('sidebar');
    
    // Attach Header
    $el.views.main.add($el.header.background);
    $el.views.main.add($el.header.logo);
    $el.views.main.add($el.header.buttons.sidebar);

    // Events
    $el.header.buttons.sidebar.addEventListener('click', function(e) {
      $self.toggleSidebar.apply($self, [e]);
    });

    // Add views to scrollable view
    GB.Views.get('sidebar').self.setVisible(true);
    GB.Views.get('sidebar').parent = this;
    $el.views.holder.add($el.views.holder.sidebar.self);
    $el.views.holder.add($el.views.main);

    // Add scrollable to window.
    this.add($el.views.holder);

    // Setup Welcome screen animation
    this.welcomeFadeIn = Ti.UI.createAnimation

    return this;
  },

  onShow : function() {
    var $self = this, $el = this.elements, $file = Titanium.Filesystem, $user = gb.consumer, $url, written = true;
    
    // New users get the welcome screen upon logging in
    if (gb.consumer.newlyRegistered){
      this.flashWelcomeScreen();
    }
    
    // If we a user doesn't have a charity, let's send them to the charity page
    if (!gb.consumer.getCharityId()){
      this.location = "charities";
    }
    
    // Direct Pages, then delegate background tasks.
    GB.Views.show(this.location);

    // User setup
    $el.views.holder.sidebar.setDetails($user);
  },

  /**
   * Toggle sidebar state and slide main screen in and out.
   */
  toggleSidebar : function(e) {
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
    welcome.animate(gb.style.get('common.animation.fadeIn'), callback || function(){});
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
