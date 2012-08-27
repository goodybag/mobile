/*
 

      , "island": {
          "base": $ui.createView(gb.utils.extend(
            gb.style.get('settings.island')
          , gb.style.get('common.grayPage.island.base')
          ))
        
        , "shadow": $ui.createView(gb.style.get('common.grayPage.island.shadow'))
        
        , "fill": {
            "base":  $ui.createView(gb.style.get('common.grayPage.island.fill'))
            
          , "wrapper": {
              "base": $ui.createView(gb.style.get('common.grayPage.island.wrapper'))
              
            , "setting:avatar": {
                "base": $ui.createView(gb.utils.extend(
                  { image: 'https://s3.amazonaws.com/goodybag-uploads/consumers-secure/000000000000000000000000-85.png' }
                , gb.style.get('settings.setting:avatar.base')
                , gb.style.get('settings.setting.base')
                ))
                
              , "field": $ui.createImageView(gb.utils.extend(
                  gb.style.get('settings.setting.field')
                , gb.style.get('settings.setting:avatar.field')
                ))
                
              , "edit": {
                  "base": $ui.createView(gb.style.get('settings.setting.right'))
                , "btn": $ui.createButtonBar(gb.utils.extend(
                    { labels: ["edit"], events: { click: function(){ $this.editField('avatar') } } }
                  , gb.style.get('settings.setting.editBar')
                  ))
                // , "btn": new GB.Button(
                    // 'edit'
                  // , gb.style.get('settings.setting:picture.edit')
                  // , gb.style.get('settings.setting.edit')
                  // , gb.style.get('common.grayPage.island.buttons.gray')
                  // , { events: { click: function(){ $this.editAvatar() } } }
                  // ).views.base
                }
              }
            , "separator-1": $ui.createView(gb.style.get('settings.setting.separator'))
              
            , "setting:name": {
                "base": $ui.createView(gb.style.get('settings.setting.base'))
                
              , "field": $ui.createLabel(gb.utils.extend(
                  gb.style.get('settings.setting.name')
                , gb.style.get('settings.setting.field')
                ))
                
              , "edit": {
                  "base": $ui.createView(gb.style.get('settings.setting.right'))
                , "btn": $ui.createButtonBar(gb.utils.extend(
                    { labels: ["edit"], events: { click: function(){ $this.editField('name') } } }
                  , gb.style.get('settings.setting.editBar')
                  ))
                // , "btn": new GB.Button(
                    // 'edit'
                  // , gb.style.get('settings.setting.edit')
                  // , gb.style.get('common.grayPage.island.buttons.gray')
                  // , { events: { click: function(){ $this.editField('name') } } }
                  // ).views.base
                }
              }
            , "separator-2": $ui.createView(gb.style.get('settings.setting.separator'))
              
            , "setting:screenName": {
                "base": $ui.createView(gb.style.get('settings.setting.base'))
                
              , "field": $ui.createLabel(gb.utils.extend(
                  gb.style.get('settings.setting.screenName')
                , gb.style.get('settings.setting.field')
                ))
                
              // , "edit": {
                  // "base": $ui.createView(gb.style.get('settings.setting.right'))
                // , "btn": new GB.Button(
                    // 'edit'
                  // // , gb.style.get('settings.setting.edit')
                  // // , gb.style.get('common.grayPage.island.buttons.gray')
                  // , { events: { click: function(){ $this.editField('screenName') } } }
                  // ).views.base
                // }
              }
            , "separator-3": $ui.createView(gb.style.get('settings.setting.separator'))
              
            , "setting:email": {
                "base": $ui.createView(gb.style.get('settings.setting.base'))
                
              , "field": $ui.createLabel(gb.utils.extend(
                  gb.style.get('settings.setting.email')
                , gb.style.get('settings.setting.field')
                ))
                
              , "edit": {
                  "base": $ui.createView(gb.style.get('settings.setting.right'))
                , "btn": $ui.createButtonBar(gb.utils.extend(
                    { labels: ["edit"], events: { click: function(){ $this.editField('email') } } }
                  , gb.style.get('settings.setting.editBar')
                  ))
                // , "btn": new GB.Button(
                    // 'edit'
                  // , gb.style.get('settings.setting.edit')
                  // , gb.style.get('common.grayPage.island.buttons.gray')
                  // , { events: { click: function(){ $this.editField('email') } } }
                  // ).views.base
                }
              }
            , "separator-4": $ui.createView(gb.style.get('settings.setting.separator'))
              
            , "setting:tapinId": {
                "base": $ui.createView(gb.style.get('settings.setting.base'))
                
              , "field": $ui.createLabel(gb.utils.extend(
                  { text: "Tap-In ID" }
                , gb.style.get('settings.setting.tapinId')
                , gb.style.get('settings.setting.field')
                ))
                
              , "edit": {
                  "base": $ui.createView(gb.style.get('settings.setting.right'))
                , "btn": $ui.createButtonBar(gb.utils.extend(
                    { labels: ["edit"], events: { click: function(){ $this.editField('barcodeId') } } }
                  , gb.style.get('settings.setting.editBar')
                  ))
                // , "btn": new GB.Button(
                    // 'edit'
                  // , gb.style.get('settings.setting.edit')
                  // , gb.style.get('common.grayPage.island.buttons.gray')
                  // , { events: { click: function(){ $this.editField('barcodeId') } } }
                  // ).views.base
                }
              }
            , "separator-5": $ui.createView(gb.style.get('settings.setting.separator'))
              
            , "setting:password": {
                "base": $ui.createView(gb.style.get('settings.setting.base'))
                
              , "field": $ui.createLabel(gb.utils.extend(
                  { text: "Password" }
                , gb.style.get('settings.setting.tapinId')
                , gb.style.get('settings.setting.field')
                ))
                
              , "edit": {
                  "base": $ui.createView(gb.style.get('settings.setting.right'))
                , "btn": $ui.createButtonBar(gb.utils.extend(
                    { labels: ["edit"], events: { click: function(){ $this.editField('password') } } }
                  , gb.style.get('settings.setting.editBar')
                  ))
                
                // , "btn": new GB.Button(
                    // 'edit'
                  // , gb.style.get('settings.setting.edit')
                  // , gb.style.get('common.grayPage.island.buttons.gray')
                  // , { events: { click: function(){ $this.editField('password') } } }
                  // ).views.base
                }
              }
            }
          }
        }
        
        
          
        // , "btn": new GB.Button(
            // 'Connect with Facebook'
          // , gb.style.get('settings.facebookBtn')
          // , gb.style.get('common.bluePage.buttons.blue')
          // , { events: { click: function(){ $this.onFacebookClick(e); } } }
          // ).views.base
          
          

        // , "signOutBtn": new GB.Button(
            // 'Sign Out'
          // , gb.style.get('settings.signOutBtn')
          // , gb.style.get('common.grayPage.buttons.red')
          // , { events: { click: function(){ $this.onSignOut(); } } }
          // ).views.base
 */



