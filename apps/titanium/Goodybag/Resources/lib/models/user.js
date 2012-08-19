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
  GB.Models.User = new Class({
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
     * @TODO   Check for charity and show page if missing.
     * @TODO   Check for QRCode and generate one if missing.
     */
    auth: function (callback) {
      var self = this;
      
      if (this.authenticated) {
        gb.utils.debug('[User] already authenticated, exiting.');
        callback(null, self);
        return;
      }
      
      if (this.email === "" || this.password === "") {
        callback('No email / password given.');
        return;
      }
      
      gb.utils.debug('[User] Creating http post request.');
      
      $http.post(gb.config.api.auth, {
        email: this.email,
        password: this.password
      }, function (error, json) {
        var cookie, segments;
        
        gb.utils.debug('[User] Got back results.');
        
        if (error) {
          callback(JSON.parse(error).message);
        } else {
          var consumer = JSON.parse(json);
          
          gb.utils.debug('[User] Got back the consumer object.');
          
          if (consumer.error) {
            callback(consumer.error.message);
            return;
          }
          
          gb.utils.debug('[User] No consumer errors, attempting to parse cookies and setup files.');
          
          // Grab Cookies and store session
          cookie = gb.utils.parsers.cookie.parser(this.getResponseHeader('Set-Cookie'));
          self._setSession(cookie.get('connect.sid'));
          
          // Store here
          self.authenticated = true;
          gb.utils.debug('[User] Creating consumer file with encrypted data.');
          
          // Store Consumer
          self._setConsumer(consumer);
          self.data.authMethod = GB.Models.User.Methods.EMAIL;
          
          // Setup Avatars
          self._setAvatar();
          
          gb.utils.debug('[User] Success, returning to callback.');
          
          // Cleanup
          cookie = null;
          
          // Callback
          callback(null, self);
        }
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
        if (error) return callback(JSON.parse(error).message);
        var consumer = JSON.parse(json);
          
        gb.utils.debug('[User] Got back the data object.');
        
        if (consumer.error) return callback(consumer.error);
        
        gb.utils.debug('[User] No errors, attempting to parse cookies and setup files.');
        
        // Grab Cookies and store session
        cookie = gb.utils.parsers.cookie.parser(this.getResponseHeader('Set-Cookie'));
        self._setSession(cookie.get('connect.sid'));
        
        // Store here
        self.authenticated = true;
        gb.utils.debug('[User] Creating consumer file with encrypted data.');
        
        // Store Consumer
        self._setConsumer(consumer);
        self.data.authMethod = GB.Models.User.Methods.EMAIL;
        
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
     * @TODO   Check for alias and request data.
     * @TODO   Check for charity and show charity screen.
     * @TODO   Check for QRCode and generate one if missing.
     */
    facebookAuth: function (callback) {
      var self = this;
  
      if (this.authenticated) {
        gb.utils.debug('[User] already authenticated, exiting.');
        callback(null, self);
        return;
      }
    
      $http.post(gb.config.api.facebookAuth, {
        accessToken: $fb.getAccessToken()
      }, function (error, json) {
        if (error) {
          callback("Couldn't Connect to Goodybag Account.");
        } else {
          var consumer = JSON.parse(json);
          
          if (consumer.error) {
            callback(consumer.error.message); return;
          }
            
          // Grab Cookies, Store Session
          cookie = gb.utils.parsers.cookie.parser(this.getResponseHeader('Set-Cookie'));
          self._setSession(cookie.get('connect.sid'));
          
          // Store here
          self.authenticated = true;
          
          // Store Consumer
          self._setConsumer(consumer);
          self.data.authMethod = GB.Models.User.Methods.FACEBOOK;
          
          // Setup Avatars
          self._setAvatar();
          
          console.log(JSON.stringify(self));
          
          // Cleanup
          cookie = null;
          
          // Callback
          callback(null, self);
        }
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
        this.data.authMethod = this.data.authMethod;
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
      
      $http.get.sessioned(gb.config.api.consumer.self, this.session, function (error, results) {
        if (error) {
          gb.utils.warn(error.message);
        } else {
          cookie = gb.utils.parsers.cookie.parser(this.getResponseHeader('Set-Cookie'));
  
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
    logout: function () {
      if (this.data.authMethod == GB.Models.User.Methods.FACEBOOK)
        $fb.logout();
        
      var consumer = $file.getFile($file.applicationDataDirectory, "consumer");
      var cookie = $file.getFile($file.applicationDataDirectory, "cooks");
      
      if (consumer.exists()) consumer.deleteFile();
      if (cookie.exists()) cookie.deleteFile();
      if (self.avatars.s85 && self.avatars.s85.exists()) self.avatars.s85.deleteFile();
      if (self.avatars.s128 && self.avatars.s128.exists()) self.avatars.s128.deleteFile();
      
      consumer = cookie = null;
      return null;
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
    getAvatar: function (size, callback) {
      if (!this.data) return;
      // Hack for now to fix users with no media
      if (!this.data.media) return;
      var url = ((size == 85) ? this.data.media.thumb : this.data.media.url), written = true, $self = this;
      if (!url) url = 'http://goodybag-uploads.s3.amazonaws.com/consumers/' + this.data._id + '-' + size + '.png';
      
      if (!this.avatar['s' + size].exists()) {
        $http.get.image(url, function (error, results) { 
          if ($self.avatar['s' + size].write(results) === false) written = false;
          callback((written) ? $self.avatar['s' + size].read() : url);
        });
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
      return this.data.charity ? this.data.charity.id : null;
    },
  
    /**
     * Returns users selected charities name.
     * @return {[type]} [description]
     */
    getCharityName: function () {
      return (this.data.charity) ? this.data.charity.name : null;
    },
  
    /**
     * Returns whether the current user has chosen a charity or not.
     * @return {Boolean}
     */
    hasCharity: function () {
      return (this.data.charity) ? !!(this.data.charity.id) : null;
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
     * Sets the charity on the user object and the server
     * @return {null}
     */
    setCharity: function (charity, callback) {
      var $this = this;
      callback || (callback = function(){});
      $http.post(gb.config.api.selectCharity + charity.id, {}, function(error, data){
        if (error) return console.log(error);
        data = JSON.parse(data);
        if (data.error) return callback(data.error);
        $this.data.charity = {
          id: charity.id
        , name: charity.publicName
        };
        $this._setConsumer($this);
      });
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
        console.log('Could not write to cookie file.');
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
        console.log('Could not write to consumer file.');
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
  });
  
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