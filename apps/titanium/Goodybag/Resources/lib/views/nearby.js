
var $http = gb.utils.http
,   $file = Titanium.Filesystem;

GB.Views.add('nearby', {
  self: gb.style.get('nearby.self'),
  location: 'Nearby',
  locations: [],
  models: [],
  views: [],
  
  elements: {},
  
  position: {
    lat: 30.266703,
    lon: -97.73798
  },
  
  /**
   * Grab and store places location and initialize View.
   * @constructor
   */
  Constructor: function () {
    var $this = this, store = $file.getFile($file.applicationDataDirectory, 'places.json');
    
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
    
    this.fetch(function (error, results) {
      var i;
      
      for (i = 0; i < results.data.length; i++) {
        $this.models.push(new GB.Models.Place(results.data[i]));
      }

      $this['show' + $this.location]();
    }, true);
  },
  
  showNearby: function () {
    var $this = this, $el = this.elements, i, x, locations;
    if($el.places) $this.self.remove($el.places);
    $this.locations = [];
    for(i = 0; i < $this.models.length; i++) {
      locations = $this.models[i].getLocations();
      for(x = 0; x < locations.length; x++) {
        $this.locations.push(locations[x]);
      }
    }

    $el.places = gb.style.get('nearby.places');
    $this.self.add($el.places);
    
    $this.locations.sort(function (a, b) { 
      return $this.compareLocations.apply($this, [a, b]); 
    });
    
    for (i = 0; i < $this.locations.length; i++) {
      $el.places.add($this.locations[i].toRow(i%2, function (e) { 
        $this.onPlaceClick.apply($this, [ this ]); 
      }));
    }
    
    $this.location = 'Nearby';
  },
  
  showPlace: function (place, location) {
    var $this = this, $el = this.elements, $ui = Titanium.UI, $save = $this.self.children[0];
    var back;
    
    $this.self.remove($save);
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
    var $this = this, $el = this.elements, locations;
    
    $this.annotations = [];
    for (var i = 0; i < $this.models.length; i++) {
      locations = $this.models[i].getLocations();
      for(var x = 0; x < locations.length; x++) {
        $this.annotations.push(locations[x].toAnnotation());
      }
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
      annotations: $this.annotations
    });
    
    $this.self.add($el.map);
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