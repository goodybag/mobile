
var $http = gb.utils.http
,   $file = Titanium.Filesystem;

GB.Views.add('places', {
  self: Titanium.UI.createView({
    top: '55dp'
  }),
  
  models: [],
  views: [],
  
  elements: {
    places: Titanium.UI.createScrollView({
      layout: 'vertical'
    })
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
    var $this = this, $el = this.elements;
    
    this.fetch(function (error, results) {
      var places = [], row, i;
      
      $this.self.add($el.places);
      for (i = 0; i < results.data.length; i++) {
        places.push(new GB.Models.Place(results.data[i]));
      }

      places.sort($this.comparePlaces);
      
      for (i = 0; i < places.length; i++) {
        $el.places.add(places[i].toRow(i%2, $this.onClick));
      }
    }, true);
  },
  
  afterShow: function (context) {},
  
  /**
   * Called when a row is clicked.
   *
   * Determines which location has been chosen and opens a view 
   * with the location information.
   * 
   * @param  {Object} evnt Event Handler
   */
  onClick: function (evnt) {
    console.log('clicked on ' + this.getName());
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