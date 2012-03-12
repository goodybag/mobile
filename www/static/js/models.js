(function(){
  this.app = window.app || {};
  this.app.Models = window.app.Models || {};
  var models = {};

  models.Auth = Backbone.Model.extend({
    defaults: {

    },
    intialize: function(){
      _.extend(this, Backbone.Events);
    },
    emailLogin: function(callback){
      var self = this;
      var creds = {
        email: this.get('email'),
        password: this.get('password')
      };
      api.auth.login(creds, function(error, data){
        if (utils.exists(error)){
          self.trigger('login:failure');
        }else{
          self.setSession(data);
          self.trigger('login:success');
        }
      });
    },
    facebookLogin: function(callback){
      var self = this;
      console.log("Attempting to login with facebook");
      FB.login(function(response) {
        if (response.session) {
          console.log("LOGGED IN");
          console.log(JSON.stringify(response));
          var accessToken = response.session.access_token;
          console.log(accessToken);
          FB.api('/me', function(response) {
            api.auth.facebook(accessToken,function(error,consumer){
              if(utils.exists(error)){
                alert(error.message);
                return;
              } else {
                console.log("logged in to goodybag");
                self.updateSession(callback)

                /*api.auth.session(function(error, data){
                  if (error != null){
                    console.error(error);
                    return;
                  }
                  storage.barcodeId = data.barcodeId;
                  $("#qrcode").qrcode({text:storage.barcodeId, render:"table", width:200, height:200 });
                  document.location.href = "#barcode-page";
                });*/
              }
            })
          });
        } else {
          console.log('not logged in');
          callback({error: "lol"});
        }
      }, {
        perms: "email"
      });
    },
    logout: function(){
      var self = this;
      api.auth.logout(function(error){
        if (utils.exists(error)){
          // whyyy?
          self.trigger('logout:failure');
          return;
        }
        self.trigger('logout:success');
      });
    },
    isLoggedIn: function(){

    },
    setSession: function(obj){
      // Update the model
      for (var key in data){
        this.set(key, data[key]);
      }
    },
    updateSession: function(callback){
      var self = this;
      api.auth.session(function(error, data){
        if (utils.exists(error)){
          callback(error);
          return;
        }
        if (utils.exists(data)){
          // Update the model
          for (var key in data){
            self.set(key, data[key]);
          }
        }
        callback(error, data);
      });
    }
  });

  models.Error = Backbone.Model.extend({
    defaults: {
      type: "Error",
      friendlyMessage: "An unknown error occurred"
    }
  });

  models.Loyalty = Backbone.Model.extend({

  });

  // Export
  for (var key in models){
    this.app.Models[key] = models[key];
  }
}).call(this);