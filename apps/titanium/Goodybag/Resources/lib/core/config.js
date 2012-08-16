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

  // Api URLS
  this.api = {};
  this.api.auth = 'http://' + (this.development ? 'local' : 'www') + '.goodybag.com/api/consumers/login';
  this.api.facebookAuth = 'http://' + (this.development ? 'local' : 'www') + '.goodybag.com/api/consumers/fblogin';
  this.api.participating = 'http://' + (this.development ? 'local' : 'www') + '.goodybag.com/api/consumers/participatingBusinesses?limit=';
  this.api.consumer = {};
  this.api.consumer.self = 'http://' + (this.development ? 'local' : 'www') + '.goodybag.com/api/consumers/session'
  this.api.stream = {};
  this.api.stream.me = 'http://' + (this.development ? 'local' : 'www') + '.goodybag.com/api/consumers/me/stream';
  this.api.stream.global = 'http://' + (this.development ? 'local' : 'www') + '.goodybag.com/api/consumers/streams';
  this.api.charities = 'http://' + (this.development ? 'local' : 'www') + '.goodybag.com/api/consumers/businesses?charity=1'
  this.api.selectCharity = 'http://' + (this.development ? 'local' : 'www') + '.goodybag.com/api/consumers/self/charity/'
  
  // Secret passphrase for files.
  this.secret = 'G00D13B4GR0X!!';
  
  return this;
}(
  this, 
  Titanium.Facebook, 
  Titanium.App.Properties
);
