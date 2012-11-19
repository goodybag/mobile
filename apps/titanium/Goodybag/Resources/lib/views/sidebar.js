
GB.Views.add('sidebar', {
  self: gb.style.get('sidebar.self'),
  
  elements: {
    header: {
      background: gb.style.get('sidebar.header.background'),
      username: gb.style.get('sidebar.header.username'),
      
      avatar: {
        image: gb.style.get('sidebar.header.avatar.image'),
        background: gb.style.get('sidebar.header.avatar.background')
      }
    },
    
    bank: {
      background: gb.style.get('sidebar.bank.background'),
      
      slots: {
        "01": gb.style.get('sidebar.bank.slots.base sidebar.bank.slots.one'),
        "02": gb.style.get('sidebar.bank.slots.base sidebar.bank.slots.two'),
        "03": gb.style.get('sidebar.bank.slots.base sidebar.bank.slots.three'),
        "04": gb.style.get('sidebar.bank.slots.base sidebar.bank.slots.four'),
        "05": gb.style.get('sidebar.bank.slots.base sidebar.bank.slots.five'),
        "06": gb.style.get('sidebar.bank.slots.base sidebar.bank.slots.six'),
        "07": gb.style.get('sidebar.bank.slots.base sidebar.bank.slots.seven')
      }
    },
    
    list: { 
      view: gb.style.get('sidebar.list.base')  
    }
  },
  
  Constructor: function () { 
    var $el = this.elements, $self = this.self, $this = this;
    
    function profile (e) {
      $this.clearActive();
      $this.setActive('profile');
    }
    
    $el.header.background.addEventListener('click', profile);
    $el.header.username.addEventListener('click', profile);
    $el.header.avatar.image.addEventListener('click', profile);
    
    $el.header.avatar.background.add($el.header.avatar.image);
    $el.header.background.add($el.header.avatar.background);
    $el.header.background.add($el.header.username);
    
    // Bank Slots
    for (var slot in $el.bank.slots) 
      $el.bank.background.add($el.bank.slots[slot]);
    
    $self.add($el.header.background);
    $self.add($el.bank.background);
    
    // Side-bar items
    [ 'nearby', 'activity', 'settings', 'update' ].forEach(function (item) {
      $el.list[item] = gb.style.get('sidebar.list.item.base');
      $el.list[item].icon = gb.style.get('sidebar.list.item.inactive sidebar.list.' + item + '.icon');
      $el.list[item].text = gb.style.get('sidebar.list.item.inactive sidebar.list.' + item + '.text');
      $el.list[item].add($el.list[item].icon);
      $el.list[item].add($el.list[item].text);
      
      var fn = function (e) {
        $this.clearActive();
        $this.setActive(item);
      };
      
      if (item === 'update') {
        fn = function () {
          Ti.Platform.openURL(gb.config.appStoreUrl);
        };
      }
      
      $el.list[item].addEventListener('click', fn);
      $el.list.view.add($el.list[item]);
    });
    
    // Hide the update button until we need it
    $el.list.update.hide();
    $el.list.update.setVisible(false);
    
    $self.add($el.list.view);
      
    // Events
    gb.consumer.on('change:avatar', function(){ $self.setAvatar(); });
    gb.consumer.on('change:name', function(){ $el.header.username.setText(gb.consumer.getUsername()); });
    gb.consumer.on('change:screenName', function(){ $el.header.username.setText(gb.consumer.getUsername()); });
    
    return this;
  },
  
  setDetails: function ($user) {
    var $self = this.self, $el = this.elements, list = [], donated, amt, item;
    
    $el.header.username.setText($user.getUsername());
    amt = parseInt($user.data.funds.donated);
    if (amt > 0) {
      for (var i = 7; i > 1; i--) {
        if (i == 5) continue;
        list.push(i < 10 ? "0" + i : "" + i);
      }
      
      if (amt < 100)
        if (amt < 10) amt = "00" + amt;
        else amt = "0" + amt;
      
      donated = amt.toString().split("");
      donated.reverse();
      
      for(var i = 0; i < donated.length; i++) {
        item = list[i];
        $el.bank.slots[item].text = donated[i];
        $el.bank.slots[item].visible = true;
        item == "04" && ($el.bank.slots['05'].visible = true);
      }
    } else {
      $el.bank.slots["04"].visible = true;
      $el.bank.slots["05"].visible = true;
      $el.bank.slots["06"].visible = true;
      $el.bank.slots["07"].visible = true;
      $el.bank.slots["07"].text = "0";
      $el.bank.slots["06"].text = "0";
      $el.bank.slots["04"].text = "0";
    }
    
    this.setAvatar();
  },
  
  setAvatar: function () {
    var $self = this;
    
    gb.consumer.getAvatar(128, function (image) {
      $self.elements.header.avatar.image.setImage(image);
    });
  },
  
  setActive: function (area, view) {
    var main = GB.Windows.get('main');
    if (this.active == area) return main.closeSidebar();
    
    // Correct name for files.
    if (area === 'activity') {
      view = 'stream';
    } else if (area === 'sponsored') {
      view = 'charities';
    } else {
      view = area;
    }
    
    // Save Location
    var $el = this.elements.list;
    this.active = area;
    $prop.setString('location', area);
    
    // Close side-bar.
    main.closeSidebar();
    
    if (area !== 'profile' && area !== 'qrcode')
      $el[this.active].setBackgroundColor(gb.style.base.sidebar.list.item.active.background),
      $el[this.active].icon.setColor(gb.style.base.sidebar.list.item.active.color),
      $el[this.active].text.setColor(gb.style.base.sidebar.list.item.active.color);
    
    // Show The Area
    main.showPage(view);
    main.toggleQRCode();
  },
  
  clearActive: function () {
    var $el = this.elements.list;
    if (typeof this.active === 'undefined' || this.active === 'profile' || this.active === 'qrcode') return;
    $el[this.active].setBackgroundColor(gb.style.base.sidebar.list.item.base.background);
    $el[this.active].icon.setColor(gb.style.base.sidebar.list.item.inactive.color);
    $el[this.active].text.setColor(gb.style.base.sidebar.list.item.inactive.color);
    this.active = undefined;
  },
  
  showUpdate: function () {
    this.elements.list.update.show();
  },
  
  hideUpdate: function () {
    this.elements.list.update.hide();
  }
});