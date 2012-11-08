GB.Windows.add('main', Window.extend({
  debug: true,
  initial: 'qrcode',
  callback: null,
  location: null,
  swiping: false,
  animated: true,
  
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
      
      // Deprecated until we can get scrollView to scroll correctly with this set.
      // swipe: {
        // type: 'swipe',
        // target: this.window,
        // action: function (e) {
          // if (e.direction === 'up' || e.direction === 'down') return true;
          // if (e.direction === 'right' && $this.animated) $this.toggleSidebar.apply($this)
          // else if (e.direction === 'left' && !$this.animated) $this.toggleSidebar.apply($this);
        // }
      // },
      
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
    if(Titanium.Geolocation.locationServicesEnabled)
      Titanium.Geolocation.addEventListener('location', gb.consumer._setGeolocation);
    else alert('GPS is disabled, nearby places will not work correctly!');

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
    this.streamGlobalRefresher = new GB.PeriodicRefresher(
      function(callback){
        gb.api.stream.global({ offset: 0, limit: 30 }, callback);
      }
    , gb.api.store.stream
    , gb.config.autoRefreshTime
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
    GB.Views.hide(this.location);
    // Reset active sidebar item so it doesn't bail out early when we invoke setActive in main's onShow
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
    if (this.location === "qrcode") GB.Views.get('sidebar').active = "qrcode";
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
    this[(this.animated ? 'open' : 'close') + 'Sidebar']();
  },
  
  handleSideclick: function (e) {
   var $this = this, $main = this.elements.views.main;
    if (this.animated) {
      $main.removeEventListener('touchend', function (e) { return $this.handleSideclick.apply($this, [ e ]); });
      return;
    }
    
    e.source.custom = true;
    this.toggleSidebar();
    return false;
  },
  
  openSidebar: function () {
    if (!this.animated) return;
    this.animated = false;
    
    var $this = this, $main = this.elements.views.main;
    $main.addEventListener('touchend', function (e) { return $this.handleSideclick.apply($this, [ e ]); });
    
    this.elements.header.buttons.sidebar.setImage(
      this.images.sidebar.active 
    );
    
    this.elements.views.main.animate(
      gb.style.get('main.animations.right')
    );
  },
  
  closeSidebar: function () {
    if (this.animated) return;
    this.animated = true;
    
    var $this = this, $main = this.elements.views.main;
    $main.removeEventListener('touchend', function (e) { return $this.handleSideclick.apply($this, [ e ]); });
    
    this.elements.header.buttons.sidebar.setImage(
      this.images.sidebar.inactive 
    );
    
    this.elements.views.main.animate(
      gb.style.get('main.animations.left')
    );
  }
}));
