
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
        "07": gb.style.get('sidebar.bank.slots.base sidebar.bank.slots.seven'),
        "08": gb.style.get('sidebar.bank.slots.base sidebar.bank.slots.eight'),
        "09": gb.style.get('sidebar.bank.slots.base sidebar.bank.slots.nine'),
        "10": gb.style.get('sidebar.bank.slots.base sidebar.bank.slots.ten'),
        "11": gb.style.get('sidebar.bank.slots.base sidebar.bank.slots.eleven'),
        "12": gb.style.get('sidebar.bank.slots.base sidebar.bank.slots.twelve'),
        "13": gb.style.get('sidebar.bank.slots.base sidebar.bank.slots.thteen'),
        "14": gb.style.get('sidebar.bank.slots.base sidebar.bank.slots.frteen'),
        "15": gb.style.get('sidebar.bank.slots.base sidebar.bank.slots.ffteen'),
        "16": gb.style.get('sidebar.bank.slots.base sidebar.bank.slots.sxteen')
      }
    },
    
    list: { }
  },
  
  Constructor: function () { 
    var $el = this.elements, $self = this.self, $this = this;
    
    $el.header.background.addEventListener('click', function (e) {
      $this.clearActive();
      $this.setActive('profile');
    });
    
    $self.add($el.header.background);
    $self.add($el.header.avatar.background);
    $self.add($el.header.avatar.image);
    $self.add($el.header.username);
    $self.add($el.bank.background);
    
    // Bank Slots
    for (var slot in $el.bank.slots) $self.add($el.bank.slots[slot]);
    
    // Side-bar items
    [ 'nearby', 'activity', 'settings' ].forEach(function (item) {
      $el.list[item] = gb.style.get('sidebar.list.base sidebar.list.' + item);
      $el.list[item].addEventListener('click', function (e) {
        $this.clearActive();
        $this.setActive(item);
      });
      
      $self.add($el.list[item]);
    });
      
    // Events
    gb.consumer.on('change:avatar', function(){ $self.setAvatar(); });
    gb.consumer.on('change:name', function(){ $el.header.username.setText(gb.consumer.getUsername()); });
    gb.consumer.on('change:screenName', function(){ $el.header.username.setText(gb.consumer.getUsername()); });
    
    return this;
  },
  
  setDetails: function ($user) {
    var $self = this.self, $el = this.elements, list = [], donated, item;
    
    $el.header.username.setText($user.getUsername());
    
    if (parseInt($user.data.funds.donated) > 0) {
      for (var i = 16; i > 3; i--) {
        if (i == 6 || i == 10 || i == 14) continue;
        list.push(i < 10 ? "0" + i : "" + i);
      }
      
      donated = $user.data.funds.donated.toString().split("");
      donated.reverse();
      for(var i = 0; i < donated.length; i++) {
        item = list[i];
        $el.bank.slots[item].text = donated[i];
        $el.bank.slots[item].visible = true;
        item == "13" && ($el.bank.slots['14'].visible = true);
        item == "09" && ($el.bank.slots['10'].visible = true);
        item == "05" && ($el.bank.slots['06'].visible = true);
      }
    } else {
      $el.bank.slots["16"].visible = true;
      $el.bank.slots["16"].text = "0";
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
    if (this.active == area) {
      GB.Windows.get('main').toggleSidebar(true); return;
    }
    
    // Correct name for files.
    if (area === 'activity') {
      view = 'stream';
    } else if (area === 'sponsored') {
      view = 'charities';
    } else {
      view = area;
    }
    
    // Save Location
    this.active = area;
    $prop.setString('location', area);
    
    // Toggle side-bar.
    GB.Windows.get('main').toggleSidebar();
    
    if (area !== 'profile')
      this.elements.list[area].image = gb.utils.getImage('screens/sidebar/items/' + area + '_active.png');
    
    // Show The Area
    GB.Windows.get('main').showPage(view);
    GB.Windows.get('main').toggleQRCode();
  },
  
  clearActive: function () {
    if (typeof this.active === 'undefined' || this.active === 'profile') return;
    this.elements.list[this.active].image = gb.utils.getImage('screens/sidebar/items/' + this.active + '.png');
  }
});