(function(){
  var
    gb        = gb || {}
  , api       = gb.api = gb.api || {}
  , store     = {}
  , paramReg  = /=|?|\&/g
  ;

  api.get = function(url, callback){
    $http.get(url, function(error, data){
      if (error) return gb.utils.debug(error);
      data = JSON.parse(data);
      callback(data.error, data.data);
    });
  };
  
  api.post = function(url, data, callback){
    $http.post(url, data, function(error, data){
      if (error) return gb.utils.debug(error);
      data = JSON.parse(data);
      callback(data.error, data.data);
    });
  };
  
  api.consumer = {};
  api.consumer.login = function(email, password, callback){
    var data;
    if (typeof email === "object"){
      data = email;
      callback = password;
    }else data = { email: email, password: password };
    api.post(gb.config.api.login, data, callback);
  };
  api.consumer.register = function(data, callback){
    api.post(gb.config.api.register, data, callback);
  };
  api.consumer.fbLogin = function(accessToken, callback){
    api.post(gb.config.api.facebookAuth, { accessToken: acessToken }, callback);
  };
  
  api.businesses = {}, store.businesses = {};
  api.businesses.list = function(options, callback, forceNew){
    if (typeof options === "function"){
      callback = options;
      options = {};
    }
    var params = utils.paramParser(options), cleanName = params.replace(paramReg, "");
    
    // Check the store
    if (!forceNew && store.businesses[cleanName]){
      var file = $file.getFile($file.applicationDataDirectory, cleanName + '.json');
      return callback(null, JSON.parse(file.read()));
    }
    
    api.get(gb.config.api.participating + params, function(error, data){
      if (error) return callback(error);
      callback(null, data);
      // We've got good data, so let's update the store
      var file = $file.getFile($file.applicationDataDirectory, cleanName + '.json');
      return file.write(JSON.stringify(data));
    });
  };
  
})();
