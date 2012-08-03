
var $http = gb.utils.http
,   $file = Titanium.Filesystem;

GB.Views.add('places', {
  self: Titanium.UI.createView({
    top: '55dp'
  }),
  
  location: 'Places',
  models: [],
  views: [],
  elements: {},
  
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
    var $this = this, $el = this.elements;
    
    this.fetch(function (error, results) {
      var i;
      
      for (i = 0; i < results.data.length; i++) {
        $this.models.push(new GB.Models.Place(results.data[i]));
      }
      
      $this.models.sort($this.comparePlaces);
      $this['show' + $this.location]();
    }, true);
  },
  
  afterShow: function (context) {},
  
  showPlaces: function () {
    var $this = this, $el = this.elements;
    
    $el.places = Titanium.UI.createScrollView({
      layout: 'vertical'
    });
    
    $this.self.add($el.places);
    
    for (i = 0; i < $this.models.length; i++) {
      $el.places.add($this.models[i].toRow(i%2, function (e) { $this.onPlaceClick.apply($this, [ this ]); }));
    }
    
    $this.location = 'places';
  },
  
  showPlace: function (place, location) {
    var $this = this, $el = this.elements, $ui = Titanium.UI, $save = $this.self.children[0];
    var back;
    
    $this.self.remove($save);
    $el.place = $ui.createScrollView();
    
    back = $ui.createLabel({
      left: '10dp',
      top: '10dp',
      text: 'Back',
      color: '#aaa',
      font: {
        fontSize: 14,
        fontStyle: 'normal',
        fontWeight: 'bold'
      }
    });
    
    back.addEventListener('click', function (e) {
      $this.self.remove($el.place);
      $this.self.add($save);
    });
    
    $el.place.add(back);
    place.getImage(128, function (data) {
      $el.place.add($ui.createImageView({
        image: data,
        top: '30dp',
        left: '10dp'
      }));
    });
    
    if(place.getLocationCount() < 2) {
      
    } else {
      
    }
    
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
    this.showPlace(place);
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
  comparePlaces: function (a, b) {
    if (a.data.publicName < b.data.publicName)
      return -1;

    if (a.data.publicName > b.data.publicName)
      return 1;

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