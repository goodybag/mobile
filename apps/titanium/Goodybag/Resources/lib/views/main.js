GB.Windows.add('main', Window.extend({
  debug : true,
  animated : false,

  window : $ui.createWindow(gb.style.get('main.self')),

  location : 'nearby',

  elements : {
    views : {
      holder : $ui.createView(gb.style.get('main.views.holder')),
      main : $ui.createView(gb.style.get('main.views.main'))
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
    $window.orientationModes = [Ti.UI.PORTRAIT];

    // Attach Views
    $el.views.main.add(GB.Views.get('qrcode').self);
    $el.views.main.add(GB.Views.get('nearby').self);
    $el.views.main.add(gb.Views.get('stream').self);
    $el.views.main.add(gb.Views.get('stream-no-data').self);
    $el.views.main.add(gb.Views.get('charities').self);
    $el.views.main.add(gb.Views.get('settings').self);
    $el.views.main.add(gb.Views.get('edit-setting').self);
    $el.views.main.add(gb.Views.get('email-change-request').self);

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
    $el.views.holder.add(GB.Views.get('sidebar').self);
    $el.views.holder.add($el.views.main);

    // Add scrollable to window.
    this.add($el.views.holder);

    // Setup Welcome screen animation
    this.welcomeFadeIn = Ti.UI.createAnimation

    return this;
  },

  onShow : function() {
    var $self = this, $el = this.elements, $file = Titanium.Filesystem, $user = gb.consumer, $url, written = true;
    this.location = "settings";
    // Direct Pages, then delegate background tasks.
    GB.Views.show(this.location);

    // User setup
    GB.Views.get('sidebar').setDetails($user);
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
  }
}));
