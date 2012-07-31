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
      var url, written = true, $self = this;
  
      if (this.data.media) url = (size == 85) ? this.data.media.thumb : this.data.media.url;
      if (!url) url = 'http://goodybag-uploads.s3.amazonaws.com/businesses/' + this.data._id + '-' + size + '.png';
      
      if (!this.images['s' + size].exists()) {
        return url;
        
        $http.get.image(url, function (error, results) { 
          if($self.images['s' + size].write(results) === false) written = false;
        });
      } else {
        return this.images['s' + size].read();
      }
    },
  
    /**
     * Returns an array filled with Location Models.
     * 
     * @return {Array}
     * @method
     */
    getLocations: function () {
      return this.locations;
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
      var $row = this.row, $self = this;
  
      if(Object.prototype.toString.call(row).toLowerCase() !== '[object function]') {
        this.row = row;
      } else {
        callback = row;
        this.row = null;
      }
  
      if(!this.row) {
        this.row = $ui.createTableViewRow({
          color: 'black',
          borderColor: '#ece',
          background: 'white',
          hasChild: true,
          className: 'place'
        });
      }
      
      // Business Image
      this.row.add($ui.createImageView({
        image: this.getImage(85),
        left: 5,
        width: 45,
        height: 45,
        borderColor: '#fff',
        borderWidth: 3,
        borderRadius: 0
      }));
  
      // Label
      this.row.add($ui.createLabel({
        left: 60,
        text: this.getName(),
        color: '#888',
        font: {
          fontSize: 12,
          fontStyle: 'normal',
          fontWeight: 'bold'
        }
      }));
  
      this.row.addEventListener('click', function (e) {
        callback.apply($self, [ e ]);
      });
  
      return this.row;
    },
    
    /**
     * Creates new instance of Place, stores given data while creating instances 
     * of GB.Models#Location for later usage.
     * 
     * @param {Object} data raw data fetched from api.
     * @type {Object}
     * @constructor
     */
    Constructor: function (data) {
      var i;
  
      this.data = data;
      if (data.locations.length > 1)
        for (i = 0; i < data.locations; i++)
          this.locations.push(new GB.Models.Location(data.locations[i]));
  
      this.images.s85 = $file.getFile($file.applicationDataDirectory, 'places/' + data._id + '-85.png');
      this.images.s128 = $file.getFile($file.applicationDataDirectory, 'places/' + data._id + '-128.png');
  
      return this;
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
      this.address = obj.street1 + ", " + obj.city + ", " + obj.state.toUpperCase() + " "  + obj.zip;
  
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