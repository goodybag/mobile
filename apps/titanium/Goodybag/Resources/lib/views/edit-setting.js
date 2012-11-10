(function(){
  var $ui = Ti.UI;
  
  GB.Views.add('edit-setting', {
    self: $ui.createScrollView(gb.style.get('settings.base common.grayPage.base common.scrollView'))
    
  , Constructor: function(){
      var $this = this;

      this.views = {
        "base": this.self
        
      , "pageWrapper": {
          "base": $ui.createView(gb.style.get('common.grayPage.wrapper'))
        
        , "header": $ui.createLabel(gb.style.get(
            'settings.header common.grayPage.header1'
          , { text: "Settings" }
          ))

        , "island": {
            "base": $ui.createView(gb.style.get('settings.island common.grayPage.island.base'))
          
          , "shadow": $ui.createView(gb.style.get('common.grayPage.island.shadow'))
          
          , "fill": {
              "base":  $ui.createView(gb.style.get('common.grayPage.island.fill'))
              
            , "wrapper": {
                "base": $ui.createView(gb.style.get('common.grayPage.island.wrapper'))
                
                /**
                 * Fields
                 */
              , "name": {
                  "base": $ui.createView(gb.style.get('settings.edit.fields.base'))
                , "field:firstName": this.getValidatedField('firstName', 'First Name', gb.consumer.data.firstName, null, ['name', "field:lastName"])
                , "field:lastName": this.getValidatedField('lastName', 'Last Name', gb.consumer.data.lastName)
                }
                
              , "email": {
                  "base": $ui.createView(gb.style.get('settings.edit.fields.base'))
                , "field:email": this.getValidatedField('email', 'Email', gb.consumer.data.email, null, ['email', "field:emailConfirm"])
                , "field:emailConfirm": this.getValidatedField('email', 'Confirm Email')
                }
                
              , "screenName": {
                  "base": $ui.createView(gb.style.get('settings.edit.fields.base'))
                , "field:screenName": this.getValidatedField('screenName', 'Alias', gb.consumer.data.setScreenName ? gb.consumer.data.screenName : "")
                }
                
              , "barcodeId": {
                  "base": $ui.createView(gb.style.get('settings.edit.fields.base'))
                , "field:barcodeId": this.getValidatedField('barcodeId', 'Tap-In ID', gb.consumer.data.barcodeId || "")
                }
                
              , "password": {
                  "base": $ui.createView(gb.style.get('settings.edit.fields.base'))
                , "field:password": this.getField('Current Password', "", true, ['password', "field:newPassword"])
                , "field:newPassword": this.getValidatedField('password', 'New Password', "", true, ['password', "field:confirmPassword"])
                , "field:confirmPassword": this.getValidatedField('password', 'Confirm', "", true)
                }
                /**
                 * End Fields
                 */
                
              } // Wrapper
            } // Fill
          } // Island
        
        , "navWrapper": {
            "base": $ui.createView(gb.style.get('common.grayPage.island.bottomNavWrapper')),
            
            "saveBtn": new GB.Button(
              'Save'
            , gb.style.get('settings.edit.saveBtn')
            , gb.style.get('common.grayPage.buttons.green')
            , { events: { click: function(){ $this.save(); } } }
            ).views.base
          }
        }
      };
      
      gb.utils.compoundViews(this.views);
      
      this.wrapper = this.views.pageWrapper.island.fill.wrapper;
      
      for (var key in this.wrapper){
        if (key === "base") continue;
        if (this.wrapper[key].hasOwnProperty('base')) this.hideField(key);
      }
    }
    
  , onShow: function(){
      var $this = this;
      
      GB.Windows.get('main').toggleBack(function (e) {
        $this.onBack();
      });
    }
    
  , hideField: function(which){
      this.wrapper[which].base.hide();
      this.wrapper[which].base.setHeight(0);
    }
    
  , showField: function(which){
      this.wrapper[which].base.show();
      this.wrapper[which].base.setHeight($ui.SIZE);
    }
    
  , setField: function(which){
      if (this.which) this.hideField(this.which);
      this.showField(which);
      this.which = which;
      var fields = this.wrapper[this.which];
      // Set page title
      switch(which){
        case 'name':
          this.views.pageWrapper.header.setText('Settings - Name');
          fields['field:firstName'].input.setValue(gb.consumer.data.firstName);
          fields['field:lastName'].input.setValue(gb.consumer.data.lastName);
          fields['field:firstName'].indicator.setOpacity(0);
          fields['field:lastName'].indicator.setOpacity(0);
        break;
        case 'email':
          this.views.pageWrapper.header.setText('Settings - Email');
          fields['field:email'].input.setValue(gb.consumer.data.email);
          fields['field:email'].indicator.setOpacity(0);
        break;
        case 'screenName':
          this.views.pageWrapper.header.setText('Settings - Alias');
          fields['field:screenName'].input.setValue(gb.consumer.data.setScreenName ? gb.consumer.data.screenName : "");
          fields['field:screenName'].indicator.setOpacity(0);
        break;
        case 'barcodeId':
          this.views.pageWrapper.header.setText('Settings - Tap-In ID');
          fields['field:barcodeId'].input.setValue(gb.consumer.data.barcodeId || "");
          fields['field:barcodeId'].indicator.setOpacity(0);
        break;
        case 'password':
          this.views.pageWrapper.header.setText('Settings - Password');
          fields['field:password'].input.setValue('');
          fields['field:newPassword'].input.setValue('');
          fields['field:confirmPassword'].input.setValue('');
          fields['field:newPassword'].indicator.setOpacity(0);
          fields['field:confirmPassword'].indicator.setOpacity(0);
        break;
        default: break;
      }
    }
    
  , getField: function(hint, value, hidden, next){
      var $this = this, view = {
        "base": $ui.createView(gb.utils.extend(
          gb.style.get('settings.edit.fields.field')
        , gb.style.get('common.grayPage.island.inputWrapper')
        ))
        
      , "input": $ui.createTextField(gb.utils.extend(
          gb.style.get('settings.edit.fields.input')
        , gb.style.get('common.grayPage.island.input')
        , { // Options
            hintText: hint
          , value: value
          , passwordMask: !!hidden
          , events: { focus: function(e){ $this.currentFocus = view.input; } }
          } // End Options
        ))
        
      , "indicator": gb.style.get('common.grayPage.island.indicator')
      };
      
      if (next)
        view.input.setReturnKeyType(Titanium.UI.RETURNKEY_NEXT),
        view.input.addEventListener('return', function (e) {
          view.input.blur();
          $this.views.pageWrapper.island.fill.wrapper[next[0]][next[1]].input.focus();
        });
        
      return view;
    }
    
  , getValidatedField: function(fieldName, hint, value, hidden, next){
      var $this = this, view = {
        "base": $ui.createView(gb.utils.extend(
          gb.style.get('settings.edit.fields.field')
        , gb.style.get('common.grayPage.island.inputWrapper')
        ))
        
      , "input": $ui.createTextField(gb.utils.extend(
          gb.style.get('settings.edit.fields.input')
        , gb.style.get('common.grayPage.island.input:indicated')
        , { // Options
            hintText: hint
          , value: value
          , passwordMask: !!hidden
          , events: {
              focus: function(e){ $this.currentFocus = view.input; }
            , blur: function(){
                var value = view.input.getValue(), indicator = view.indicator;
                // if (value === "") return indicator.setOpacity(0);
                indicator.setOpacity(1);
                gb.validate(fieldName, value, function(errors){
                  if (errors.length > 0){
                    indicator.setColor(gb.ui.color.salmon);
                    (!Ti.Android) && indicator.setShadowColor(gb.ui.color.salmonDark);
                  }else{
                    indicator.setColor(gb.ui.color.green);
                    (!Ti.Android) && indicator.setShadowColor(gb.ui.color.greenDark);
                  }
                });
              }
            }
          } // End Options
        ))
        
      , "indicator": gb.style.get('common.grayPage.island.indicator')
      };
      
      if (next)
        view.input.setReturnKeyType(Titanium.UI.RETURNKEY_NEXT),
        view.input.addEventListener('return', function (e) {
          view.input.blur();
          $this.views.pageWrapper.island.fill.wrapper[next[0]][next[1]].input.focus();
        });
      
      return view;
    }
    
  , save: function(){
      var currentFields = this.wrapper[this.which];
      switch (this.which){
      case 'name':
        var
          firstName = currentFields['field:firstName'].input.getValue()
        , lastName  = currentFields['field:lastName'].input.getValue()
        , errors    = []
        ;
        if (gb.consumer.data.facebook) return this.reportErrors(['Facebook users must change their name from facebook']);
        if (firstName === gb.consumer.data.firstName && lastName === gb.consumer.data.lastName) return;
        if (firstName !== gb.consumer.data.firstName){
          gb.validate('firstName', firstName, function(_errors){
            if (_errors.length > 0) errors = errors.join(_errors);
          });
        }
        if (lastName !== gb.consumer.data.lastName){
          gb.validate('lastName', firstName, function(_errors){
            if (_errors.length > 0) errors = errors.join(_errors);
          });
        }
        if (errors.length > 0) return this.reportErrors(errors);
        gb.consumer.setName({ firstName: firstName, lastName: lastName }, function(error){
          if (error) return alert(error);
        });
        GB.Views.get('settings').updateSetting('name', firstName + " " + lastName);
      break;
      case 'email':
        var
          email   = currentFields['field:email'].input.getValue()
        , confirm = currentFields['field:emailConfirm'].input.getValue()
        , errors  = []
        ;
        gb.validate('email', email, function(_errors){
          if (_errors.length > 0) errors = errors.join(_errors);
        });
        if (email !== confirm) errors.push('Emails do not match');
        if (errors.length > 0) return this.reportErrors(errors);
        gb.consumer.setEmail(email, function(error){
          if (error) return alert(error);
        });
        return GB.Views.show('email-change-request');
      break;
      case 'screenName':
      break;
      case 'barcodeId':
        var
          barcodeId = currentFields['field:barcodeId'].input.getValue()
        , errors    = gb.validate('barcodeId', barcodeId)
        ;
        if (errors.length > 0) return this.reportErrors(errors);
        gb.consumer.setBarcodeId(barcodeId, function(error){});
      break;
      case 'password':
        var
          password        = currentFields['field:password'].input.getValue()
        , newPassword     = currentFields['field:newPassword'].input.getValue()
        , confirmPassword = currentFields['field:confirmPassword'].input.getValue()
        , errors          = gb.validate('password', newPassword)
        ;
        if (newPassword !== confirmPassword) errors.push('Passwords do not match');
        if (errors.length > 0) return this.reportErrors(errors);
        gb.consumer.setPassword(password, newPassword, function(error){ });
      break;
      default: break;
    }
    // Invoke the main back btn callback which will in turn call this.onBack
    GB.Windows.get('main').callback.back();
  }
  
  , reportErrors: function(errors){
      console.log('reporting');
      if (typeof errors === "string") return alert(errors);
      var msg = "";
      for (var i = errors.length - 1, error; i >= 0; i--){
        error = errors[i];
        msg += (typeof error === "object") ? error.message : error;
      }
      alert(msg);
    }
    
  , onBack: function(){
      if (this.currentFocus) this.currentFocus.blur();
      GB.Windows.get('main').showPage('settings');
    }
  });
})();
