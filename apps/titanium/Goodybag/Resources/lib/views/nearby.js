
var $http = gb.utils.http
,   $file = Titanium.Filesystem;

GB.Views.add('nearby', {
  self: gb.style.get('nearby.self'),
  location: 'Nearby',
  locations: [],
  models: [],
  views: [],
  
  elements: {
    holder: gb.style.get('nearby.holder'),
    
    menu: {
      base: gb.style.get('nearby.menu.base'),
      nearby: new GB.StreamButton('Nearby Places'),
      map: new GB.StreamButton('Map View')
    }
  },
  
  position: {
    lat: 30.266703,
    lon: -97.73798
  },
  
  /**
   * Grab and store places location and initialize View.
   * @constructor
   */
  Constructor: function () {
    var store = $file.getFile($file.applicationDataDirectory, 'places.json')
    ,   $this = this
    ,   $el = this.elements;
    
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
    var $this = this, $el = this.elements, locations;
    
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
      })
      
      $el.menu.base.add($ui.createView({ width: $ui.FILL, height: '6dp'}));
      $el.menu.base.add($el.menu.nearby.base);
      $el.menu.base.add($el.menu.map.base);
    }
    
    this.self.add($el.menu.base);
    this.self.add($el.holder);
    
    this.fetch(function (error, results) {
      var i;
      $this.models = [];
      for (i = 0; i < results.data.length; i++) {
        $this.models.push(new GB.Models.Place(results.data[i]));
      }

      $this['show' + $this.location]();
    }, true);
  },
  
  showNearby: function () {
    var $this = this
    ,   $el = this.elements
    ,   i
    ,   x
    ,   locations;
    
    if($el.places) $el.holder.remove($el.places);
    this.locations = [];
    for(i = 0; i < this.models.length; i++) {
      locations = this.models[i].getLocations();
      for(x = 0; x < locations.length; x++) {
        this.locations.push(locations[x]);
      }
    }

    $el.places = gb.style.get('nearby.places');
    $el.holder.add($el.places);
    $el.menu.nearby.activate();
    $el.menu.map.deactivate();
    
    this.locations.sort(function (a, b) { 
      return $this.compareLocations.apply($this, [a, b]); 
    });
    
    for (i = 0; i < $this.locations.length; i++) {
      $el.places.add($this.locations[i].toRow(i%2, function (e) { 
        $this.onPlaceClick.apply($this, [ this ]); 
      }));
    }
    
    this.location git = 'Nearby';
  },
  
  showPlace: function (place, location) {
    var $this = this
    ,   $el = this.elements;
    
    if ($el.place) $this.self.remove($el.place), $el.place.close();
    
    $el.place  = $ui.createWindow();
    var modal  = $ui.createWindow();
    modal.back = $ui.createButton({ title: 'Back' });
    modal.back.addEventListener('click', function (e) {
      modal.close();
    })
    
    var holder = $ui.createView({ layout: 'vertical' });
    var menu   = gb.style.get('nearby.menu.base');
    var header = gb.style.get('nearby.loc.header.base');
    var points = gb.style.get('nearby.loc.header.points.base');
    var goodies = gb.style.get('nearby.loc.goodies.base');
    menu.back  = new GB.StreamButton('Back');
    menu.blank = $ui.createView({ width: $ui.FILL, height: '6dp'})
    header.left = gb.style.get('nearby.loc.header.left');
    header.right = gb.style.get('nearby.loc.header.right');
    points.amount = gb.style.get('nearby.loc.header.points.amount');
    points.text = gb.style.get('nearby.loc.header.points.text');
    goodies.err = gb.style.get('nearby.loc.goodies.error');
   
    menu.back.addEventListener('click', function (e) {
      menu.back.activate();
      if (modal) modal.close();
      $el.place.setVisible(false);
      $this.self.remove($el.place);
      $el.place.close();
      $el.holder.setVisible(true);
      $el.menu.base.setVisible(true);
    });
    
    gb.utils.compound(
      [ menu, menu.blank, menu.back.base ], 
      [ header, header.left, header.right ], 
      [ header.right,
        
        gb.style.get('nearby.loc.header.sideLabel nearby.loc.header.details', {
          text: place.getAddress().replace(/,\s/, "\n")
        }),
        
        gb.style.get('nearby.loc.header.sideLabel nearby.loc.header.number', {
          text: place.getNumber()
        }),
        
        gb.style.get('nearby.loc.header.sideLabel nearby.loc.header.url', {
          text: place.parent.getUrl(),
          events: {
            click: function (e) {
              var webview = $ui.createWebView({ url: place.parent.getUrl() });
              modal.setLeftNavButton(modal.back);
              modal.add(webview);
              modal.open(gb.style.get('nearby.loc.modal'));
            }
          }
        }),
        
        points
      ], 
      [ points, points.amount, points.text ],
      [ holder, 
      
        gb.style.get('nearby.loc.header.sideLabel nearby.loc.header.name', {
          text: place.parent.getName()
        }),
        
        header,
        gb.style.get('nearby.loc.goody.spacer'),
        goodies
      ], 
      [ $el.place, menu, holder ]
    );
    
    place.parent.getPointsEarned(gb.consumer.getCode(), function (data) {
      if (data == null) return;
      points.amount.text = data;
      points.text.text = 'karma points';
    });
    
    place.parent.getGoodies(function (data) {
      if (data == null) return goodies.add(goodies.err);
      for (var i = 0; i < data.length; i++) {
        var goody = data[i];
        if (!goody.active) continue;
        var place = gb.style.get('nearby.loc.goody.base');
        
        place.desc = gb.style.get('nearby.loc.goody.label', {
          text: goody.name
        });
        
        place.icon = gb.style.get('nearby.loc.goody.icon', {
          text: goody.karmaPointsRequired
        });
        
        if (i == data.length-1) place.bottom = 44;
        
        GB.utils.compound([
          place,
          place.icon,
          place.desc
        ],[
          goodies, place
        ]);
      }
    })

    place.parent.getImage(128, function (data) {
      var logo = gb.style.get('nearby.loc.header.image');
      logo.image = data;
      header.left.add(logo);

      $el.holder.setVisible(false);
      $el.menu.base.setVisible(false);
      $el.place.show();
      $this.self.add($el.place);
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
        latitude: 30.266703,
        longitude: -97.73798,
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
  
  /**
   * Comparator for sorting. Sort by name, alphabetically.
   * 
   * @param  {Object} a
   * @param  {Object} b
   * @return {Integer}
   */
  compareLocations: function (a, b) {
    var e = a.getPosition(), f = b.getPosition();
    if (!e.lat && !e.lon) return 1;
    if (!f.lat && !f.lon) return -1;
    var c = a.getDistanceFrom(this.position), d = b.getDistanceFrom(this.position);
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