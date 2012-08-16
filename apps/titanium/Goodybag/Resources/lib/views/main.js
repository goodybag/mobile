
GB.Windows.add('main', Window.extend({
  debug: true,
  animated: false,
  
  window: $ui.createWindow(gb.style.get('main.self')),
  
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
    Titanium.include('/lib/views/places.js');
    Titanium.include('/lib/views/sidebar.js');
    Titanium.include('/lib/views/stream.js');
    Titanium.include('/lib/views/stream-no-data.js');
    Titanium.include('/lib/views/charities.js');
    
    // Attach Views
    $el.views.main.add(gb.Views.get('qrcode').self);
    $el.views.main.add(gb.Views.get('places').self);
    $el.views.main.add(gb.Views.get('stream').self);
    $el.views.main.add(gb.Views.get('stream-no-data').self);
    $el.views.main.add(gb.Views.get('charities').self);
    
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
    $el.views.holder.add(GB.Views.get('sidebar').self);
    $el.views.holder.add($el.views.main);
    
    // Add scrollable to window.
    this.add($el.views.holder);
    
    return this;
  },
  
  onShow: function () {
    var $self = this, $el = this.elements, $file = Titanium.Filesystem, $user = gb.consumer, $url, written = true;
    
    // Direct Pages, then delegate background tasks.
    GB.Views.show('qrcode');
    
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
  }
}));
