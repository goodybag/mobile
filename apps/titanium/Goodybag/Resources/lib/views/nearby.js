
var $http = gb.utils.http
,   $file = Titanium.Filesystem;

GB.Views.add('nearby', {
  /**
   * Is the loader showing?
   */
  loading: false,
  
  /**
   * Initial location when going traversing pages.
   */
  location: 'Nearby',
  
  /**
   * Holder Object for Data Modules
   */
  models: {},
  
  /*
   * Arraysets
   */
  locations: [],
  iterable: [],
  views: [],
  
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
    
    this.elements = {
      holder: gb.style.get('nearby.holder'),
      
      menu: {
        base: gb.style.get('nearby.menu.base'),
        nearby: new GB.StreamButton('Nearby Places'),
        map: new GB.StreamButton('Map View')
      }
    };
    
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
    
    console.log('If place change to nearby');
    if (this.location == 'Place') this.location = 'Nearby';
    
    console.log('Build menu if it does not exist');
    if($el.menu.base.children.length < 1) {
      console.log('add click event to menu buttons');
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
      console.log('create spacer');
      $el.menu.base.add($ui.createView({ width: $ui.FILL, height: '6dp'}));
      console.log('add nearby button');
      $el.menu.base.add($el.menu.nearby.base);
      console.log('add map button');
      $el.menu.base.add($el.menu.map.base);
    }
    
    gb.utils.debug('[Nearby] Adding Elements to Main View');
    this.self.add($el.menu.base);
    this.self.add($el.holder);
    
    gb.utils.debug('[Nearby] Getting Geolocation');
    // Setup User Location if Available and not in Development Mode
    gb.consumer.getGeolocation(function (coords) {
      if (!gb.config.development && coords && coords.latitude && coords.longitude) {
        $this.position = {
          lat: coords.latitude,
          lon: coords.longitude
        };
      }
      
      gb.utils.debug('[Nearby] Checking previous location data for difference.')
      if ($this.previous && (
        $this.position.lat == $this.previous.lat &&
        $this.position.lon == $this.previous.lon
      )) {
        gb.utils.debug('[Nearby] ')
        $this['show' + $this.location]();
      } else {
        // Loader Start
        gb.utils.debug('[Nearby] Checking loader');
        if (!this.loading) GB.Windows.get('main').showLoader(), this.loading = true;
        
        gb.utils.debug('[Nearby] Fetching Data');
        $this.fetch(function (error, results) {
          var i, model, locations; $this.models = {}; $this.locations = [];
          gb.utils.debug('[Nearby] Checking loaded data');
          function mem (param) {  
             if (!$this.memcache) $this.memcache = {};
             var store = JSON.stringify(param[0].getPosition()) + 
             JSON.stringify(param[1].getPosition()) + 
             JSON.stringify($this.position);
             if (!$this.memcache[store]) $this.memcache[store] = $this.compareLocations.apply($this, param);
             return $this.memcache[store];
          }
          gb.utils.debug('[Nearby] Checking loaded data');
          if(results && results.data) {
            for (i = 0; i < results.data.length; i++) {
              if (!results.data[i] && !results.data[i]._id) continue;
              $this.models[results.data[i]._id] = new GB.Models.Place(results.data[i]);
            }
          }
          gb.utils.debug('[Nearby] Iterate through locations and add them');
          for (i in $this.models) {
            locations = $this.models[i].getLocations();
            for (x = 0; x < locations.length; x++) {
              $this.locations.push(locations[x]);
            }
          }
          gb.utils.debug('[Nearby] Sort added locations');
          $this.locations.sort(function (a, b) {
            return mem([a, b]);
          });
          
          $this.previous = $this.position;
    
          $this['show' + $this.location]();
          
          gb.utils.debug('[Nearby] Checking loader, part two');
          if (this.loading) GB.Windows.get('main').hideLoader(), this.loading = false;
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
    
    // Setup Page
    this.page = 0;
    
    // Setup Infiniscroll
    console.log('setting up infiniscroll');
    $el.places = new gb.Views.InfiniScroll(gb.style.get('nearby.places'), {
      triggerAt: '82%',
      onScrollToEnd: function () {
        $this.page++;
        $this.onScroll.apply($this);
      },
      name: "Places"
    });
    
    console.log('activating nearby button');
    $el.menu.nearby.activate();
    $el.menu.map.deactivate();
    
    console.log('set scrolling to true and location to nearby');
    this.onScroll(true);
    this.location = 'Nearby';
  },
  
  onScroll: function (initial) {
    var $this = this, start = (this.page === 0) ? 0 : (30 * this.page), end =  30 * (this.page + 1);
    var middleman = $ui.createView({ width: $ui.FILL, height: $ui.SIZE, layout: 'vertical' });
    
    // Loader Start
    if (!this.loading) GB.Windows.get('main').showLoader(), this.loading = true;
    
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
    
    // Loader End
    if (this.loading) GB.Windows.get('main').hideLoader(), this.loading = false;
  },
  
  /**
   * Creates and displays a single location page.
   */
  showPlace: function (place, location) {
    // Loader Start
    if (!this.loading) GB.Windows.get('main').showLoader(), this.loading = true;
    
    
    var $this = this
    ,   $el = this.elements;
    
    if (typeof place == 'string') place = this.models[place];
    if ($el.place) $this.self.remove($el.place), $el.place.close(), $el.place = null;
    
    $el.place = $ui[Ti.Android ? 'createView' : 'createWindow']();
    // var back  = new GB.StreamButton('Back');
    var url   = null;
    
    // Styles
    var area = "nearby.location";
    var elements = {
      base: $el.place,
      
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
      
      // Back
      GB.Windows.get('main').toggleBack(function () {
        
        GB.Windows.get('main').showLoader();
        
        // Clear Place
        $el.place.setVisible(false);
        $this.self.remove($el.place);
        $el.place.close();
        $el.place = null;
        $el.menu.base.setVisible(true);
        
        // Set Holder up
        $el.holder.setVisible(true);
        
        GB.Windows.get('main').hideLoader();
      });
    
      // Loader End
      if ($this.loading) GB.Windows.get('main').hideLoader(), $this.loading = false;
    }
    
    // URL Click Event
    elements.holder.url.base.addEventListener('click', function (e) {
      $this.createModal(place.parent.getUrl());
    });
    
    // Remove unnecessary things
    if (place.parent.getUrl()) url = place.parent.getUrl().replace('http://','').toLowerCase();
    if (url) if (url[url.length-1] == '/') url = url.substr(0, url.length-1);
    
    // Setup Text
    elements.holder.header.right.name.setText(place.parent.getName());
    elements.holder.header.right.details.setText(place.getAddress().replace(/,\s/, "\n"));
    elements.holder.number.inner.two.setText(
      place.getNumber().replace(/^1?(\d{3})\s?\-?\.?(\d{3})\s?\-?\.?(\d{4})$/, '($1) $2-$3') 
      || 'N/A'
    );
    
    elements.holder.number.base.addEventListener('click', function (e) {
      Titanium.Platform.openURL('tel:' + place.getNumber().replace('/[^0-9]'));
    });
    
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
    
    // Create Map
    $el.map = Titanium.Map.createView({
      region: {
        latitude: $this.position.lat,
        longitude: $this.position.lon,
        latitudeDelta: .07,
        longitudeDelta: .07
      },
      animate: true,
      regionFit: true,
      userLocation: true
    });

    for (i = 0; i < this.locations.length; i++) {
      annotations.push(this.locations[i].toAnnotation(i));
      
      (function (idx) {
        $el.map.addEventListener('click', function (evt) {
          if (evt.annotation.myid == idx && evt.clicksource == 'rightButton')
            $this.onPlaceClick($this.locations[idx]);
        });
      })(i);
    }
    $el.map.setAnnotations(annotations);
    $el.holder.add($el.map);
    $el.menu.nearby.deactivate();
    $el.menu.map.activate();
  },
  
  onHide: function () {
    var $this = this, $el = this.elements;
    
    ($el.map) && ($el.holder.remove($el.map), $el.map = null);
    ($el.places.view) && ($el.holder.remove($el.places.view), $el.places.view = null);
    
    if ($el.place) {
      (!Ti.Android) && $el.place.close && $el.place.close();
      $this.self.remove($el.place)
      $el.place = null;
    }
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
    gb.utils.debug('[Nearby] Checking stored data, and forced variables');
    if (store.exists() && !force) {
      callback(null, JSON.parse(store.read()));
      called = true;
    }
    gb.utils.debug('[Nearby] Unset storage');
    store = null;
    gb.utils.debug('[Nearby] Checking loaded data');
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