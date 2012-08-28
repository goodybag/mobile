
gb.Views.add('profile', {
  self: gb.style.get('profile.self'),
  
  elements: {
    holder: {
      base: gb.style.get('profile.holder'),
      
      header: {
        base: gb.style.get('profile.header.base'),
        
        left: {
          base: gb.style.get('profile.header.left'),
          image: gb.style.get('profile.header.image')
        },
        
        right: {
          base: gb.style.get('profile.header.right'),
          name: gb.style.get('profile.header.sideLabel profile.header.name'),
          username: gb.style.get('profile.header.sideLabel profile.header.username'),
          location: gb.style.get('profile.header.sideLabel profile.header.location'),
          joined: gb.style.get('profile.header.sideLabel profile.header.joined'),
        },
      },
      
      donated: {
        base: gb.style.get('profile.header.sub.base'),
        inner: {
          base: gb.style.get('profile.header.sub.inner'),
          one: gb.style.get('profile.header.sub.one profile.header.sub.padding'),
          two: gb.style.get('profile.header.sub.two profile.header.sub.padding')
        }
      },
      
      charity: {
        base: gb.style.get('profile.header.sub.base'),
        inner: {
          base: gb.style.get('profile.header.sub.inner'),
          one: gb.style.get('profile.header.sub.one profile.header.sub.padding'),
          two: gb.style.get('profile.header.sub.two profile.header.sub.padding', {
            color: gb.ui.color.pink
          })
        }
      },
      
      tapins: {
        base: gb.style.get('profile.header.sub.base'),
        inner: {
          base: gb.style.get('profile.header.sub.inner'),
          one: gb.style.get('profile.header.sub.one profile.header.sub.padding'),
          two: gb.style.get('profile.header.sub.two profile.header.sub.padding')
        }
      },
      
      title: {
        base: gb.style.get('profile.title.base'),
        header: gb.style.get('profile.title.header'),
        subHeader: gb.style.get('profile.title.subHeader')
      },
      
      locations: {
        base: gb.style.get('profile.locations.base')
      }
    }
  },
  
  Constructor: function () {
    var $this = this, $self = this.self, $el = this.elements;
    var merged = gb.utils.compoundViews($el.holder);
    $self.add(merged);
  },
  
  onShow: function () {
    this.createHeader();
    this.createPlaces();
  },
  
  createHeader: function () {
    var $this = this, $self = this.self, $el = this.elements, $user = gb.consumer, amt = $user.getTotalDonated();
    var $holder = $el.holder, $header = $el.holder.header, date = $user.getJoinDate();
    $header.right.base.startLayout();
    $header.right.name.setText($user.getName());
    $header.right.username.setText($user.getUsername());
    $header.right.location.setText('Austin, Tx');
    
    if (date) {
      $header.right.joined.setText('Member Since: ' + 
        date.getMonth() + ' / ' + 
        date.getDay()  + ' / ' + 
        date.getFullYear()
      );
    }
    
    $header.right.base.finishLayout();
    
    $holder.donated.inner.base.startLayout();
    $holder.donated.inner.one.setText('Total Donated:');
    $holder.donated.inner.two.setText('$' + ((amt === 0) ? amt : gb.utils.formatMoney(amt / 100)));
    $holder.donated.inner.base.finishLayout();
    
    $holder.charity.inner.base.startLayout();
    $holder.charity.inner.one.setText('Selected Charity:');
    $holder.charity.inner.two.setText($user.getCharityName());
    $holder.charity.inner.base.finishLayout();
    
    
    $user.getTapinCount(function (data) {
      $holder.tapins.inner.base.startLayout();
      if (!data) {
        $holder.tapins.base.visible = false;
      } else {
        $holder.tapins.base.visible = true;
        $holder.tapins.inner.one.setText('Total Tapins:');
        $holder.tapins.inner.two.setText(data);
      }
      $holder.tapins.inner.base.finishLayout();
    });
    
    $user.getAvatar(128, function (image) {
      $header.left.image.setImage(image);
    });
  },
  
  createPlaces: function () {
    var $this = this, $self = this.self, $el = this.elements, $user = gb.consumer;
    var $holder = $el.holder, $locations = $el.holder.locations;
    $holder.title.header.setText('My Top Places:');
    $holder.title.subHeader.setText('by tapins');
    
    $user.getLocationsByTapins(function (data) {
      for (var i = 0; i < data.length; i++) {
        if (!data[i].name) continue;
        var model   = new GB.Models.Place({ _id: data[i].business.org.id })
        ,   area    = 'profile.locations.item.inner'
        ,   base    = gb.style.get('profile.locations.item.base')
        ,   inner   = gb.style.get(area + '.base')
        ,   imageH  = gb.style.get(area + '.image.base')
        ,   image   = gb.style.get(area + '.image.container')
        ,   name    = gb.style.get(area + '.name', { text: data[i].name })
        ,   tapins  = gb.style.get(area + '.tapins', {
              text: data[i].business.data.tapIns.totalTapIns
            });
            
        model.getImage(128, function (data) {
          image.setImage(data);
        });
       
        gb.utils.compound([
          base, inner
        ], [
          inner, imageH, name, tapins
        ], [
          imageH, image
        ], [
          $locations.base, base
        ]);
      };
    })
  }
});
