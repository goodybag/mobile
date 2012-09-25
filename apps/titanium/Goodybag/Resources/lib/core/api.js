(function(){
  var
    api   = gb.api    = gb.api    || {}
  , store = api.store = api.store || {}
  , getCleanName = function(name, options){
      return "api-" + name + "-offset-" + options.offset + "-limit-" + options.limit;
    }
  ;
  api.get = function(url, callback, silent){
    gb.utils.debug("[API GET] - " + url);
    $http.get(url, function(error, data){
      if (error) return gb.utils.debug(error);
      data = JSON.parse(data);
      if (data.error && !silent) gb.handleError(data.error);
      if (callback) callback(data.error, data.data);
    });
  };
  
  api.post = function(url, data, callback, silent){
    gb.utils.debug("[API POST] - " + url);
    if (typeof data === "function"){
      callback = data;
      data = {};
    }
    $http.post(url, data, function(error, data){
      if (error) return gb.utils.debug(error);
      data = JSON.parse(data);
      if (data.error && !silent) gb.handleError(data.error);
      if (callback) callback(data.error, data.data);
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
  api.consumer.facebookConnect = function(accessToken, callback){
    api.post(gb.config.api.facebookConnect, { accessToken: accessToken }, callback);
  };
  api.consumer.updateMedia = function(media, callback){
    api.post(gb.config.api.updateMedia, media, callback);
  };
  
  api.businesses = {}; store.businesses = {};
  api.businesses.list = function(options, callback, forceNew){
    if (typeof options === "function"){
      if (typeof callback === "boolean") forceNew = callback;
      callback = options;
      options = {};
    }
    options.isCharity = false;
    var params = gb.utils.paramParser(options), cleanName = getCleanName('businesses-list', options);
    
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
      file.deleteFile();
      file.write(JSON.stringify(data));
      return store.businesses[cleanName] = true;
    });
  };
  
  api.charities = {}; store.charities = {};
  api.charities.list = function(options, callback, forceNew){
    if (typeof options === "function"){
      if (typeof callback === "boolean") forceNew = callback;
      callback = options;
      options = {};
    }
    options.charity = 1;
    var params = gb.utils.paramParser(options), cleanName = getCleanName('charities-list', options);
    
    // Check the store
    if (!forceNew && store.charities[cleanName]){
      var file = $file.getFile($file.applicationDataDirectory, cleanName + '.json');
      return callback(null, JSON.parse(file.read()));
    }
    
    api.get(gb.config.api.charities + params, function(error, data){
      if (error) return callback(error);
      callback(null, data);
      // We've got good data, so let's update the store
      var file = $file.getFile($file.applicationDataDirectory, cleanName + '.json');
      file.deleteFile();
      file.write(JSON.stringify(data));
      return store.charities[cleanName] = true;
    });
  };
  api.charities.select = function(id, callback){
    api.post(gb.config.api.selectCharity + id, function(error, data){
      if (error) return callback(error);
      callback(null, data);
    });
  };
  
  api.stream = {}; store.stream = {};
  api.stream.global = function(options, callback, forceNew){
    if (typeof options === "function"){
      if (typeof callback === "boolean") forceNew = callback;
      callback = options;
      options = {};
    }
    var params = gb.utils.paramParser(options), cleanName = getCleanName("stream-global", options);
    
    // Check the store
    if (!forceNew && store.stream[cleanName]){
      gb.utils.debug("[API - Stream - Global] Retreiving data from file " + cleanName);
      var file = $file.getFile($file.applicationDataDirectory, cleanName + '.json');
      return callback(null, JSON.parse(file.read()));
    }
    gb.utils.debug("[API - Stream - Global] Retreiving data from server");
    api.get(gb.config.api.stream.global + params, function(error, data){
      if (error) return callback(error);
      callback(null, data);
      // We've got good data, so let's update the store
      var file = $file.getFile($file.applicationDataDirectory, cleanName + '.json');
      gb.utils.debug("[API - Stream - Global] Deleting previous cache file " + cleanName);
      file.deleteFile();
      gb.utils.debug("[API - Stream - Global] Writing new data to file");
      file.write(JSON.stringify(data));
      return store.stream[cleanName] = true;
    });
  };
  api.stream.my = function(options, callback, forceNew){
    if (typeof options === "function"){
      if (typeof callback === "boolean") forceNew = callback;
      callback = options;
      options = {};
    }
    var params = gb.utils.paramParser(options), cleanName = getCleanName("stream-my", options);
    
    // Check the store
    if (!forceNew && store.stream[cleanName]){
      var file = $file.getFile($file.applicationDataDirectory, cleanName + '.json');
      return callback(null, JSON.parse(file.read()));
    }
    
    api.get(gb.config.api.stream.my + params, function(error, data){
      if (error) return callback(error);
      callback(null, data);
      // We've got good data, so let's update the store
      var file = $file.getFile($file.applicationDataDirectory, cleanName + '.json');
      file.deleteFile();
      file.write(JSON.stringify(data));
      return store.stream[cleanName] = true;
    });
  };
  
  api.version = {};
  api.version.get = function(callback){
    api.get(gb.config.api.version, callback, true);
  };
})();
