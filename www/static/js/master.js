
/*api.auth.facebook = function(accessToken, callback){
  api._post("http://www.goodybag.com/api/consumers/fblogin", {accessToken:accessToken}, callback);
};

api.auth.session = function (update, callback){ //update param triggers session update from db
  if(Object.isFunction(update)){
    callback = update;
    params = "";
  }
  else{
    params = "?updateSession=1";
  }
  api._get("http://www.goodybag.com/api/consumers/session"+params, callback);
};
*/

var storage = window.localStorage;

if (typeof PhoneGap == 'undefined') console.error('PhoneGap variable does not exist. Check that you have included phonegap.js correctly');
if (typeof PG == 'undefined') console.error('PG variable does not exist. Check that you have included pg-plugin-fb-connect.js correctly');
if (typeof FB == 'undefined') console.error('FB variable does not exist. Check that you have included the Facebook JS SDK file.');

FB.Event.subscribe('auth.login', function(response) {
  console.log('auth.login event');
});

FB.Event.subscribe('auth.logout', function(response) {
  console.log('auth.logout event');
});

FB.Event.subscribe('auth.sessionChange', function(response) {
  console.log('auth.sessionChange event');
});

FB.Event.subscribe('auth.statusChange', function(response) {
  console.log('auth.statusChange event');
});

function getSession() {
  alert("session: " + JSON.stringify(FB.getSession()));
}

function getLoginStatus() {
  FB.getLoginStatus(function(response) {
    if (response.status == 'connected') {
      console.log('logged in');
    } else {
      console.log('not logged in');
    }
  });
}

function me() {
  FB.api('/me/friends', function(response) {
    if (response.error) {
      alert(JSON.stringify(response.error));
    } else {
      var data = document.getElementById('data');
      response.data.forEach(function(item) {
        var d = document.createElement('div');
        d.innerHTML = item.name;
        data.appendChild(d);
      });
    }
  });
}

function logout() {
  FB.logout(function(response) {
    console.log('logged out');
  });
}

function login() {
  alert("Attempting to login with facebook");
  FB.login(function(response) {
    if (response.session) {
      alert("LOGGED IN");
      alert(JSON.stringify(response));
      var accessToken = response.session.access_token;
      alert(accessToken);
      FB.api('/me', function(response) {
        api.auth.facebook(accessToken,function(error,consumer){
          if(error != null){
            alert(error.message);
            return;
          } else {
            alert("logged in to goodybag");
            api.auth.session(function(error, data){
              if (error != null){
                console.error(error);
                return;
              }
              storage.barcodeId = data.barcodeId;
              $("#qrcode").qrcode({text:storage.barcodeId, render:"table", width:200, height:200 });
              document.location.href = "#barcode-page";
            });
          }
        })
      });
    } else {
      alert('not logged in');
    }
  }, {
    perms: "email"
  });
}