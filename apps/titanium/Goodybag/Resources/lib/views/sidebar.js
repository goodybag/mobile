
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
        "01": gb.style.get('sidebar.bank.slots.base', gb.style.get('sidebar.bank.slots.one')),
        "02": gb.style.get('sidebar.bank.slots.base', gb.style.get('sidebar.bank.slots.two')),
        "03": gb.style.get('sidebar.bank.slots.base', gb.style.get('sidebar.bank.slots.three')),
        "04": gb.style.get('sidebar.bank.slots.base', gb.style.get('sidebar.bank.slots.four')),
        "05": gb.style.get('sidebar.bank.slots.base', gb.style.get('sidebar.bank.slots.five')),
        "06": gb.style.get('sidebar.bank.slots.base', gb.style.get('sidebar.bank.slots.six')),
        "07": gb.style.get('sidebar.bank.slots.base', gb.style.get('sidebar.bank.slots.seven')),
        "08": gb.style.get('sidebar.bank.slots.base', gb.style.get('sidebar.bank.slots.eight')),
        "09": gb.style.get('sidebar.bank.slots.base', gb.style.get('sidebar.bank.slots.nine')),
        "10": gb.style.get('sidebar.bank.slots.base', gb.style.get('sidebar.bank.slots.ten')),
        "11": gb.style.get('sidebar.bank.slots.base', gb.style.get('sidebar.bank.slots.eleven')),
        "12": gb.style.get('sidebar.bank.slots.base', gb.style.get('sidebar.bank.slots.twelve')),
        "13": gb.style.get('sidebar.bank.slots.base', gb.style.get('sidebar.bank.slots.thteen')),
        "14": gb.style.get('sidebar.bank.slots.base', gb.style.get('sidebar.bank.slots.frteen')),
        "15": gb.style.get('sidebar.bank.slots.base', gb.style.get('sidebar.bank.slots.ffteen')),
        "16": gb.style.get('sidebar.bank.slots.base', gb.style.get('sidebar.bank.slots.sxteen'))
      }
    },
    
    list: { }
  },
  
  Constructor: function () { 
    var $el = this.elements, $self = this.self;
    
    $el.list.nearby     = gb.style.get('sidebar.list.base', gb.style.get('sidebar.list.nearby'), this);
    $el.list.sponsored  = gb.style.get('sidebar.list.base', gb.style.get('sidebar.list.sponsored'), this);
    $el.list.activity   = gb.style.get('sidebar.list.base', gb.style.get('sidebar.list.activity'), this);
    $el.list.settings   = gb.style.get('sidebar.list.base', gb.style.get('sidebar.list.settings'), this);
    
    $self.add($el.header.background);
    $self.add($el.header.avatar.background);
    $self.add($el.header.username);
    $self.add($el.bank.background);
    
    for (var slot in $el.bank.slots)
      $self.add($el.bank.slots[slot]);
    
    for (var item in $el.list)
      $self.add($el.list[item]);
    
    return this;
  },
  
  setDetails: function ($user) {
    var $self = this.self, $el = this.elements, list = [], donated, item;
    
    $el.header.username.setText($user.getUsername());
    
    if ($user.data.funds.donated > 0) {
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
    
    $user.getAvatar(85, function (image) {
      $el.header.avatar.image.setImage(image);
      $self.add($el.header.avatar.image);
    });
  },
  
  setActive: function (area) {
    var $el = this.elements;
    
    this.clearActive();
    this.active = area;
    $el.items[area].image = gb.utils.getImage('screens/sidebar/items/' + nearby + '_active.png');
  },
  
  clearActive: function () {
    var $el = this.elements;
    
    $el.items[this.active].image = gb.utils.getImage('screens/sidebar/items/' + this.active + '.png');
  }
});