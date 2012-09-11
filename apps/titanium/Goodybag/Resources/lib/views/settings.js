GB.Views.add('settings', {
  
  Constructor: function(){
    
    var $this = this;
    this.self = $ui.createScrollView(gb.style.get('settings.base common.grayPage.base common.scrollView'));
    
    this.views = {
      "base": this.self
      
    , "pageWrapper": {
        "base": $ui.createView(gb.style.get('common.grayPage.wrapper'))
      
      , "header": $ui.createLabel(gb.style.get('settings.header common.grayPage.header1',
          { text: "Settings" }
        ))
        
      , "island": {
          "base": $ui.createView(gb.style.get('settings.island common.grayPage.island.base'))
        
        , "shadow": $ui.createView(gb.style.get('common.grayPage.island.shadow'))
        
        , "fill": {
            "base":  $ui.createView(gb.style.get('common.grayPage.island.fill'))
            
          , "setting:avatar": {
              "base": gb.style.get('settings.setting:avatar.base settings.setting.base', {
                events: { click: function(){ $this.editAvatar() } }
              })
            , "field":      gb.style.get('settings.setting.field settings.setting:avatar.field')
            , "go":         gb.style.get('common.go settings.setting.right')
            , "separator":  gb.style.get('settings.setting.separator')
            }
            
          , "setting:name": {
              "base": gb.style.get('settings.setting.base settings.setting:name.base', {
                events: { click: function(){ $this.editField('name') } }
              })
              
            , "field":      gb.style.get('settings.setting.field settings.setting:name.field')
            , "go":         gb.style.get('common.go settings.setting.right')
            , "separator":  gb.style.get('settings.setting.separator')
            }
            
          , "setting:screenName": {
              "base": gb.style.get('settings.setting.base settings.setting:screenName.base', {
                // events: { click: function(){ $this.editField('screenName') } }
              })
              
            , "field":      gb.style.get('settings.setting.field settings.setting:screenName.field')
            // , "go":         gb.style.get('common.go settings.setting.right')
            , "separator":  gb.style.get('settings.setting.separator')
            }
            
          , "setting:email": {
              "base": gb.style.get('settings.setting.base settings.setting:email.base', {
                events: { click: function(){ $this.editField('email') } }
              })
              
            , "field":      gb.style.get('settings.setting.field settings.setting:email.field')
            , "go":         gb.style.get('common.go settings.setting.right')
            , "separator":  gb.style.get('settings.setting.separator')
            }
            
          , "setting:barcodeId": {
              "base": gb.style.get('settings.setting.base settings.setting:barcodeId.base', {
                events: { click: function(){ $this.editField('barcodeId') } }
              })
              
            , "field":      gb.style.get('settings.setting.field settings.setting:barcodeId.field', { text: "Tap-In ID" })
            , "go":         gb.style.get('common.go settings.setting.right')
            , "separator":  gb.style.get('settings.setting.separator')
            }
            
          , "setting:password": {
              "base": gb.style.get('settings.setting.base settings.setting:password.base', {
                events: { click: function(){ $this.editField('password') } }
              })
              
            , "field":      gb.style.get('settings.setting.field settings.setting:password.field', { text: "Password" })
            , "go":         gb.style.get('common.go settings.setting.right')
            }
          }
        }
      
      , "facebookBtn": gb.style.get('common.labelBtns.blue settings.facebookBtn')
        
      , "signOutBtn": gb.style.get('common.labelBtns.red settings.signOutBtn', {
          events: { click: function(){
            $this.onSignOut()
          } }
        })
      }
    };
    gb.utils.compoundViews(this.views);
    
    this.settings = this.views.pageWrapper.island.fill;
    
    // this.settings['setting:password'].edit.btn.addEventListener('click', function(){ $this.editField('password') });
    
    
    // Facebook stuff
    // Right now, it's only facebook stuff on here so I'm using that to my advantage in onShow
    // Bad but it works
    this.events = {
      "connectWithFacebookClick": {
        type: 'click'
      , target: this.views.pageWrapper.facebookBtn
      , action: function(e){
          alert('cleek');
          Ti.Facebook.authorize();
        }
      }
    , "connectWithFacebokAuth": {
        type: 'login'
      , target: Ti.Facebook
      , action: function(e){
          GB.Windows.get('main').showLoader();
          gb.api.consumer.facebookConnect(Ti.Facebook.getAccessToken(), function(error, data){
            if (error) return GB.Windows.get('main').hideLoader(), gb.utils.error(error);
            // Remove facebook stuff from settings
            $this.destroyEvents();
            $this.views.pageWrapper.base.remove($this.views.pageWrapper.facebookBtn);
            // Update user profile and sidebar picture
            this.settings['setting:avatar'].field.setImage(data.media.url);
            GB.Views.get('sidebar').elements.header.avatar.image.setImage(data.media.url);
            gb.consumer.setAvatar(data.media.url);
            gb.consumer.data.facebook = data.facebook;
            GB.Windows.get('main').hideLoader();
          });
        }
      }
    };
  }
  
, onShow: function(){
    // Remove Facebook if we don't need it
    if (gb.consumer.data.facebook) this.views.pageWrapper.base.remove(this.views.pageWrapper.facebookBtn);  
    else this.delegateEvents();
    this._displayUserData();
  }
  
, updateSetting: function(name, value){
    this.settings['setting:' + name].field.setText(value);
  }
  
, editField: function(field){
    GB.Views.get('edit-setting').setField(field);
    GB.Windows.get('main').showPage('edit-setting');
  }
  
, onHide: function(){
    this.destroyEvents();
  }
  
, editAvatar: function(){
    var avatar = this.settings['setting:avatar'].field;
    Ti.Media.openPhotoGallery({
      allowEditing: true
    , success: function(item){
        if (item.mediaType === Ti.Media.MEDIA_TYPE_VIDEO) return alert("Get out of there, video. You don't belong in a profile picture you are a video.")
        // Update settings avatar
        avatar.setImage(item.media);
        // Update sidebar
        GB.Views.get('sidebar').elements.header.avatar.image.setImage(item.media);
        gb.consumer.setAvatar(item.media);
      }
    });
  }
  
, onFacebookClick: function(){
    Ti.Facebook.authorize();  
  }
  
, onSignOut: function(){
    gb.consumer.logout();
    // if (gb.consumer.usedFacebook()) Ti.Facebook.logout();
    GB.Windows.show('login');
  }
  
, delegateEvents: function () {
    var e;
    for (var key in this.events){
      e = this.events[key];
      e.target.addEventListener(e.type, e.action);
    }
  }
  
, destroyEvents: function () {
    var e;
    for (var key in this.events){
      e = this.events[key];
      e.target.removeEventListener(e.type, e.action);
    }
  }
  
, _displayUserData: function(){;
    var $this = this;
    gb.consumer.getAvatar(128, function(image){
      $this.settings['setting:avatar'].field.setImage(image);
    });
    this.settings['setting:name'].field.setText(gb.consumer.getName());
    this.settings['setting:screenName'].field.setText(gb.consumer.data.screenName);
    this.settings['setting:email'].field.setText(gb.consumer.data.email);
  }
});
