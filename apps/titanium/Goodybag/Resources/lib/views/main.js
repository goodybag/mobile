GB.Windows.add('main', Window.extend({
  debug: true,
  animated: true,
  location: null,
  initial: 'settings',
  
  images: {
    qrcode: {
      active: gb.utils.getImage('screens/main/buttons/qrcode_active.png'),
      inactive: gb.utils.getImage('screens/main/buttons/qrcode_default.png')
    },
    sidebar: {
      active: gb.utils.getImage('screens/main/buttons/sidebar_active.png'),
      inactive: gb.utils.getImage('screens/main/buttons/sidebar_default.png')
    }
  },

  Constructor: function () {
    var $this, $el, $window;
    
    // Store window
    this.window = gb.style.get('main.self');
    
    // Store Elements
    this.elements = {
      views: {
        holder: $ui.createView(gb.style.get('main.views.holder')),
        main: $ui.createView(gb.style.get('main.views.main'))
      },
      
      header: {
        background: $ui.createImageView(gb.style.get('main.header.background')),
        logo: $ui.createImageView(gb.style.get('main.header.logo')),
  
        buttons: {
          sidebar: $ui.createImageView(gb.style.get('main.header.buttons.sidebar')),
          qrcode: $ui.createImageView(gb.style.get('main.header.buttons.qrcode'))
        }
      }
    };
    
    // Setup Variables
    $this = this;
    $el = this.elements;
    $window = this.window;
    
    // Store Events
    this.events = {
      "sidebar": {
        type: 'click'
      , target: this.elements.header.buttons.sidebar
      , action: function(e) {
          $this.toggleSidebar.apply($this, [e]);
        }
      }
    , 'qrcode': {
        type: 'click',
        target: this.elements.header.buttons.qrcode,
        action: function (e) {
          if ($this.location == 'qrcode') return;
          $this.showPage('qrcode');
          $this.toggleQRCode();
        }
    }
    , 'geolocation': {
        type: 'location'
      , target: Titanium.Geolocation
      , action: gb.consumer._setGeolocation
      }
    };

    // Force orientation
    $window.orientationModes = [ Ti.UI.PORTRAIT ];
    
    // Load Sidebar and reference it
    Titanium.include('/lib/views/sidebar.js');
    this.elements.views.holder.sidebar = GB.Views.get('sidebar');
    
    // Attach Header
    this.elements.views.main.add(this.elements.header.background);
    this.elements.views.main.add(this.elements.header.logo);
    this.elements.views.main.add(this.elements.header.buttons.sidebar);
    this.elements.views.main.add(this.elements.header.buttons.qrcode);
    
    // Loader
    this.initializeLoader();
    
    // Add views to scrollable view
    GB.Views.get('sidebar').self.setVisible(true);
    GB.Views.get('sidebar').parent = this;
    this.elements.views.holder.add(this.elements.views.holder.sidebar.self);
    this.elements.views.holder.add(this.elements.views.main);

    // Add scrollable to window.
    this.add(this.elements.views.holder);

    // Setup Welcome screen animation
    this.welcomeFadeIn = Titanium.UI.createAnimation;
    this.delegateEvents();
    
    return this;
  },
  
  showPage: function (view) {
    this.elements.views.main.startLayout();
    
    if (this.location) {
      gb.utils.debug('attempting to remove view ' + this.location);
      this.elements.views.main.remove(GB.Views.get(this.location).self)
      GB.Views.hide(this.location);
    } 
    
    this.location = view;
    GB.Views.show(view);
    this.elements.views.main.add(GB.Views.get(view).self);
    this.elements.views.main.finishLayout();
    this.shownPages.push(view);
  },

  /**
   * Methods to be called upon show.
   */
  onShow: function () {
    this.showPage(this.initial);
    this.elements.views.holder.sidebar.setDetails(gb.consumer);
  },
  
  /**
   * Delegate cleanup measures upon this window being hidden.
   */
  onHide: function () {
    gb.utils.debug("calling onHide on main");
    this.destroyEvents();
    this.elements = null;
    delete this.elements;
    for (var i = this.shownPages.length - 1; i >= 0; i--){
      GB.Views.destroy(this.shownPages[i]);
    }
  },
  
  /**
   * Toggle QRCode Button State
   */
  toggleQRCode: function (e) {
    this.elements.header.buttons.qrcode.setImage(
      this.images.qrcode[((this.location == 'qrcode') ? '' : 'in') + 'active'] 
    );
  },
  
  /**
   * Toggle sidebar state and slide main screen in and out.
   */
  toggleSidebar: function (e) {
    this.animated = (!this.animated) ? true : false;
    
    this.elements.header.buttons.sidebar.setImage(
      this.images.sidebar[((!this.animated) ? '' : 'in') + 'active'] 
    );
    
    this.elements.views.main.animate(
      gb.style.get('main.animations.' + ((!this.animated) ? 'right' : 'left'))
    );
  }
}));
