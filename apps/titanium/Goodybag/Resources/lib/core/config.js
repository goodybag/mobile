/**
 * Configuration Settings
 * 
 * @param {Object} global outer self pointer
 * @param {Object} fb Titanium.Facebook pointer
 * @param {Object} storage Titanium.App.Properties pointer
 */
gb.config = function (global, fb, storage) {
  var self = this;
  
  // Facebook
  fb.forceDialogAuth = false;
  fb.appid = '152282721508707';
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
  
  // debugging modes
  this.debug = true;
  this.development = false;
  var domain = this.development ? 'local' : 'www';

  // Api URLS
  this.api = {};
  this.api.auth             = 'http://' + domain + '.goodybag.com/api/consumers/login';
  this.api.logout           = 'http://' + domain + '.goodybag.com/api/consumers/logout';
  this.api.register         = 'http://' + domain + '.goodybag.com/api/consumers/register';
  this.api.facebookAuth     = 'http://' + domain + '.goodybag.com/api/consumers/fblogin';
  this.api.participating    = 'http://' + domain + '.goodybag.com/api/consumers/participatingBusinesses?limit=';
  this.api.consumer = {};
  this.api.consumer.self    = 'http://' + domain + '.goodybag.com/api/consumers/session'
  this.api.stream = {};
  this.api.stream.me        = 'http://' + domain + '.goodybag.com/api/consumers/me/stream';
  this.api.stream.global    = 'http://' + domain + '.goodybag.com/api/consumers/streams';
  this.api.charities        = 'http://' + domain + '.goodybag.com/api/consumers/businesses?charity=1'
  this.api.selectCharity    = 'http://' + domain + '.goodybag.com/api/consumers/self/charity/'
  this.api.setScreenName    = 'http://' + domain + '.goodybag.com/api/consumers/updateScreenName/'
  this.api.setName          = 'http://' + domain + '.goodybag.com/api/consumers/self/name'
  this.api.setBarcodeId     = 'http://' + domain + '.goodybag.com/api/consumers/self/barcodeId'
  this.api.setPassword      = 'http://' + domain + '.goodybag.com/api/consumers/self/password'
  this.api.setEmail         = 'http://' + domain + '.goodybag.com/api/consumers/self/email'
  this.api.createBarcodeId  = 'http://' + domain + '.goodybag.com/api/consumers/barcodes'
  
  // Secret passphrase for files.
  this.secret = 'G00D13B4GR0X!!';
  
  // Transloadit
  this.transloadit = {
    key: "5a93b0ae8fae41699bd720cb34e63623"
  , template_id: "dbdc34e64b9348c881351ea714fce75e"
  , notify_url: "http://biz.goodybag.com/hooks/transloadit"
  , upload_url: "http://api2.transloadit.com/assemblies"
  };
  
  return this;
}(
  this, 
  Titanium.Facebook, 
  Titanium.App.Properties
);
