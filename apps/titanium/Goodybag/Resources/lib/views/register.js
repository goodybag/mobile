(function(){
  var $ui = Ti.UI;
  
  var fieldFactory = function(field, text, isPassword){
    var pw = isPassword ? gb.style.get('register.field.password') : {};
    return {
      "base": $ui.createView(gb.style.get('register.field.wrapper'))
    , "input": $ui.createTextField(gb.utils.extend({
        hintText: text
      , events: {
          
        }
      }
      , gb.style.get('register.field.input')
      , pw
      ))
    , "indicator": $ui.createView(gb.style.get('register.field.indicator.base'))
    , "separator": $ui.createView(gb.style.get('register.field.separator'))
    }
  };
  
  GB.Views.add('register', {
    self: Titanium.UI.createScrollView(gb.utils.extend(
      gb.style.get('common.scrollView')
    , gb.style.get('register.self')
    )),
    
    Constructor: function () {
      var $this = this;
      
      this.onBackCallback = function(){};
      this.onRegisterCallback = function(){};
      
      this.backBtn = new GB.Button('Back', gb.utils.extend(
        { width: 80 }
      , gb.style.get('common.bluePage.buttons.gray')));
      this.registerBtn = new GB.Button('Register');
      this.backBtn.addEventListener('click', function(e){
        $this.triggerOnBack(e);
      });
      this.registerBtn.addEventListener('click', function(e){
        $this.register(e);
      });
      
      this.views = {
        "base": this.self
        
      , "wrapper": {
          "base": $ui.createView(gb.style.get('register.wrapper'))
        
        /*, "header": $ui.createLabel(gb.utils.extend(
            { text: "Register" }
          , gb.style.get('register.header')
          ))*/
          
        , "fields": {
            "base": $ui.createView(gb.style.get('register.fields'))
            
          , "firstName":        $this.fieldFactory('firstName',       'First Name')
          , "lastName":         $this.fieldFactory('lastName',        'Last Name')
          , "screenName":       $this.fieldFactory('screenName',      'Screen Name')
          , "email":            $this.fieldFactory('email',           'Email Address')
          , "password":         $this.fieldFactory('password',        'Password', true)
          , "passwordConfirm":  $this.fieldFactory('passwordConfirm', 'One More Time', true)
          }
          
        , "nav": {
            "base": $ui.createView(gb.style.get('register.nav.base'))
          , "left": {
              "base": $ui.createView(gb.style.get('register.nav.left'))
            , "btn": this.backBtn.views.base
            }
          , "right": {
              "base": $ui.createView(gb.style.get('register.nav.right'))
            , "btn": this.registerBtn.views.base
            }
          }
        }
      };
      
      gb.utils.compoundViews(this.views);
    },
    
    onShow: function (context) {
      
    },
    
    fieldFactory: function (field, text, isPassword){
      var $this = this, pw = isPassword ? gb.style.get('register.field.password') : {};
      return {
        "base": $ui.createView(gb.style.get('register.field.wrapper'))
      , "input": $ui.createTextField(gb.utils.extend({
          hintText: text
        , events: {
            blur: function(e){
              $this.validateOne(field, e.source.getValue(), function(errors){
                $this.views.wrapper.fields[field].indicator.setBackgroundImage(
                  gb.style.get('register.field.indicator.' + ((errors.length > 0) ? 'red' : 'green')).backgroundImage
                );
              });
            }
          }
        }
        , gb.style.get('register.field.input')
        , pw
        ))
      , "indicator": $ui.createView(gb.style.get('register.field.indicator.base'))
      , "separator": $ui.createView(gb.style.get('register.field.separator'))
      }
    },
    
    setOnBackCallback: function (callback) {
      this.onBackCallback = callback;
    },
    
    setOnRegisterCallback: function (callback) {
      this.onRegisterCallback = callback;
    },
    
    triggerOnBack: function (e) {
      this.onBackCallback(e);
    },
    
    triggerOnRegister: function (consumer) {
      this.onRegisterCallback(consumer);
    },
    
    register: function () {
      GB.Windows.get('login').showLoader();
      var $this = this, data = this.getFormData();
      this.validate(data, function(errors){
        if (errors.length > 0) return $this.reportErrors(errors);
        gb.consumer.register(data, function(error, consumer){
          GB.Windows.get('login').hideLoader();
          if (error) return alert(error.message);
          $this.clearFormData();
          $this.triggerOnRegister(consumer);
          $this.triggerOnBack();
        });
      });
    },
    
    validate: function (data, callback) {
      var errors = [];
      for (var key in data){
        this.validateOne(key, data[key], function(_errors){
          if (_errors.length > 0) errors = errors.concat(_errors);
        });
      }
      if (data.password !== data.passwordConfirm){
        errors.push({ field: 'password', message: 'Passwords do not match' });
      }
      callback(errors);
    },
    
    validateOne: function (key, value, callback) {
      return gb.validate(key, value, callback);
    },
    
    reportErrors: function (errors) {
      var msg = "";
      for (var i = errors.length - 1; i >= 0; i--){
        msg += errors[i].message + ((i > 0) ? "\n\n" : "") 
      }
      alert(msg);
    },
    
    clearFormData: function () {
       var fields = this.views.wrapper.fields, field;
      for (var key in fields){
        field = fields[key]
        if (field.input){
          field.input.setValue("");
          field.indicator.setBackgroundImage(gb.style.get('register.field.indicator.base').backgroundImage);
        }
      }
    },
    
    getFormData: function () {
      var fields = this.views.wrapper.fields, data = {};
      for (var key in fields){
        if (fields[key].input){
          data[key] = fields[key].input.getValue();
        }
      }
      return data;
    }
  });
})();