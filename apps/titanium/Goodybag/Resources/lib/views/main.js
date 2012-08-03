
GB.Windows.add('main', Window.extend({
  debug: true,
  animated: false,
  
  window: Titanium.UI.createWindow({
    title: 'Main',
    top: 0,
    backgroundImage: gb.utils.getImage('background.png')
  }),
  
  elements: {
    view: Titanium.UI.createView({
      layout: 'horizontal',
      scrollType: 'horizontal',
      horizontalWrap: false,
      disableBounce: true,
      horizontalBounce: false,
      focusable: false,
      contentWidth: 'auto'
    }),
    
    views: {
      sidebar: Titanium.UI.createView({
        right: -Titanium.Platform.displayCaps.platformWidth,
        bottom: 0,
        width: Titanium.Platform.displayCaps.platformWidth,
        backgroundImage: gb.utils.getImage('screens/sidebar/background.png')
      }),
      
      main: Titanium.UI.createView({
        width: Titanium.Platform.displayCaps.platformWidth,
        backgroundColor: 'white'
      })
    },
    
    buttons: {
      sidebar: Titanium.UI.createImageView({
        top: '10dp',
        left: '10dp',
        width: 'auto',
        height: 'auto',
        canScale: false,
        zIndex: 2,
        image: gb.utils.getImage('screens/main/buttons/sidebar_default.png')
      })
    },
    
    sidebar: {
      username: Titanium.UI.createLabel({
        top: '14dp',
        left: '58dp',
        color: '#FFFFFF',
        shadowColor: '#27333e',
        shadowOffset: { x: -1, y: 0 },
        font: { fontSize: '18dip', fontFamily: 'Helvetica Neue', fontStyle: 'normal', fontWeight: 'bold' }
      }),
      
      back: Titanium.UI.createLabel({
        top: '12dp',
        right: '10dp',
        color: '#FFFFFF',
        shadowColor: '#27333e',
        shadowOffset: { x: -1, y: 0 },
        font: { fontSize: '18dip', fontFamily: 'Helvetica Neue', fontStyle: 'normal', fontWeight: 'bold' }
      })
    },
    
    images: {
      avatar: Titanium.UI.createImageView({
        top: '4dp',
        left: '4dp',
        width: '46px',
        height: '46px'
      }),
      
      avatarBack: Titanium.UI.createImageView({
        top: '3dp',
        left: '3dp',
        image: gb.utils.getImage('screens/sidebar/avatar_background.png')
      }),
      
      header: Titanium.UI.createImageView({
        top: '0dp',
        image: gb.utils.getImage('screens/main/header.png'),
        zIndex: 1
      }),
    }
  },
  
  Constructor: function () {
    var $self = this, $el = this.elements, $file = Titanium.Filesystem, $window = this.window;
    
    // Force orientation
    $window.orientationModes = [ Ti.UI.PORTRAIT ];
    
    // Views
    Titanium.include('/lib/views/qrcode.js');
    Titanium.include('/lib/views/places.js');
    
    // Attach Views
    $el.views.main.add(gb.Views.get('qrcode').self);
    $el.views.main.add(gb.Views.get('places').self);
    
    // Attach Header
    $el.views.main.add($el.images.header);
    $el.views.main.add($el.buttons.sidebar);
    
    // Sidebar Attachments
    $el.views.sidebar.add($el.images.avatarBack);
    $el.views.sidebar.add($el.sidebar.username);
    
    // Events
    $el.buttons.sidebar.addEventListener('click', function (e) {
      $self.toggleSidebar.apply($self, [ e ]);
    });
    
    // Add views to scrollable view.
    $el.view.add($el.views.sidebar);
    $el.view.add($el.views.main);
    // $el.view.scrollToView(1);
    
    // Add scrollable to window.
    this.add($el.view);
    
    return this;
  },
  
  onShow: function () {
    var $self = this, $el = this.elements, $file = Titanium.Filesystem, $user = gb.consumer, $url, written = true;
    
    // Direct Pages, then delegate background tasks.
    GB.Views.show('places');
    
    // Username
    $el.sidebar.username.setText($user.getUsername());
    
    // If it doesn't write the first time we use the url, it will write the next time.
    $user.getAvatar(85, function (image) {
      console.log(image);
      
      $el.images.avatar.setImage(image);
      $el.views.sidebar.add($el.images.avatar);
    });
  },
  
  /**
   * Toggle sidebar state and slide main screen in and out.
   */
  toggleSidebar: function (e) {
    var $el = this.elements;
    
    if (!this.animated) {
      this.animated = !0;
      $el.views.main.animate({ left: Titanium.Platform.displayCaps.platformWidth-70, duration: 250 });
      $el.buttons.sidebar.setImage(gb.utils.getImage('screens/main/buttons/sidebar.png'));
    } else {
      this.animated = !1;
      $el.views.main.animate({ left: 0, duration: 250 });
      $el.buttons.sidebar.setImage(gb.utils.getImage('screens/main/buttons/sidebar_default.png'));
    }
  }
}));
