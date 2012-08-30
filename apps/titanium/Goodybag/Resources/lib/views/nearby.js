
var $http = gb.utils.http
,   $file = Titanium.Filesystem;

GB.Views.add('nearby', {
  location: 'Nearby',
  models: {},
  locations: [],
  iterable: [],
  views: [],
  
  elements: {
    holder: gb.style.get('nearby.holder'),
    
    menu: {
      base: gb.style.get('nearby.menu.base'),
      nearby: new GB.StreamButton('Nearby Places'),
      map: new GB.StreamButton('Map View')
    }
  },
  
  /*
   * Position of user, default is center of Austin, TX.
   */
  position: {
    lat: 30.266703,
    lon: -97.73798
  },
  
  /**
   * Grab and store places location and initialize View.
   * @constructor
   */
  Constructor: function () {
    var store = $file.getFile($file.applicationDataDirectory, 'places.json');
    this.self = gb.style.get('nearby.self');
    this.page = 0;
    
    this.fetch(function (error, results) {
      store.deleteFile();
      store.write(JSON.stringify(results));
      store = null;
    }, true, true);
  },
  
  /**
   * Called when view opens.
   * 
   * @param  {Mixed} context
   * @private
   */
  onShow: function (context) {
    var $this = this, $el = this.elements, locations, location;
    
    if (this.location == 'Place') this.location = 'Nearby';
    
    if($el.menu.base.children.length < 1) {
      $el.menu.nearby.addEventListener('click', function () { 
        if ($el.places) $el.places.visible = true; else $this.showNearby(); 
        if ($el.map) $el.map.visible = false;
        $el.menu.nearby.activate();
        $el.menu.map.deactivate();
      });
      
      $el.menu.map.addEventListener('click', function () {
        if ($el.places) $el.places.visible = false;
        if ($el.map) $el.map.visible = true; else $this.showMap();
        $el.menu.nearby.deactivate();
        $el.menu.map.activate();
      });
      
      $el.menu.base.add($ui.createView({ width: $ui.FILL, height: '6dp'}));
      $el.menu.base.add($el.menu.nearby.base);
      $el.menu.base.add($el.menu.map.base);
    }
    
    this.self.add($el.menu.base);
    this.self.add($el.holder);
    
    // Setup User Location if Available and not in Development Mode
    gb.consumer.getGeolocation(function (coords) {
      if (!gb.config.development) {
        $this.position = {
          lat: coords.latitude,
          lon: coords.longitude
        };
      }
      
      if ($this.previous && (
        $this.position.lat == $this.previous.lat &&
        $this.position.lon == $this.previous.lon
      )) {
        $this['show' + $this.location]();
      } else {
        $this.fetch(function (error, results) {
          var i, model, locations; $this.models = {}; $this.locations = [];
          
          function mem (param) {  
             if (!$this.memcache) $this.memcache = {};
             var store = JSON.stringify(param[0].getPosition()) + 
             JSON.stringify(param[1].getPosition()) + 
             JSON.stringify($this.position);
             if (!$this.memcache[store]) $this.memcache[store] = $this.compareLocations.apply($this, param);
             return $this.memcache[store];
          }
          
          if(results && results.data) {
            for (i = 0; i < results.data.length; i++) {
              if (!results.data[i] && !results.data[i]._id) continue;
              $this.models[results.data[i]._id] = new GB.Models.Place(results.data[i]);
            }
          }
          
          for (i in $this.models) {
            locations = $this.models[i].getLocations();
            for (x = 0; x < locations.length; x++) {
              $this.locations.push(locations[x]);
            }
          }
          
          $this.locations.sort(function (a, b) {
            return mem([a, b]);
          });
          
          $this.previous = $this.position;
    
          $this['show' + $this.location]();
        }, true);
      }
    });
  },
  
  exists: function (id) {
    return !!this.models[id];
  },
  
  showNearby: function () {
    var $this = this;
    var $el = this.elements;
    var locations;
    var i, x;
    
    // If it still exists, get rid of it.
    if ($el.places) $el.holder.remove($el.places), $el.places = null;
    
    // Setup Page
    this.page = 0;
    
    // Setup Infiniscroll
    $el.places = new gb.Views.InfiniScroll(gb.style.get('nearby.places'), {
      triggerAt: '82%',
      onScrollToEnd: function () {
        $this.page++;
        $this.onScroll.apply($this);
      },
      name: "Places"
    });
    
    $el.menu.nearby.activate();
    $el.menu.map.deactivate();
     
    this.onScroll(true);
    this.location = 'Nearby';
  },
  
  onScroll: function (initial) {
    var $this = this, start = (this.page === 0) ? 0 : (30 * this.page), end =  30 * (this.page + 1);
    var middleman = $ui.createView({ width: $ui.FILL, height: $ui.SIZE, layout: 'vertical' });
    if (end > $this.locations.length) 
      if (end - $this.locations.length > 30) return;
      else end -= $this.locations.length;
    for (i = start; i < end; i++) {
      middleman.add($this.locations[i].toRow(i%2, function (e) { 
        $this.onPlaceClick.apply($this, [ this ]); 
      }));
    }
    this.elements.places.add(middleman);
    (initial) && (this.elements.holder.add(this.elements.places.view));
  },
  
  /**
   * Creates and displays a single location page.
   */
  showPlace: function (place, location) {
    var $this = this
    ,   $el = this.elements;
    
    if (typeof place == 'string') place = this.models[place];
    if ($el.place) $this.self.remove($el.place), $el.place.close(), $el.place = null;
    
    $el.place = $ui.createWindow();
    var back  = new GB.StreamButton('Back');
    
    // Styles
    var area = "nearby.location";
    var elements = {
      base: $el.place,
      
      menu: {
        base: gb.style.get('nearby.menu.base'),
        blank: $ui.createView({ width: $ui.FILL, height: '6dp'}),
        back: back.base
      },
      
      holder: {
        base: gb.style.get(area + '.holder'),
        
        header: {
          base: gb.style.get(area + '.header.base'),
          
          left: {
            base: gb.style.get(area + '.header.left'),
            image: gb.style.get(area + '.header.image')
          },
          
          right: {
            base: gb.style.get(area + '.header.right'),
            name: gb.style.get(area + '.header.name'),
            details: gb.style.get(area + '.header.details')
          },
        }, 
        
        number: {
          base: gb.style.get(area + '.header.sub.base'),
          inner: {
            base: gb.style.get(area + '.header.sub.inner'),
            
            one: gb.style.get(area + '.header.sub.one ' + area + '.header.sub.padding', { 
              text: 'NUMBER', top: 8,
            }),
            
            two: gb.style.get(area + '.header.sub.two ' + area + '.header.sub.padding')
          }
        },
        
        url: {
          base: gb.style.get(area + '.header.sub.base'),
          inner: {
            base: gb.style.get(area + '.header.sub.inner'),
            
            one: gb.style.get(area + '.header.sub.one ' + area + '.header.sub.padding', { 
              text: 'URL', top: 8,
            }),
            
            two: gb.style.get(area + '.header.sub.two ' + area + '.header.sub.padding')
          }
        },
        
        points: {
          base: gb.style.get(area + '.header.sub.base'),
          inner: {
            base: gb.style.get(area + '.header.sub.inner'),
            
            one: gb.style.get(area + '.header.sub.one ' + area + '.header.sub.padding', { 
              text: 'KARMA POINTS', top: 8,
            }),
            
            two: gb.style.get(area + '.header.sub.two ' + area + '.header.sub.padding')
          }
        },
        
        title: {
          base: gb.style.get(area + '.title.base'),
          header: gb.style.get(area + '.title.header', {
            text: 'Goodies:'
          })
        }
      }
    }; gb.utils.compoundViews(elements);
    
    // Showing function
    function show () {
      $el.holder.setVisible(false);
      $el.menu.base.setVisible(false);
      $el.place.show();
      $this.self.add($el.place);
    }
    
    // Menu
    elements.menu.back.addEventListener('click', function (e) {
      back.activate();
      
      // Clear Place
      $el.place.setVisible(false);
      $this.self.remove($el.place);
      $el.place.close();
      $el.place = null;
      
      // Set Holder up
      $el.holder.backgroundColor = 'yellow';
      $el.holder.setVisible(true);
      
      // Set Menu to visible
      $el.menu.base.setVisible(true);
    });
    
    // URL Click Event
    elements.holder.url.base.addEventListener('click', function (e) {
      $this.createModal(place.parent.getUrl());
    });
    
    // Remove unnecessary things
    var url = place.parent.getUrl().replace('http://','').toLowerCase();
    if (url) if (url[url.length-1] == '/') url = url.substr(0, url.length-1);
    
    // Setup Text
    elements.holder.header.right.name.setText(place.parent.getName());
    elements.holder.header.right.details.setText(place.getAddress().replace(/,\s/, "\n"));
    elements.holder.number.inner.two.setText(
      place.getNumber().replace(/^1?(\d{3})\s?\-?\.?(\d{3})\s?\-?\.?(\d{4})$/, '($1) $2-$3') 
      || 'N/A'
    );
    
    // URL?
    elements.holder.url.inner.two.setText(url || 'N/A');
    
    // Fetch Location Image
    place.parent.getImage(128, function (data) {
      elements.holder.header.left.image.setImage(data);
    });
    
    // Show Users Points Earned at this location if applicable
    place.parent.getPointsEarned(gb.consumer.getCode(), function (data) {
      elements.holder.points.inner.two.text = data || 0;
    });
    
    // Fetch Goodies for Single Location
    place.parent.getGoodies(function (data) {
      var goodies = gb.style.get(area + '.goodies.base');
      
      if (data == null) {
        console.log('adding no goodies text');
        
        goodies.add(gb.style.get(area + '.goodies.err', {
          text: 'None Available'
        }));
        
        elements.holder.base.add(goodies);
        show();
        return;
      }
      
      for (var i = 0; i < data.length; i++) {
        var goody = data[i]; if (!goody.active) continue;
        
        var place = {
          base: gb.style.get(area + '.goody.base', {
            borderWidth: i%2 ? 0 : 1,
            borderColor: '#eee'
          }),
          
          desc: gb.style.get(area + '.goody.label', {
            text: goody.name
          }),
          
          icon: {
            base: gb.style.get(area + '.goody.icon.base'),
            
            amount: gb.style.get(area + '.goody.icon.amount', {
              text: goody.karmaPointsRequired
            }),
            
            text: gb.style.get(area + '.goody.icon.text', {
              text: 'KP'
            })
          }
        };
        
        gb.utils.compoundViews(place);
        
        if (i == data.length-1) 
          place.base.bottom = 44;
          
        goodies.add(place.base);
      }
      
      elements.holder.base.add(goodies);
      show();
    });
  },
  
  showMap: function () {
    var $this = this
    ,   $el = this.elements
    ,   annotations = [];
    
    if ($el.map) $el.holder.remove($el.map);

    for (i = 0; i < this.locations.length; i++) {
      annotations.push(this.locations[i].toAnnotation(function (e, parent) {
        $this.onPlaceClick(this);
      }));
    }

    $el.map = Titanium.Map.createView({
      region: {
        latitude: $this.position.lat,
        longitude: $this.position.lon,
        latitudeDelta: .07,
        longitudeDelta: .07
      },
      animate: true,
      regionFit: true,
      userLocation: true,
      annotations: annotations
    });
    
    $el.holder.add($el.map);
    $el.menu.nearby.deactivate();
    $el.menu.map.activate();
  },
  
  onHide: function () {
    var $el = this.elements;
    
    ($el.map) && ($el.holder.remove($el.map), $el.map = null);
    ($el.places) && ($el.holder.remove($el.places.view), $el.places.view = null);
    ($el.place) && ($this.self.remove($el.place), $el.place.close(), $el.place = null);
  },
  
  /**
   * Called when a place row is clicked.
   *
   * Determines which location has been chosen and opens a view 
   * with the location information.
   * 
   * @param  {Object} e Event Handler
   */
  onPlaceClick: function (place) {
    this.showPlace(place);
  },
  
  createModal: function (url) {
    if (typeof url === 'undefined') return;
    var modal = $ui.createWindow();
    var back = $ui.createButton({ title: 'Back' });
    var webview = Titanium.UI.createWebView({ url: url });
    
    back.addEventListener('click', function (e) {
      modal.close();
      webview = null, back = null;
      modal = null;
    });
    
    modal.setLeftNavButton(back);
    modal.add(webview);
    modal.open(gb.style.get('nearby.location.modal'));
  },
  
  /**
   * Comparator for sorting. Sort by name, alphabetically.
   * 
   * @param  {Object} a
   * @param  {Object} b
   * @return {Integer}
   */
  compareLocations: function (a, b, c, d, e, f) {
    e = a.getPosition();
    if (!e.lat && !e.lon) return 1;
    f = b.getPosition();
    if (!f.lat && !f.lon) return -1;
    c = a.getDistanceFrom(this.position);
    d = b.getDistanceFrom(this.position);
    if (c < d) return -1;
    if (c > d) return 1;
    return 0;
  },
  
  /**
   * Check local cache, return if exists, in the background 
   * fetch and download latest data and update local cache.
   * 
   * @param  {Function} callback called upon datasource obtained.
   * @param  {Boolean}  download delegates whether or not to download new data.
   * @private
   */
  fetch: function (callback, download, force) {
    var limit = 1000, called = false;
    var store = $file.getFile($file.applicationDataDirectory, 'places.json');
    
    if (store.exists() && !force) {
      callback(null, JSON.parse(store.read()));
      called = true;
    }
    
    store = null;
    
    if (download) {
      $http.get(gb.config.api.participating + limit, function (error, results) {
        if (error) {
          if (!called) callback(error);
        } else {
          if (!called) callback(null, JSON.parse(results));
        }
      });
    }
  }
});