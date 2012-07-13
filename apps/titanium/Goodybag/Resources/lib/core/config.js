/**
 * Configuration Settings
 * 
 * @param {Object} global outer self pointer
 * @param {Object} fb Titanium.Facebook pointer
 * @param {Object} storage Titanium.App.Properties pointer
 */
gb.config = function (global, fb, storage) {
  var self = this;
  
  // debugging mode
  this.debug = true;
  
  // Facebook
  this.facebook = {};
  this.facebook.appid = '159340790837933';
  this.facebook.permissions = [
    'email'
  , 'user_birthday'
  , 'user_likes'
  , 'user_interests'
  , 'user_hometown'
  , 'user_location'
  , 'user_activities'
  , 'user_work_history'
  , 'user_education_history'
  , 'friends_location'
  ];
  
  // Authentication
  this.auth = storage.getBool('authenticated', false);
  this.authMethod = storage.getString('authMethod', "");
  
  return this;
}(
  this, 
  Titanium.Facebook, 
  Titanium.App.Properties
);
