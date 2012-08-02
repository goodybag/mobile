
var $http = gb.utils.http
,   $file = Titanium.Filesystem;

GB.Views.add('places', {
  self: Titanium.UI.createView({
    top: '55dp'
  }),

  places: Titanium.UI.createScrollView({
    layout: 'vertical'
  }),
  
  elements: {
    table: Ti.UI.createTableView({
      backgroundColor: '#ffffff'
    , borderColor: '#eeeeee'
    , separatorColor: '#eeeeee'
    , color: 'black'
    , top: 0
    })
  },
  
  /**
   * Grab and store places location and initialize View.
   * @constructor
   */
  Constructor: function () {
    var store = $file.getFile($file.applicationDataDirectory, 'places.json');
    
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
    
    this.self.add(this.places);
    
    this.fetch(function (error, results) {
      var places = [], sections = {}, place, first, current, section, row, i, iv;
      
      $this.data = [];
      gb.utils.debug('starting conversion to places');
      
      for (i = 0; i < results.data.length; i++) {
        gb.utils.debug('converting item: ' + i + ' of ' + results.data.length);
        places.push(new GB.Models.Place(results.data[i]));
      }

      places.sort($this.comparePlaces);

      for (i = 0; i < places.length; i++) {
        gb.utils.debug('creating rows: ' + i + ' of ' + places.length);
        places[i].getImage(85, function () {});
        row = places[i].toRow(function (e) {
          $this.onClick.apply(this, [ e ]);
        });

        if (gb.isAndroid) {
          iv = Titanium.UI.createImageView({
            left: 5,
            width: 45,
            height: 45,
            borderColor: '#fff',
            borderWidth: 3,
            borderRadius: 0
          });
          
          row.model.getImage(85, function (data) {
            console.log('got image data: ' + data);
            iv.setImage(data);
          });
          
          row.add(iv);
        }

        $this.places.add(row);
      }

      results = null;
      error = null;
    }, true);
  },
  
  afterShow: function (context) {
    var iv, children = this.places.children;
    
    for(i = 0; i < children.length; i++) {
      iv = Titanium.UI.createImageView({
        left: 5,
        width: 45,
        height: 45,
        borderColor: '#fff',
        borderWidth: 3,
        borderRadius: 0
      });
      
      children[i].model.getImage(85, function (data) {
        console.log('got image data: ' + data);
        iv.setImage(data);
      });
      
      children[i].add(iv);
    }
  },
  
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