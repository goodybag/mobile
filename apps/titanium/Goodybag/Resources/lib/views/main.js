GB.Windows.add('main', Window.extend({
  debug: true,
  animated: false,
  location: null,
  initial: 'settings',

  Constructor : function() {
    this.window = $ui.createWindow(gb.style.get('main.self'));
    this.elements = {
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
    };
    
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
    
    // Loader
    this.initializeLoader();

    // Events
    this.events = {
      "menu": {
        type: 'click'
      , target: $el.header.buttons.sidebar
      , action: function(e) {
          $self.toggleSidebar.apply($self, [e]);
        }
      }
    , 'geolocation': {
        type: 'location'
      , target: Titanium.Geolocation
      , action: gb.consumer._setGeolocation
      }
    }

    // Add views to scrollable view
    GB.Views.get('sidebar').self.setVisible(true);
    GB.Views.get('sidebar').parent = this;
    $el.views.holder.add($el.views.holder.sidebar.self);
    $el.views.holder.add($el.views.main);

    // Add scrollable to window.
    this.add($el.views.holder);

    // Setup Welcome screen animation
    this.welcomeFadeIn = Ti.UI.createAnimation;
    
    this.delegateEvents();

    return this;
  },
  
  showPage : function(view) {
    this.elements.views.main.startLayout();
    if (this.location){
      console.log('attempting to remove view ' + this.location);
      this.elements.views.main.remove(GB.Views.get(this.location).self)
      GB.Views.hide(this.location);
    } 
    this.location = view;
    GB.Views.show(view);
    this.elements.views.main.add(GB.Views.get(view).self);
    this.elements.views.main.finishLayout();
  },

  onShow : function() {
    var $self = this, $el = this.elements, $file = Titanium.Filesystem, $user = gb.consumer, $url, written = true;
    
    this.showPage(this.initial);

    // User setup
    $el.views.holder.sidebar.setDetails($user);
    console.log("On show called");
  },
  
  onHide: function(){
    gb.utils.debug("calling onHide on main");
    this.destroyEvents();
    this.elements = null;
    delete this.elements;
  },
  

  /**
   * Toggle sidebar state and slide main screen in and out.
   */
  toggleSidebar : function(e) {
    var $el = this.elements;

    if (!this.animated) {
      this.animated = !0;
      $el.header.buttons.sidebar.setImage(gb.utils.getImage('screens/main/buttons/sidebar_active.png'));
      $el.views.main.animate(gb.style.get('main.animations.right'));
    } else {
      this.animated = !1;
      $el.header.buttons.sidebar.setImage(gb.utils.getImage('screens/main/buttons/sidebar_default.png'));
      $el.views.main.animate(gb.style.get('main.animations.left'));
    }
  }
}));