GB.Views.add('settings', {
  
  Constructor: function(){
    var $this = this;
    this.self = $ui.createScrollView(gb.utils.extend(
      gb.style.get('settings.base')
    , gb.style.get('common.grayPage.base')
    , gb.style.get('common.scrollView')
    ));   
    this.views = {
      "base": this.self
      
    , "pageWrapper": {
        "base": $ui.createView(gb.style.get('common.grayPage.wrapper'))
      
      , "header": $ui.createLabel(gb.utils.extend(
          { text: "Settings" }
        , gb.style.get('settings.header')
        , gb.style.get('common.grayPage.header1')
        ))
        
      , "island": {
          "base": $ui.createView(gb.utils.extend(
            gb.style.get('settings.island')
          , gb.style.get('common.grayPage.island.base')
          ))
        
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
      
      // , "facebookBtn": gb.style.get('common.labelBtns.blue settings.facebookBtn')
        
      , "signOutBtn": gb.style.get('common.labelBtns.red settings.signOutBtn', {
          events: { click: function(){ $this.onSignOut() } }
        })
      }
    };
    gb.utils.compoundViews(this.views);
    
    this.settings = this.views.pageWrapper.island.fill;
    
    // this.settings['setting:password'].edit.btn.addEventListener('click', function(){ $this.editField('password') });
    
    
    // Events
    // gb.consumer.on('change:name', function(){
      // $this.updateSetting('name', gb.consumer.getName());
    // });
    // gb.consumer.on('change:screenName', function(){
      // $this.updateSetting('screenName',  gb.consumer.getScreenName());
    // });
    // gb.consumer.on('change:email', function(email){
      // $this.updateSetting('email', gb.consumer.getEmail());
    // });
    
    // Facebook stuff
    // this.views.pageWrapper.facebook.addEventListener('click', function(){
      // Ti.Facebook.authorize();
    // });
    // Ti.Facebook.addEventListener('login', function(e){
//       
    // });
  }
  
, onShow: function(){
    // Remove Facebook if we don't need it
    if (gb.consumer.data.facebook) this.views.pageWrapper.base.remove(this.views.pageWrapper.facebookBtnBar);  
    this._displayUserData();
  }
  
, updateSetting: function(name, value){
    this.settings['setting:' + name].field.setText(value);
  }
  
, editField: function(field){
    GB.Views.get('edit-setting').setField(field);
    GB.Windows.get('main').showPage('edit-setting');
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
    
  }
  
, onSignOut: function(){
    gb.consumer.logout();
    GB.Windows.show('login');
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
