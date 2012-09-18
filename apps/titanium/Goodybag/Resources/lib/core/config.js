/**
 * Configuration Settings
 * 
 * @param {Object} global outer self pointer
 * @param {Object} fb Titanium.Facebook pointer
 * @param {Object} storage Titanium.App.Properties pointer
 */
gb.config = function (global, fb, storage) {
  var self = this;
  
  // debugging modes
  this.debug = true;
  this.development = true;
  
  // Facebook
  fb.forceDialogAuth = false;
  fb.appid = '152282721508707';
  // fb.appid = '159340790837933';
  // fb.appid = this.development ? '159340790837933' : '152282721508707';
  fb.permissions = [
    'email',
    'user_birthday',
    'user_likes',
    'user_interests',
    'user_hometown',
    'user_location',
    'user_activities',
    'user_work_history',
    'user_education_history',
    'friends_location'
  ];
  
  // Geolocation Configuration
  this.geoEnabled = (Titanium.Geolocation.locationServicesEnabled === true);
  
  Titanium.Geolocation.purpose = "Nearby Businesses";
  Titanium.Geolocation.preferredProvider = "gps";
  Titanium.Geolocation.accuracy = Titanium.Geolocation.ACCURACY_BEST; // Accuracy
  Titanium.Geolocation.distanceFilter = 10; // Meters to fire event again
  
  // Api Domain
  var domain = (this.development ? 'local' : 'www') + '.goodybag.com';
      // domain = '192.168.1.6:3001';
      
  // Api URLS
  this.api = {};
  this.api.consumer = {};
  this.api.stream = {};
  this.api.auth               = 'http://' + domain + '/api/consumers/login';
  this.api.logout             = 'http://' + domain + '/api/consumers/logout';
  this.api.register           = 'http://' + domain + '/api/consumers/register';
  this.api.facebookAuth       = 'http://' + domain + '/api/consumers/fblogin';
  this.api.facebookConnect    = 'http://' + domain + '/api/consumers/facebook';
  this.api.participating      = 'http://' + domain + '/api/consumers/participatingBusinesses?limit=';
  this.api.consumer.self      = 'http://' + domain + '/api/consumers/session';
  this.api.consumer.profile   = 'http://' + domain + '/api/consumers/self';
  this.api.consumer.locations = 'http://' + domain + '/api/consumers/locationsByTapins';
  this.api.consumer.count     = 'http://' + domain + '/api/consumers/self/tapinCount';
  this.api.stream.my          = 'http://' + domain + '/api/consumers/me/stream';
  this.api.stream.global      = 'http://' + domain + '/api/consumers/streams';
  this.api.charities          = 'http://' + domain + '/api/consumers/businesses'
  this.api.selectCharity      = 'http://' + domain + '/api/consumers/self/charity/'
  this.api.setScreenName      = 'http://' + domain + '/api/consumers/updateScreenName/'
  this.api.setName            = 'http://' + domain + '/api/consumers/self/name'
  this.api.setBarcodeId       = 'http://' + domain + '/api/consumers/self/barcodeId'
  this.api.setPassword        = 'http://' + domain + '/api/consumers/self/password'
  this.api.setEmail           = 'http://' + domain + '/api/consumers/self/email'
  this.api.createBarcodeId    = 'http://' + domain + '/api/consumers/barcodes'
  this.api.updateMedia        = 'http://' + domain + '/api/consumers/self/media'
  
  // Secret passphrase for files.
  this.secret = 'G00D13B4GR0X!!';
  
  // Transloadit
  this.transloadit = {
    key: "5a93b0ae8fae41699bd720cb34e63623"
  , template_id: "dbdc34e64b9348c881351ea714fce75e"
  , notify_url: "http://biz.goodybag.com/hooks/transloadit"
  , upload_url: "http://api2.transloadit.com/assemblies"
  };
  
  // Loading
  this.loadingMessages = [
    'Let me think on this...'
  , 'Hold on a second'
  // , '"This is not fair" said the Russian guy who was given wrong directions to the fair'
  , 'Firing up hamster wheels'
  , 'Pre-heating the oven to 350'
  , 'Preparing things and stuff'
  , 'Waiting on our lawyers to get back with us...'
  , 'Hold up! Wait a minute...'
  , 'Containing Existential Buffer'
  , 'BRB'
  // , 'The apollo program took 10 years to put a man on the moon, give me a few seconds'
  , 'New hamster being loaded'
  , 'Deciding next message to display...'
  , 'Not Crashing...'
  , 'Hyper-activating Hamster'
  , 'Reticulating splines...'
  , 'One time I saw a loading screen. One time.'
  , 'Re-evaluating Bits...'
  , 'Emulating Progress'
  , 'Inserting Impedance into Circuitry.'
  ];
  
  // Refresh
  this.autoRefreshTime = 1000 * 60;
  
  return this;
}(
  this, 
  Titanium.Facebook, 
  Titanium.App.Properties
);
