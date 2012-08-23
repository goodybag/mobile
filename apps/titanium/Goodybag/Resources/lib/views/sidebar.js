
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
    var $el = this.elements, $self = this.self;
    
    $el.list.nearby     = gb.style.get('sidebar.list.base sidebar.list.nearby',     null, null, this);
    $el.list.sponsored  = gb.style.get('sidebar.list.base sidebar.list.sponsored',  null, null, this);
    $el.list.activity   = gb.style.get('sidebar.list.base sidebar.list.activity',   null, null, this);
    $el.list.settings   = gb.style.get('sidebar.list.base sidebar.list.settings',   null, null, this);
    
    $self.add($el.header.background);
    $self.add($el.header.avatar.background);
    $self.add($el.header.avatar.image);
    $self.add($el.header.username);
    $self.add($el.bank.background);
    
    for (var slot in $el.bank.slots)
      $self.add($el.bank.slots[slot]);
    
    for (var item in $el.list)
      $self.add($el.list[item]);
      
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
  
  setActive: function (area) {
    var $el = this.elements, view;
    
    // General Cleanup
    this.clearActive();
    if (area == 'activity') view = 'stream';
    else if (area == 'sponsored') view = 'charities';
    else view = area;
    this.active = area;
    $prop.setString('location', area);
    
    // Show The Area
    GB.Views.show(view);
    
    // Swap and close the sidebar
    $el.list[area].image = gb.utils.getImage('screens/sidebar/items/' + area + '_active.png');
    this.parent.toggleSidebar();
  },
  
  clearActive: function () {
    var $el = this.elements;
    if (!this.active) return;
    $el.list[this.active].image = gb.utils.getImage('screens/sidebar/items/' + this.active + '.png');
  }
});