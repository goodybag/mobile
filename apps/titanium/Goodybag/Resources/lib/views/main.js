GB.Windows.add('main', Window.extend({
  debug: true,
  animated: true,
  callback: null,
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
    },
    back: {
      active: gb.utils.getImage('screens/main/buttons/back_active.png'),
      inactive: gb.utils.getImage('screens/main/buttons/back_default.png')
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
          $this.toggleSidebar.apply($this);
        }
      }
    , 'qrcode': {
        type: 'click',
        target: this.elements.header.buttons.qrcode,
        action: function (e) {
          if ($this.location == 'qrcode') return;
          if ($this.callback) $this.toggleBack();
          GB.Views.get('sidebar').clearActive();
          $this.showPage('qrcode');
          $this.toggleQRCode();
        }
      }
    };
    
    // Event for Geolocation (Can't be in handler above)
    if(Titanium.Geolocation.locationServicesEnabled)
      Titanium.Geolocation.addEventListener('location', gb.consumer._setGeolocation);
    else alert('GPS is disabled, nearby places will not work correctly!');

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
    
    // keep track of what pages have been shown
    this.shownPages = [];
    
    // Refresh stream data in the background
    this.streamGlobalRefresher = new GB.PeriodicRefresher(function(callback){
      gb.api.stream.global({ skip: 0, limit: 30 }, callback);
    }, gb.api.store.stream, gb.config.autoRefreshTime);
    
    return this;
  },
  
  showPage: function (view) {
    if (view === "stream"){
      this.showLoader();
      this.streamGlobalRefresher.stop();
    }
    if (view === "nearby") this.showLoader();
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
    if (this.shownPages.indexOf(view) === -1) this.shownPages.push(view);
  },
  
  onHide: function () {
    this.streamGlobalRefresher.stop();
  },

  /**
   * Methods to be called upon show.
   */
  onShow: function () {
    this.showPage(this.initial);
    this.elements.views.holder.sidebar.setDetails(gb.consumer);
    this.streamGlobalRefresher.start();

    // Check for app update
    gb.utils.updateAvailable(function(error, updateAvailable){
      // Don't worry about errors - we really don't care to do much with them
      GB.Views.get('sidebar')[(updateAvailable ? 'show' : 'hide') + 'Update']();
    });
  },
  
  /**
   * Delegate cleanup measures upon this window being hidden.
   */
  onDestroy: function () {
    gb.utils.debug("calling onDestroy on main");
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
  
  toggleBack: function (callback) {
    var $this = this;
    
    if (typeof callback != 'undefined') {
      this.callback = {};
      this.callback.back = function (e) { $this.toggleBack.apply($this); };
      this.callback.main = callback;
      this.elements.header.buttons.sidebar.removeEventListener('click', this.events.sidebar.action);
      this.elements.header.buttons.sidebar.addEventListener('click', this.callback.back);
      this.elements.header.buttons.sidebar.setImage(
        this.images.back.inactive
      );
      
      return;
    } else if (!this.callback) {
      this.elements.header.buttons.sidebar.setImage(
        this.images.sidebar[((!this.animated) ? '' : 'in') + 'active'] 
      );
      
      this.elements.header.buttons.sidebar.addEventListener('click', this.events.sidebar.action);
    } else {
      this.elements.header.buttons.sidebar.setImage(
        this.images.back.active  
      );
      
      if (typeof this.callback.main != 'undefined') this.callback.main();
      
      this.elements.header.buttons.sidebar.setImage(
        this.images.sidebar[((!this.animated) ? '' : 'in') + 'active'] 
      );
      
      this.elements.header.buttons.sidebar.removeEventListener('click', this.callback.back);
      this.elements.header.buttons.sidebar.addEventListener('click', this.events.sidebar.action);
      this.callback = null;
    }
  },
  
  /**
   * Toggle sidebar state and slide main screen in and out.
   */
  toggleSidebar: function (same) {
    this.animated = (!this.animated) ? true : false;
    
    this.elements.header.buttons.sidebar.setImage(
      this.images.sidebar[((!this.animated) ? '' : 'in') + 'active'] 
    );
    
    this.elements.views.main.animate(
      gb.style.get('main.animations.' + ((!this.animated) ? 'right' : 'left'))
    );
  }
}));
