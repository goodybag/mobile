(function(){
  this.app = window.app || {};
  this.app.Models = window.app.Models || {};
  var models = {};

  models.Auth = Backbone.Model.extend({
    defaults: {

    },
    intialize: function(){

    },
    emailLogin: function(callback){

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

    },
    isLoggedIn: function(){

    },
    updateSession: function(callback){
      api.auth.session(function(error, data){
        if (utils.exists(error)){
          callback(error);
          return;
        }
        if (utils.exists(data)){
          // Update the model
          for (var key in data){
            this.set(key, data[key]);
          }
        }
        callback(error, data);
      });
    }
  });

  // Export
  for (var key in models){
    this.app.Models[key] = models[key];
  }
}).call(this);