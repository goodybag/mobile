GB.Windows.add('main', Window.extend({
  debug: true,
  initial: 'qrcode',
  callback: null,
  location: null,
  swiping: false,
  animated: true,
  closeOnExit: true,
  window: gb.style.get('main.self'),
  
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
    
    // Store Elements
    this.elements = {
      views: {
        holder: $ui.createView(gb.style.get('main.views.holder')),
        main: $ui.createView(gb.style.get('main.views.main'))
      },
      
      header: {
        background: gb.style.get('main.header.background'),
        logo: gb.style.get('main.header.logo'),
  
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
      sidebar: {
        type: 'click',
        target: this.elements.header.buttons.sidebar,
        action: function(e) {
          if (e.source && e.source.custom) return (e.source.custom = false);
          $this.toggleSidebar.apply($this);
        }
      },
      
      qrcode: {
        type: 'click',
        target: this.elements.header.buttons.qrcode,
        action: function (e) {
          if ($this.location == 'qrcode') return;
          if ($this.callback) $this.toggleBack();
          GB.Views.get('sidebar').clearActive();
          GB.Views.get('sidebar').active = 'qrcode';
          $this.showPage('qrcode');
          $this.toggleQRCode();
        }
      },
      
      physicalBack: {
        target: this.window,
        type: 'android:back',
        action: function (e) {
          if ($this.callback) { 
            $this.toggleBack.apply($this);
            return false;
          } else if (!$this.animated) {
            $this.toggleSidebar.apply($this);
          }
        }
      }
    };
    
    // Event for Geolocation (Can't be in handler above)
    if (Titanium.Geolocation.locationServicesEnabled)
      Titanium.Geolocation.addEventListener('location', gb.consumer._setGeolocation);
    else alert('GPS Disabled, Nearby places will be off.');

    // Force orientation
    $window.orientationModes = [ Ti.UI.PORTRAIT ];
    
    // Load Sidebar and reference it
    Titanium.include('/lib/views/sidebar.js');
    this.elements.views.holder.sidebar = GB.Views.get('sidebar');
    
    // Attach Header
    this.elements.header.background.add(this.elements.header.buttons.sidebar);
    this.elements.header.background.add(this.elements.header.logo);
    this.elements.header.background.add(this.elements.header.buttons.qrcode);
    
    this.elements.views.main.add(this.elements.header.background);
    
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
    this.streamGlobalRefresher = new GB.PeriodicRefresher(function (callback) {
        gb.api.stream.global({ offset: 0, limit: 30 }, callback);
      }, gb.api.store.stream, gb.config.autoRefreshTime
    );
    
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
      gb.utils.debug('[MAIN] Attempting to remove view: ' + this.location);
      this.elements.views.main.remove(GB.Views.get(this.location).self);
      GB.Views.hide(this.location);
    }
    
    this.location = view;
    GB.Views.show(view);
    this.elements.views.main.add(GB.Views.get(view).self);
    this.elements.views.main.finishLayout();
    
    if (this.shownPages.indexOf(view) === -1 && !view === 'settings') 
      this.shownPages.push(view);
  },
  
  onHide: function () {
    gb.utils.debug('[MAIN] Stoping Global Refresher');
    this.streamGlobalRefresher.stop();
    
    gb.utils.debug('[MAIN] Clearing active sidebar element');
    GB.Views.get('sidebar').active = null;
  },

  /**
   * Methods to be called upon show.
   */
  onShow: function () {
    GB.Views.get('sidebar').setActive(this.initial);
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
    gb.utils.debug("[MAIN] Destroying registered events.");
    this.destroyEvents();
    
    gb.utils.debug("[MAIN] Nulling out elements");
    this.elements = null;
    delete this.elements;
    
    gb.utils.debug("[MAIN] Destroying shown pages.");
    for (var i = this.shownPages.length - 1; i >= 0; i--) {
      GB.Views.destroy(this.shownPages[i]);
    }
  },
  
  /**
   * Toggle QRCode Button State
   */
  toggleQRCode: function (e) {
    if (this.location === 'qrcode') { 
      if (GB.Views.get('sidebar').active !== 'qrcode') GB.Views.get('sidebar').active = 'qrcode', this.elements.header.buttons.qrcode.setImage(
        this.images.qrcode.active
      );
      
      return;
    }
    
    this.elements.header.buttons.qrcode.setImage(this.images.qrcode[((this.location == 'qrcode') ? '' : 'in') + 'active']);
    if (this.location === "qrcode") GB.Views.get('sidebar').active = "qrcode";
  },
  
  toggleBack: function (callback) {
    var $this = this;
    if (this.stillToggling) return;
    else this.stillToggling = true;
    
    if (typeof callback != 'undefined') {
      this.callback = {};
      this.callback.back = function (e) { $this.toggleBack.apply($this); };
      this.callback.main = callback;
      this.elements.header.buttons.sidebar.removeEventListener('click', this.events.sidebar.action);
      this.elements.header.buttons.sidebar.addEventListener('click', this.callback.back);
      this.elements.header.buttons.sidebar.setImage(this.images.back.inactive);
      this.stillToggling = false;
      return;
    } else if (!this.callback) {
      this.elements.header.buttons.sidebar.setImage(this.images.sidebar[((!this.animated) ? '' : 'in') + 'active']);
      this.elements.header.buttons.sidebar.addEventListener('click', this.events.sidebar.action);
    } else {
      this.elements.header.buttons.sidebar.setImage(this.images.back.active);
      if (typeof this.callback.main != 'undefined') this.callback.main();
      
      this.elements.header.buttons.sidebar.setImage(
        this.images.sidebar[((!this.animated) ? '' : 'in') + 'active'] 
      );
      
      this.elements.header.buttons.sidebar.removeEventListener('click', this.callback.back);
      this.elements.header.buttons.sidebar.addEventListener('click', this.events.sidebar.action);
      this.callback = null;
    }
    
    this.stillToggling = false;
  },
  
  /**
   * Toggle sidebar state and slide main screen in and out.
   */
  toggleSidebar: function () {
    var $this = this;
    if (this.stillToggling) return;
    else this.stillToggling = true;
    this[(this.animated ? 'open' : 'close') + 'Sidebar'](function () {
      $this.stillToggling = false;
    });
  },
  
  handleSideclick: function (e) {
   var $this = this, $main = this.elements.views.main;
    if (this.animated) return $main.removeEventListener('touchend', function (e) { return $this.handleSideclick.apply($this, [ e ]); });
    e.source.custom = true;
    this.toggleSidebar();
    return false;
  },
  
  openSidebar: function (callback) {
    if (!this.animated) return;
    var $this = this, $main = this.elements.views.main;
    $main.addEventListener('touchend', function (e) { return $this.handleSideclick.apply($this, [ e ]); });
    this.elements.header.buttons.sidebar.setImage(this.images.sidebar.active );
    this.elements.views.main.animate(gb.style.get('main.animations.right'), function () {
      $this.animated = false; if (callback) callback();
    });
  },
  
  closeSidebar: function (callback) {
    if (this.animated) return;
    var $this = this, $main = this.elements.views.main;
    $main.removeEventListener('touchend', function (e) { return $this.handleSideclick.apply($this, [ e ]); });
    this.elements.header.buttons.sidebar.setImage(this.images.sidebar.inactive);
    this.elements.views.main.animate(gb.style.get('main.animations.left'), function () {
      $this.animated = true; if (callback) callback();
    });
  }
}));
