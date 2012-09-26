if(!GB.Models) 
  GB.Models = {};

!function () {
  var $ui = Titanium.UI
  ,   $fb = Titanium.Facebook
  ,   $props = Titanium.App.Properties
  ,   $file = Titanium.Filesystem
  ,   $http = gb.utils.http;
  
  /**
   * User Model
   * 
   * Delegates all logic and data handling pertaining to a user. All Authentication, 
   * User-Data storage, Session handling, Data-Binding, and User Logic is handled through 
   * this model.
   * 
   * @type {Object}
   */
  GB.Models.User = new Class(gb.utils.extend({
    /**
     * Consumer Authentication Variable
     * Keeps track of basic authentication checks.
     * 
     * @type {Mixed}
     * @private
     */
    authenticated: false,
    
    /**
     * Consumer Email
     * 
     * @type {String}
     * @private
     */
    email: false,
  
    /**
     * Consumer Object Store
     * 
     * @type {Mixed}
     * @private
     */
    data: false,
  
    /**
     * Cookie key-store object for node sessions.
     * 
     * @type {Mixed}
     * @private
     */
    session: false,
  
    /**
     * Holds Avatar File Objects
     * 
     * @type {Object}
     * @private
     */
    avatar: {},
    
    /**
     * Constructor
     *
     * Ran when User model is initialized.
     * 
     * @param {String} email    quick email storage variable
     * @param {String} password quick password storage variable
     * @constructor
     */
    Constructor: function (email, password) {
      this.email = gb.utils.trim(email);
      this.password = gb.utils.trim(password);
    },
    
    /**
     * Email/Password Authentication Method
     *
     * Checks if user is previously authenticated, validates authentication data, 
     * polls against the server to validate credentials, returns errors or results 
     * through callback upon server reply.
     *
     * Upon successfull login, we create avatar files, user-data files encrypted with AES256, 
     * and session files to keep the users login persistant upon device restart, failure, or 
     * otherwise.
     * 
     * @param  {Function} callback returns the data or errors.
     */
    auth: function (callback, email, password, force) {
      var self = this;
      
      if (email) this.email = email;
      if (password) this.password = password;
      
      // Already authenticated.
      if (this.authenticated && !force) return callback(null, self);
      
      // Nothing to validate
      if (this.email === "" || this.password === "")
        return callback('No email / password given.');
      
      gb.utils.debug('[User] Creating http post request.');
      
      $http.post(gb.config.api.auth, {
        email: this.email,
        password: this.password
      }, function (error, json) {
        var cookie, segments;
        
        gb.utils.debug('[User] Got back results.');
        if (!error && !json) return callback('Invalid server response...');
        if (error) return callback(JSON.parse(error).message || "Invalid login credentials!");
          
        gb.utils.debug('[User] Got back the consumer object.');
        var consumer = JSON.parse(json);
        if (consumer.error) return callback(consumer.error.message);
        
        // We actually encountered invalid server response, tell the user that?
        if (consumer.data == null) return callback('Invalid login credentials!'); 
        
        gb.utils.debug('[User] No consumer errors, attempting to parse cookies and setup files.');
        
        // Grab Cookies and store session
        cookie = gb.utils.parsers.cookie.parser(this.getResponseHeader('Set-Cookie'));
        if (cookie.get('connect.sid') == null) gb.utils.debug('Session id is null, uh oh!');
        self._setSession(cookie.get('connect.sid'));
        
        // Store here
        self.authenticated = true;
        gb.utils.debug('[User] Creating consumer file with encrypted data.');
        
        // Store Consumer
        consumer.data.authMethod = GB.Models.User.Methods.EMAIL;
        self.data.authMethod = GB.Models.User.Methods.EMAIL;
        self._setConsumer(consumer);
        
        // Store Login Details in keychain under goodybag.
        // gb.key = keychain.createKeychainItem({ identifier: 'goodybag' });
        // gb.key.account = self.user;
        // gb.key.valueData = self.password;
        
        // Setup Avatars
        self._setAvatar();
        
        gb.utils.debug('[User] Success, returning to callback.');
        
        // Cleanup
        cookie = null;
        
        // Callback
        callback(null, self);
      });
    },
    
    /**
     * Register Via Email
     * 
     * @param {Object}    data Consumer data
     * @param {Function}  Callback when server responds
     */
    register: function (user, callback) {
      var self = this;
      
      gb.utils.debug('[User] Attempting to register.');
      
      $http.post(gb.config.api.register, user, function(error, json){
        if (!error && !json) return callback('Invalid server response...');
        if (error) return callback(JSON.parse(error).message);
        if (typeof json == 'undefined' || !json) return callback();
        
        var consumer = JSON.parse(json);
        
        gb.utils.debug('[User] Got back the data object.');
        
        if (consumer.error) return gb.handleError(error), callback(consumer.error);
        
        // We actually encountered invalid server response, tell the user that?
        if (consumer.data == null) return callback('Invalid Server Response, Try logging in.');
        
        gb.utils.debug('[User] No errors, attempting to parse cookies and setup files.');
        
        // Grab Cookies and store session
        cookie = gb.utils.parsers.cookie.parser(this.getResponseHeader('Set-Cookie'));
        if (cookie.get('connect.sid') == null) gb.utils.debug('Session id is null, uh oh!');
        self._setSession(cookie.get('connect.sid'));
        
        // Store here
        self.authenticated = true;
        gb.utils.debug('[User] Creating consumer file with encrypted data.');
        
        // Store Consumer
        consumer.data.authMethod = GB.Models.User.Methods.EMAIL;
        self.data.authMethod = GB.Models.User.Methods.EMAIL;
        self._setConsumer(consumer);
        
        // Setup Avatars
        self._setAvatar();
        
        gb.utils.debug('[User] Success, returning to callback.');
        
        // Cleanup
        cookie = null;
        
        // For new user specific state
        self.newlyRegistered = true;
        
        // Callback
        callback(null, self);
      });
    },
  
    /**
     * Facebook Authentication Method
     *
     * Checks if user is previously authenticated, validates authentication data, 
     * polls against facebook servers to authenticate credentials, then polls against our servers with 
     * facebook access token to verify credentials on our side, returns errors and results afterwords.
     *
     * Upon successfull login, we create avatar files, user-data files encrypted with AES256, 
     * and session files to keep the users login persistant upon device restart, failure, or 
     * otherwise.
     * 
     * @param  {Function} callback returns the data or errors.
     * @param  {Boolean} force forces authentication and revalidation
     * @TODO   Check for alias and request data.
     * @TODO   Check for charity and show charity screen.
     * @TODO   Check for QRCode and generate one if missing.
     */
    facebookAuth: function (callback, force) {
      var self = this;
  
      // Already authenticated.
      if (this.authenticated && !force) return callback(null, self);
      
      gb.utils.debug('[FB Auth] Sending Request');
      
      $http.post(gb.config.api.facebookAuth, {
        accessToken: $fb.getAccessToken()
      }, function (error, json) {
        if (!error && !json) return callback('Invalid server response...');
        if (error) return callback('Error occurred during facebook connection.');
        if (typeof json == 'undefined' || !json) return callback('Error during authentication, try again.');
        
        var consumer = JSON.parse(json);
        if (consumer.error) return callback(consumer.error.message);
        
        // We actually encountered invalid server response, tell the user that?
        if (consumer.data == null) return callback('Invalid login credentials!'); 
          
        // Grab Cookies, Store Session
        cookie = gb.utils.parsers.cookie.parser(this.getResponseHeader('Set-Cookie'));
        if (cookie.get('connect.sid') == null) gb.utils.debug('Session id is null, uh oh!');
        self._setSession(cookie.get('connect.sid'));
        
        // Store here
        self.authenticated = true;
        
        // Store Consumer
        consumer.data.authMethod = GB.Models.User.Methods.FACEBOOK;
        self.data.authMethod = GB.Models.User.Methods.FACEBOOK;
        self._setConsumer(consumer);
        
        // Setup Avatars
        self._setAvatar();
        
        // Cleanup
        cookie = null;
        
        // Callback
        callback(null, self);
      });
    },
    
    /**
     * Checks locally stored authentication data, if that data is 
     * credible and verified to be complete we then utilize the data 
     * to setup user-data.
     * 
     * @param  {Function} callback Returns `this` if valid, otherwise null.
     */
    validate: function (callback) {
      var data, cooks, consumer, consumerPt, cooksPt;
      
      // File Storage
      cooks = $file.getFile($file.applicationDataDirectory, 'cooks');
      consumer = $file.getFile($file.applicationDataDirectory, 'consumer');
  
      // Cookie Data
      if (cooks.exists()) {
        data = cooks.read();
        if(data && data.text) cooksPt = sjcl.decrypt(gb.config.secret, data.text);
      }
      
      // Consumer Data
      if (consumer.exists()) {
        data = consumer.read();
        if(data && data.text) consumerPt = sjcl.decrypt(gb.config.secret, data.text);
      }
    
      if (cooksPt != null && consumerPt != null && consumerPt[0] === "{") {
        this.data = JSON.parse(consumerPt);
        this.authenticated = true;
        this.session = new gb.utils.parsers.cookie.storage();
        this.session.set('connect.sid', cooksPt);
        this._setAvatar();
  
        callback(this);
      } else {
        callback();
      }
      
      // Cleanup
      cooks = consumer = data = null;
    },
    
    /**
     * Renew the current user session and update the current user object model.
     */
    renew: function () {
      var self = this, $dataMethod = this.data.authMethod;
      gb.utils.debug('[User] Renewing Session');
      
      // // Reauthenticate the user.
      // if ($dataMethod === GB.Models.User.Methods.FACEBOOK) {
        // this.facebookAuth(function (error, consumer) {
          // if (error) gb.utils.warn(error);
        // }, true);
      // } else {
        // if (!gb.key) gb.key = keychain.createKeychainItem('goodybag');
//         
        // if (gb.key && gb.key.account && gb.key.valueData) {
          // this.auth(function (error, consumer) {
            // if (error) gb.utils.warn(error);
          // }, gb.key.account, gb.key.valueData, true);
        // }
      // }
      
      $http.get.sessioned(gb.config.api.consumer.self, this.session, function (error, results) {
        if (error) {
          gb.utils.warn('[User] Session Error: ' + error);
          
          gb.handleError(error)
          
          // Logout and show login screen:
          self.logout();
          GB.Windows.show('login');
        } else {
          if (results.error) return gb.handleError(results.error);
          
          gb.utils.debug('[User] Obtained new session data');
          cookie = gb.utils.parsers.cookie.parser(this.getResponseHeader('Set-Cookie'));
          
          console.log(this.getResponseHeader('Set-Cookie'));
          console.log(cookie.get('connect.sid'));
  
          // Update session and consumer
          self._setSession(cookie.get('connect.sid'));
          self._setConsumer(JSON.parse(results));
          self.data.authMethod = $dataMethod;
          self.authenticated = true;
          
          // Clean Garbage.
          cookie = null;
        }
      });
    },
    
    /**
     * Removes the currently stored user data, sessions, and user-files. 
     * Also checks against facebook to determine if we need to log them out of 
     * that as well.
     * 
     * @return {Null}
     */
    logout: function (callback) {
      if (this.data.authMethod == GB.Models.User.Methods.FACEBOOK)
        $fb.logout();
        
      var consumer = $file.getFile($file.applicationDataDirectory, "consumer");
      var cookie = $file.getFile($file.applicationDataDirectory, "cooks");
      
      if (consumer.exists()) consumer.deleteFile();
      if (cookie.exists()) cookie.deleteFile();
      if (this.avatar.s85 && this.avatar.s85.exists()) this.avatar.s85.deleteFile();
      if (this.avatar.s128 && this.avatar.s128.exists()) this.avatar.s128.deleteFile();
      
      consumer = cookie = null;

      this.authenticated = false;
      
      $http.get(gb.config.api.logout, function(error){
        if (error) alert(error);
        if (callback) callback();
      });
      
      return null;
    },
    
    /**
     * Return physical street based location, based on coordinates.
     */
    getPosition: function (callback) {
      var $this = this;
      
      Titanium.Geolocation.purpose = 'Get Current Location';
      Titanium.Geolocation.getCurrentPosition(function(e) {
        var coords = e.coords;
        
        Titanium.Geolocation.reverseGeocoder(coords.latitude, coords.longitude, function (e) {
          callback.apply($this, [ e ]);
        });
      });
    },
    
    /**
     * Get Profile through API Calls
     */
    getProfile: function (callback) {
      var profile = this.data.profile || null, $this = this, $data = this.data;
      
      $http.get.sessioned(gb.config.api.consumer.profile, this.session, function (error, results) {
        if (error) return gb.handleError(error), callback(profile); else results = JSON.parse(results);
        if (results.error) return callback(profile); else $data.profile = results.data;
        callback($data.profile);
        $this._setConsumer($data);
      });
    },
    
    /**
     * Returns locations based on amount of tapins over time.
     */
    getLocationsByTapins: function (callback) {
      var locations = this.data.locations || null, $this = this, $data = this.data;
      
      $http.get.sessioned(gb.config.api.consumer.locations, this.session, function (error, results) {
        if (typeof error === 'undefined' && typeof results === 'undefined') {
          return callback(locations); // No Data, use old
        } else if (error) {
          gb.utils.debug(error);
          return gb.handleError(error), callback(locations);
        } else {
          results = JSON.parse(results);
        }
        
        if (results.error) {
          gb.utils.debug(results.error);
          return callback(locations); 
        } else {
          $data.locations = results.data;
        }
        
        callback($data.locations);
        $this._setConsumer($data);
      });
    },
    
    /**
     * Returns total tapin count
     */
    getTapinCount: function (callback) {
      var count = this.data.tapinCount || null, $this = this, $data = this.data;
      
      $http.get.sessioned(gb.config.api.consumer.count, this.session, function (error, results) {
        if (typeof error === 'undefined' && typeof results === 'undefined') {
          return callback(count); // No Data, use old
        } else if (error) {
           return gb.handleError(error), callback(error);
        } else { 
          results = JSON.parse(results);
        }
        
        if (results.error) { 
          return callback(count); // Error obtained, use old data.
        } else {
          $data.tapinCount = results.data;
        }
        
        callback($data.tapinCount);
        $this._setConsumer($data);
      });
    },
    
    /**
     * Determines whether the user is authenticated
     * @return {Boolean}
     */
    isAuthenticated: function () {
      return this.authenticated;
    },
    
    /**
     * Fetches or grabs the currently stored avatar image.
     * 
     * If the image does not exist fetch and store the correct image size based on request and return 
     * image results through callback or return the image url on failure.
     * 
     * @param  {Integer}  size     Integer determining image size, 85 or 128 is accepted.
     * @param  {Function} callback Function to delegate error and results to.
     */
    getAvatar: function (size, forceNew, callback) {
      if (typeof forceNew === "function"){
        callback = forceNew;
        forceNew = false;
      }
      var defaultAvatar = 'https://s3.amazonaws.com/goodybag-uploads/consumers/000000000000000000000000-' + size + '.png';
      if (!this.data) return callback();
      // Hack for now to fix users with no media
      if (!this.data.media) return callback(defaultAvatar);
      // We really don't need to be using the media object apparently
      var url/* = ((size == 85) ? this.data.media.thumb : this.data.media.url)*/, written = true, $self = this;
      /*if (!url) */url = 'http://goodybag-uploads.s3.amazonaws.com/consumers/' + this.data._id + '-' + size + '.png';
      if (!this.avatar['s' + size].exists() || forceNew) {
        $http.get.image(url, function (error, results) { 
          if (error) return gb.handleError(error), callback(defaultAvatar);
          if ($self.avatar['s' + size].write(results) === false) written = false;
          callback((written) ? $self.avatar['s' + size].read() : url);
        });
      } else {
        callback(this.avatar['s' + size].read());
      }
    },
    
    /**
     * Returns the users first and last name joined together by a space.
     * @return {String}
     */
    getName: function () {
      return this.data.firstName + " " + this.data.lastName;
    },
    
    /**
     * Returns user alias or full name depending if alias is missing.
     * @return {String}
     */
    getUsername: function () {
      return (this.data.screenName) ? this.data.screenName : this.getName();
    },
    
    /**
     * Returns user email address.
     * @return {String}
     */
    getEmail: function () {
      return this.data.email;
    },
    
    getJoinDate: function () {
      return this.data.created ? new Date(this.data.created) : null;
    },
    
    /**
     * Returns users tapin-code.
     *
     * In the future this will probably be the NFC Tag Id.
     * Currently this is the barcodeId.
     * 
     * @return {String}
     */
    getCode: function () {
      return this.data.barcodeId;
    },
    
    /**
     * Returns users selected charity id.
     * @return {String}
     */
    getCharityId: function () {
      return (this.data.charity) ? this.data.charity.id : null;
    },
    
    getBarcodeID: function () {
      return this.data.barcodeId;
    },
  
    /**
     * Returns users selected charities name.
     * @return {[type]} [description]
     */
    getCharityName: function () {
      return (this.data.charity) ? this.data.charity.name : null;
    },
    
    /**
     * Returns total accumulated amount the user has donated to charity.
     */
    getTotalDonated: function () {
      if (!this.data.funds) return 0;
      if (!this.data.funds.donated) return 0;
      var donated = parseInt(this.data.funds.donated);
      return Math.round(donated*100)/100;
    },
    
    /**
     * Returns Geolocation
     */
    getGeolocation: function (callback) {
      var $this = this;
      
      if (!gb.config.geoEnabled) callback();
      else if (!this.location) Titanium.Geolocation.distanceFilter = 10, // required
      Titanium.Geolocation.getCurrentPosition(function (e) {
        $this.location = e.coords;
        callback(e.coords)
      });
      else callback(this.location);
    },
  
    /**
     * Returns whether the current user has chosen a charity or not.
     * @return {Boolean}
     */
    hasCharity: function () {
      return !!(this.data.charity && this.data.charity.id);
    },
    
    /**
     * Returns whether or not the current user has linked facebook to their account in 
     * some way.
     * 
     * @return {Boolean}
     */
    isFacebookLinked: function () {
      return !!this.data.tapinsToFacebook;
    },
    
    /**
     * Returns whether or not the current user is a goodybag admin.
     * @return {Boolean}
     */
    isAdmin: function () {
      return !!this.data.gbAdmin;
    },
  
    /**
     * Returns whether or not the current user authenticated through email.
     * @return {Boolean}
     */
    usedEmail: function () {
      return this.data.authMethod === GB.Models.User.Methods.EMAIL;
    },
  
    /**
     * Returns whether or not the current user authenticated through Facebook.
     * @return {Boolean}
     */
    usedFacebook: function () {
      return this.data.authMethod === GB.Models.User.Methods.FACEBOOK;
    },
    
    /**
     * Determines whether the user has completed registration
     * @return {Boolean}
     */
    hasCompletedRegistration: function(){
      return this.hasSetScreenName() && this.getBarcodeID();
    },
    
    /**
     * Determines whether the user has set their screen name
     * @return {Boolean}
     */
    hasSetScreenName: function(){
      return this.data.setScreenName;
    },
    
    /**
     * Sets the TapIn/Barcode ID
     * @return {null}
     */
    setBarcodeId: function (id, callback) {
      var $this = this;
      callback || (callback = function(){});
      $http.post(gb.config.api.setBarcodeId, { barcodeId: id }, function(error, data){
        if (error) return gb.handleError(error), console.log(error);
        data = JSON.parse(data);
        if (data.error) return gb.handleError(data.error), callback(data.error);
        $this.data.barcodeId = id;
        $this._setConsumer($this);
        callback(null, data.data);
      });
    },
    
    /**
     * Sets the Password
     * @return {null}
     */
    setPassword: function (password, newPassword, callback) {
      var $this = this;
      callback || (callback = function(){});
      $http.post(gb.config.api.setPassword, { password: password, newPassword: newPassword }, function(error, data){
        if (error) return gb.handleError(error), console.log(error);
        data = JSON.parse(data);
        if (data.error) gb.handleError(data.error);
        callback(data.error);
      });
    },
    
    /**
     * Creates and sets a barcode ID
     * @return {null}
     */
    createBarcodeId: function (callback) {
      var $this = this;
      callback || (callback = function(){});
      $http.get(gb.config.api.createBarcodeId, function(error, data){
        if (error) return gb.handleError(error), console.log(error);
        data = JSON.parse(data);
        if (data.error) return gb.handleError(data.error), callback(data.error);
        $this.data.barcodeId = data.data.barcodeId;
        $this._setConsumer($this);
        callback(null, data.data);
      });
    },
    
    /**
     * Sets the charity on the user object and the server
     * @return {null}
     */
    setCharity: function (charity, callback) {
      var $this = this;
      callback || (callback = function(){});
      gb.api.charities.select(charity.id, function(error, data){
        if (error) return gb.handleError(error), callback(error);
        $this.data.charity = {
          id:   charity.id
        , name: charity.publicName
        };
        $this._setConsumer($this);
        if (data.error) gb.handleError(data.error);
        callback(null, data);
      });
    },
    
    /**
     * Sets the screen name on the user object and the server
     * @return {null}
     */
    setScreenName: function (value, callback) {
      this.data.screenName = value;
      var $this = this;
      callback || (callback = function(){});
      $http.post(gb.config.api.setScreenName, { screenName: value }, function(error, data){
        if (error) return gb.handleError(error);
        data = JSON.parse(data);
        if (data.error) return gb.handleError(data.error), callback(data.error);
        $this.data.setScreenName = true;
        $this._setConsumer($this);
        callback(null, data.data);
      });
      this.trigger('change:screenName', value, this);
    },
    
    /**
     * Sets the name on the user object and the server
     * @return {null}
     */
    setName: function (values, callback) {
      this.data.firstName = values.firstName;
      this.data.lastName = values.lastName;
      var $this = this;
      callback || (callback = function(){});
      $http.post(gb.config.api.setName, values, function(error, data){
        if (error) return gb.handleError(error), console.log(error);
        data = JSON.parse(data);
        if (data.error) return gb.handleError(error), callback(data.error);
        $this._setConsumer($this);
        callback(null, data.data);
      });
      this.trigger('change:name', values, this);
    },
    
    /**
     * Sets the email on the user object and the server
     * @return {null}
     */
    setEmail: function (email, callback) {
      this.data.email = email
      var $this = this;
      callback || (callback = function(){});
      $http.post(gb.config.api.setEmail, { email: email }, function(error, data){
        if (error) return gb.handleError(error), console.log(error);
        data = JSON.parse(data);
        if (data.error) return gb.handleError(error), callback(data.error);
        $this._setConsumer($this);
        callback(null, data.data);
      });
      this.trigger('change:email', email, this);
    },
    
    /**
     * Uploads avatar and writes it to our app
     * We could probably re-factor this to not do 3 requests :/
     * 
     * @param {FileBlob} The file to upload
     * @param {Function} Called when the initial request is complete
     * @param {Function} Called when the onSendStream event is triggered
     */
    setAvatar: function (blob, callback, onProgress) {
      var $this = this, options = {
        media: blob
      , params: JSON.stringify({
          'auth': { 'key': gb.config.transloadit.key }
        , 'template_id': gb.config.transloadit.template_id
        , 'notify_url': gb.config.transloadit.notify_url
        , 'steps': {
            'export85': { "path": "consumers/" + this.data._id + "-85.png" }
          , 'export128': { "path": "consumers/" + this.data._id + "-128.png" }
          , 'export85Secure': { 'path': "consumers-secure/" + this.data.screenName + "-85.png" }
          , 'export128Secure': { 'path': "consumers-secure/" + this.data.screenName + "-128.png" }
          }
        })
      };
      // Write file once we know the server got it
      $http.post.generic(gb.config.transloadit.upload_url, options, function(error, response){
        if (error) return gb.handleError(error), console.log(error);
        // Just callback when the initial request is done
        response = JSON.parse(response);
        
        // Delete old files and write the new blob
        if (!$this.avatar) $this.avatar = {};
        if ($this.avatar.s85) $this.avatar.s85.deleteFile();
        else $this.avatar.s85 = $file.getFile($file.applicationDataDirectory, 'avatar-85.png');
        if ($this.avatar.s128) $this.avatar.s128.deleteFile();
        else $this.avatar.s128 = $file.getFile($file.applicationDataDirectory, 'avatar-128.png');

        // Write
        $this.avatar.s85.write(blob);
        $this.avatar.s128.write(blob);

        // Update the user media object 
        $this.data.media = {
          // use the blob instead of the url since it's already on disk
          url: blob
        , thumb: blob
        };
        
        // Update the user object on the server
        var data = {
          tempURL: response.uploads[0].url
        , rotateDegrees: 0
        , guid: gb.utils.guid()
        };
        gb.api.consumer.updateMedia(data, function(error, data){});
        
        $this._setConsumer($this);
        
        if (callback) callback();
      }, onProgress);
    },
    
    /**
     * Callback for Geolocation event, this will be fired repeatedly based on distance.
     */
    _setGeolocation: function (e) {
      if (!e.success || e.error) { gb.utils.debug(JSON.stringify(e.error)); return; }
      gb.consumer.location = e.coords;
    },
    
    /**
     * Updates the current session key-store, and the locally stored 
     * data. Encrypted in AES256.
     * 
     * @param {String} sessionId node connect session id
     * 
     * @see GB.Models.User#auth
     * @see GB.Models.User#facebookAuth
     * @see GB.Models.User#renew
     * @see GB.Models.User#validate
     * 
     * @private
     */
    _setSession: function (sessionId) {
      if (sessionId == null) return;
      
      if (this.session) {
        if (this.session.get('connect.sid') == sessionId)
          return;
        else {
          this.session.set('connect.sid', sessionId);
        }
      } else {
        this.session = new gb.utils.parsers.cookie.storage();
        this.session.set('connect.sid', sessionId);
      }
      
      var cookie = $file.getFile($file.applicationDataDirectory, "cooks");
      if (cookie.exists()) cookie.deleteFile();
      if (cookie.write(sjcl.encrypt(gb.config.secret, sessionId)) === false) {
        gb.utils.debug('Could not write to cookie file.');
      }
      
      cookie = null;
      
      return;
    },
    
    /**
     * Stores latest consumer object locally and encrypted with AES256.
     * 
     * @param {Object} obj Consumer Object
     * 
     * @see GB.Models.User#auth
     * @see GB.Models.User#facebookAuth
     * @see GB.Models.User#renew
     * @see GB.Models.User#validate
     * 
     * @private
     */
    _setConsumer: function (obj) {
      if (obj === null || obj.data === null) return;
      
      var consumer = $file.getFile($file.applicationDataDirectory, "consumer");
  
      this.data = obj.data;
      if (consumer.write(sjcl.encrypt(gb.config.secret, JSON.stringify(this.data))) === false) {
        gb.utils.debug('Could not write to consumer file.');
      }
      
      consumer = null;
      
      return;
    },
    
    /**
     * Removes any old avatar files and fetches the new ones.
     * 
     * @see GB.Models.User#auth
     * @see GB.Models.User#facebookAuth
     * @see GB.Models.User#renew
     * @see GB.Models.User#validate
     * 
     * @private
     */
    _setAvatar: function () {
      this.avatar.s85 = $file.getFile($file.applicationDataDirectory, 'avatar-85.png');
      this.avatar.s128 = $file.getFile($file.applicationDataDirectory, 'avatar-128.png');
      this.avatar.s85.deleteFile();
      this.avatar.s128.deleteFile();
      this.getAvatar(85, function () {});
      this.getAvatar(128, function () {});
    }
  }, gb.Events));
  
  /**
   * Authentication Method Enum
   * 
   * @type {Object}
   * 
   * @see GB.Models.User#auth
   * @see GB.Models.User#facebookAuth
   * @see GB.Models.User#logout
   * @see GB.Models.User#usedEmail
   * @see GB.Models.User#usedFacebook
   */
  GB.Models.User.Methods = {
    EMAIL: 1,
    FACEBOOK: 2
  };
}();