!function ($global, $fb, $props, $file, $http) {
  if(!gb.models) gb.models = {};

  /**
   * Place Model
   *
   * Stores business object and gives quick typed methods for easy 
   * data management and image fetching capabilities.
   * 
   * @type {Class}
   */
  gb.models.Place = new Class({
    data: false,
    locations: [],

    Constructor: function (data) {
      var i;
      this.data = data;

      if (data.locations.length > 1)
        for (i = 0, i < data.locations; i++)
          this.locations.push(new gb.models.Location(data.locations[i]));

      this.images.s85 = $file.getFile($file.applicationDataDirectory, 'places/' + data._id + '-85.png');
      this.images.s128 = $file.getFile($file.applicationDataDirectory, 'places/' + data._id + '-128.png');

      return this;
    },

    /**
     * Results in the current place's object id.
     * 
     * @return {String} ObjectId
     */
    getId: function () {
      return this.data._id;
    },

    /**
     * Results in the current place's public name.
     * 
     * @return {String} place's public name.
     */
    getName: function () {
      return this.data.publicName;
    },

    /**
     * Returns back an array with the current place's business types.
     * 
     * @return {Array} list of current place's types
     */
    getTypes: function () {
      return this.data.type;
    },

    /**
     * Returns back the current place's website url.
     * 
     * @return {String} place's website location.
     */
    getUrl: function () {
      return this.data.url;
    },

    /**
     * Fetches or grabs the currently stored business image, 
     * if the image does not exist fetch and store the correct 
     * image size based on request and return image results 
     * through callback or return the image url on failure.
     * 
     * @param  {Integer}  size     Integer determining image size, 85 or 128 is accepted.
     * @param  {Function} callback Function to delegate error and results to.
     */
    getImage: function (size, callback) {
      if(!this.data) return;
      var url = ((size == 85) ? this.data.media.thumb : this.data.media.url), written = true, $self = this;

      if(!url) url = 'http://goodybag-uploads.s3.amazonaws.com/businesses/' + this.data._id + '-' + size + '.png';
      if(!this.images['s' + size].exists()) {
        $http.get.image(url, function (error, results) { 
          if($self.images['s' + size].write(results) === false) written = false;
          callback((written) ? $self.images['s' + size].read() : url);
        });
      }
    },

    /**
     * Returns an array filled with Location Models.
     * 
     * @return {Array} the place's locations in models.
     */
    getLocations: function () {
      return this.locations;
    },

    /**
     * Determines whether this place is the specified type or not.
     * 
     * @param  {String}  type Business type
     * @return {Boolean}
     */
    isType: function (type) {
      return !!(type.toLowerCase() in this.data.type);
    },
  });

  /**
   * Location Model
   *
   * Utilizes location object from places to give an easier 
   * way of accessing and formatting data for locations.
   * 
   * @type {Class}
   */
  gb.models.Location = new Class({
    id: false,
    name: false,
    address: false,
    position: false,
    number: false,
    fax: false,

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
}(
  this, 
  Titanium.Facebook, 
  Titanium.App.Properties,
  Titanium.Filesystem,
  gb.utils.http
);