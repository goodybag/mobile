if(!GB.Models) 
  GB.Models = {};

(function () {
  var $ui = Titanium.UI
  ,   $fb = Titanium.Facebook
  ,   $props = Titanium.App.Properties
  ,   $file = Titanium.Filesystem
  ,   $http = gb.utils.http;
  
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
  
    /**
     * Fetches or grabs the currently stored business image, if the image does not exist fetch and store the correct 
     * image size based on request and return image results through callback or return the image url on failure.
     * 
     * @param  {Integer}  size     Integer determining image size, 85 or 128 is accepted.
     * @param  {Function} callback Function to delegate error and results to.
     * @method
     */
    getImage: function (size, callback) {
      if(!this.data) return;
      var url, written = true, $self = this, image, dir = $file.getFile($file.applicationDataDirectory, 'places/');
      image = $file.getFile($file.applicationDataDirectory, 'places/' + this.data._id + '-' + size + '.png');
      if (!dir.exists()) dir.createDirectory(), dir = null;
      if (this.data.media) url = (size == 85) ? this.data.media.thumb : this.data.media.url;
      if (!url) url = 'http://goodybag-uploads.s3.amazonaws.com/businesses/' + this.data._id + '-' + size + '.png';
      if (!image.exists()) {
        $http.get.image(url, function (error, results) { 
          console.log(error);
          console.log('attempting to write: ' + image.write(results));
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
      var i;
      
      if (this.locations.length < 1 && this.data.locations.length > 1)
        for (i = 0; i < data.locations; i++)
          this.locations.push(new GB.Models.Location(this.data.locations[i]));
      
      return this.locations;
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
     * Converts this model down into a Titanium Table Row
     * 
     * @param {Object} row Titanium TableRow (Optional)
     * @param {Object} callback called when a user clicks on this row
     * @return {Object} Built Titanium TableRow
     * @method
     */
    toRow: function (row, callback) {
      var $self = this;
  
      if(Object.prototype.toString.call(row).toLowerCase() !== '[object function]') {
        row = row;
      } else {
        callback = row;
        row = null;
      }
  
      if(!row) {
        row = $ui.createView({
          color: 'black',
          borderColor: '#eceece',
          borderWidth: '0.5dp',
          background: 'white',
          height: 50
        });
      }
  
      // Label
      row.add($ui.createLabel({
        left: 60,
        text: this.data.publicName,
        color: '#888',
        font: {
          fontSize: 12,
          fontStyle: 'normal',
          fontWeight: 'bold'
        }
      }));
  
      row.addEventListener('click', function (e) {
        callback.apply($self, [ e ]);
      });
      
      row.model = this;
  
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
    id: false,
    name: false,
    address: false,
    position: false,
    number: false,
    fax: false,
  
    /**
     * Creates a new Location and takes given data and re-organizes it into 
     * a human readable format.
     * 
     * @type {Object}
     * @constructor
     */
    Constructor: function (obj) {
      this.id = obj._id;
      this.name = obj.name;
      this.address = [ obj.street1, obj.city, obj.state.toUpperCase() ].join(', ') + " " + obj.zip;
  
      this.position = {
        lat: obj.lat,
        lng: obj.lng
      };
  
      this.number = obj.phone;
      this.fax = obj.fax;
  
      return this;
    }
  });
})();