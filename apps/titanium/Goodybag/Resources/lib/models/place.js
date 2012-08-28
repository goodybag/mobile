if(!GB.Models) 
  GB.Models = {};

(function () {
  var $ui = Titanium.UI
  ,   $fb = Titanium.Facebook
  ,   $props = Titanium.App.Properties
  ,   $file = Titanium.Filesystem
  ,   $http = gb.utils.http
  ,   $haversine = gb.utils.haversine;
  
  /**
   * Place Model
   * 
   * Stores business object and gives quick typed methods for easy 
   * data management and image fetching capabilities.
   * 
   * @type {Object}
   */
  GB.Models.Place = new Class({
    data: false,
    
    /**
     * Location array
     * 
     * @see GB.Models.Place#Constructor
     * @see GB.Models.Place#
     */
    locations: [],
    
    /**
     * Place Logo Object
     * 
     * Holds logo file proxies, that upon parsing get fetched.
     */
    images: {},
    
    /**
     * Row variable that becomes used once #toRow is called.
     */
    row: null,

    /**
     * Creates new instance of Place, stores given data while creating instances 
     * of GB.Models#Location for later usage.
     * 
     * @param {Object} data raw data fetched from api.
     * @type {Object}
     * @constructor
     */
    Constructor: function (data) {
      this.data = data;
      
      return this;
    },
  
    /**
     * Results in the current place's object id.
     * 
     * @return {String} ObjectId
     * @memberOf GB.Models.Place
     */
    getId: function () {
      return this.data._id;
    },
  
    /**
     * Results in the current place's public name.
     * 
     * @return {String} place's public name.
     * @memberOf GB.Models.Place
     */
    getName: function () {
      return this.data.publicName;
    },
  
    /**
     * Returns back an array with the current place's business types.
     * 
     * @return {Array} list of current place's types
     * @method
     */
    getTypes: function () {
      return this.data.type;
    },
  
    /**
     * Returns back the current place's website url.
     * 
     * @return {String} place's website location.
     * @method
     */
    getUrl: function () {
      return this.data.url;
    },
    
    getGoodies: function (callback) {
      var url = "https://biz.goodybag.com/api/businesses/" + this.data._id + "/goodies";
      $http.get(url, function (error, results) {
        if (error || !results) return callback(null);
        results = JSON.parse(results);
        if(results.data && results.data.length > 0)
          return callback(results.data);
        return callback(null);
      });
    },
    
    getPointsEarned: function (barcode, callback) {
      var url = "https://biz.goodybag.com/api/businesses/"+ this.data._id +"/barcodes/" + barcode + "/statistics/karmaPoints";
      $http.get(url, function (error, results) {
        if (error) return callback(null);
        results = JSON.parse(results).data;
        if (!results.data) return callback(0);
        results = results.data;
        return callback(results.karmaPoints.earned);
      });
    },
  
    /**
     * Fetches or grabs the currently stored business image, if the image does not exist fetch and store the correct 
     * image size based on request and return image results through callback or return the image url on failure.
     * 
     * @param  {Integer}  size     Integer determining image size, 85 or 128 is accepted.
     * @param  {Function} callback Function to delegate error and results to.
     * @method
     */
    getImage: function (size, callback) {
      if (!this.data) return;
      var url, written = true, $self = this, image, dir = $file.getFile($file.applicationDataDirectory, 'places/');
      image = $file.getFile($file.applicationDataDirectory, 'places/' + this.data._id + '-' + size + '.png');
      
      if (!dir.exists()) dir.createDirectory(), dir = null;
      if (this.data.media) url = (size == 85) ? this.data.media.thumb : this.data.media.url;
      if (!url) url = 'http://goodybag-uploads.s3.amazonaws.com/businesses/' + this.data._id + '-' + size + '.png';
      
      if (!image.exists()) {
        $http.get.image(url, function (error, results) { 
          gb.utils.debug(error);
          gb.utils.debug('attempting to write: ' + image.write(results));
          callback(image.read());
        });
      } else {
        callback(image.read());
        image = null;
      }
    },
  
    /**
     * Returns an array filled with Location Models.
     * 
     * @return {Array}
     * @method
     */
    getLocations: function () {
      var locations = [], locs = this.data.locations, length = locs.length;
      
      if (this.locations.length < 1) {
        for (var i = 0; i < length; i++) {
          locations.push(new GB.Models.Location(locs[i], this));
        }
      } else locations = this.locations;
        
      this.locations = locations;
      return locations;
    },
    
    /**
     * Returns the amount of locations that exist for this place.
     * 
     * @return {Integer}
     */
    getLocationCount: function () {
      return this.data.locations.length;
    },
    
    /**
     * Determines whether this place is the specified type or not.
     * 
     * @param  {String}  type Business type
     * @return {Boolean}
     * @method
     */
    isType: function (type) {
      return !!(type.toLowerCase() in this.data.type);
    },
  
    /**
     * Converts this model down into a Titanium Row
     * 
     * Seperated View Logic, this can be utilized in areas outside of a specific view.
     * 
     * @param {Boolean} row Titanium TableRow (Optional)
     * @param {Object} callback called when a user clicks on this row
     * @return {Object} Built Titanium TableRow
     * @method
     */
    toRow: function (border, callback) {
      var $self = this;

      var row = gb.style.get('nearby.place.row.view', {
        borderWidth: border ? 1 : 0
      });
  
      // Label
      row.add(gb.style.get('nearby.place.row.name', {
        text: this.data.publicName,
      }));
      
      if (this.data.locations.length > 1) {
        row.add(gb.style.get('nearby.place.row.locations', {
          text: this.data.locations.length + ' locations'
        }));
      }
  
      row.addEventListener('click', function (e) {
        callback.apply($self, [ e ]);
      });
  
      return row;
    }
  });

  /**
   * Location Model
   *
   * Utilizes location object from places to give an easier way of 
   * accessing and formatting data for locations.
   * 
   * @type {Object}
   */
  GB.Models.Location = new Class({
    data: false,
    parent: false,
  
    /**
     * Creates a new Location and takes given data and re-organizes it into 
     * a human readable format.
     * 
     * @type {Object}
     * @constructor
     */
    Constructor: function (obj, parent) {
      this.data = obj;
      this.parent = parent;
      
      return this;
    },
    
    /**
     * Get location Object Id
     */
    getId: function () {
      return this.data.id;
    },
    
    /**
     * Get location name
     */
    getName: function () {
      return this.data.name;
    },
    
    /**
     * Get location address
     */
    getAddress: function () {
      return [ 
        this.data.street1, 
        this.data.city, 
        this.data.state.toUpperCase() 
      ].join(', ') + ' ' + this.data.zip;
    },
    
    /**
     * Get location position
     */
    getPosition: function () {
      return {
        lat: this.data.lat,
        lon: this.data.lng || this.data.lon
      };
    },
    
    /**
     * Return miles from position given.
     * Haversine distance.
     *              
     * @param {Object} position Latitude and Longitude of questioned position.
     * @return {Integer}
     * @see gb.utils#haversine
     */
    getDistanceFrom: function (pos) {
      this.data.distance = $haversine(pos, this.getPosition());
      return this.data.distance;
    },
    
    /**
     * Get location number
     */
    getNumber: function () {
      return this.data.phone;
    },
    
    /**
     * Get location fax
     */
    getFax: function () {
      return this.data.fax;
    },
    
    /**
     * Converts this model down into a Titanium Row
     * 
     * Seperated View Logic, this can be utilized in areas outside of a specific view.
     * 
     * @param {Boolean} row Titanium TableRow (Optional)
     * @param {Object} callback called when a user clicks on this row
     * @return {Object} Built Titanium TableRow
     * @method
     */
    toRow: function (border, callback) {
      var $self = this, row;

      row = gb.style.get('nearby.location.row.view', {
        borderWidth: border ? 1 : 0
      });
  
      // Label
      row.add(gb.style.get('nearby.location.row.name', {
        text: this.parent.data.publicName
      }));
      
      if (this.data.distance) {
        row.add(gb.style.get('nearby.location.row.distance', {
          text: this.data.distance + " miles"
        }));
      }
  
      row.addEventListener('click', function (e) {
        callback.apply($self, [ e ]);
      });
  
      return row;
    },
    
    /**
     * Creates and returns annotation for map views.
     * 
     * Separated View logic that can be utilized anywhere a map is needed.
     *  
     * @param {Object} onClick
     */
    toAnnotation: function (onClick) {
      var $this = this;
      
      var pin = Titanium.Map.createAnnotation({
        latitude: this.data.lat,
        longitude: this.data.lng,
        title: this.data.name,
        subtitle: this.getAddress(),
        animate: true,
        pincolor: Ti.Map.ANNOTATION_RED
      });
      
      pin.addEventListener('click', function (e) { 
        onClick.call($this, e);
      });
      
      return pin;
    }
  });
})();