
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
    
    this.self.add(this.elements.holder);
    
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
    this.self.add($el.menu.base);
    this.self.add($el.holder);
    
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
    
    this.location = 'Nearby';
  },
  
  showPlace: function (place, location) {
    var $this = this
    ,   $el = this.elements
    ,   $save = $this.self.children
    ,   back;
    
    this.self.remove($save[0]);
    this.self.remove($save[1]);
    $el.place = $ui.createScrollView();
    
    $el.place.add(gb.style.get('nearby.location.buttons.back', {}, {
      $this: this,
      save: $save
    }));

    place.getImage(128, function (data) {
      var logo = gb.style.get('nearby.location.image');
      logo.image = data;
      $el.place.add(logo);
      logo = null;
    });
    
    $this.self.add($el.place);
  },
  
  showMap: function () {
    var $this = this
    ,   $el = this.elements
    ,   annotations = [];
    
    if ($el.map) $el.holder.remove($el.map);

    for (i = 0; i < this.locations.length; i++) {
      annotations.push(this.locations[i].toAnnotation(function () {}));
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
    this.showPlace(place.parent);
  },
  
  /**
   * Called whenever an annotation is clicked.
   * 
   * @param {Object} e Event Handler
   * @param {Object} parent Place Object for Pin Location
   */
  onPinClick: function (e, parent) {
    this.showPlace(parent, this);
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