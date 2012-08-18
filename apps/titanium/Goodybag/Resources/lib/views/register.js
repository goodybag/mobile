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
    self: $ui.createScrollView(gb.utils.extend(
      gb.style.get('common.scrollView')
    , gb.style.get('register.self')
    )),
    
    Constructor: function () {
      var $this = this;
      
      this.backBtn = new GB.Button('Back');
      this.registerBtn = new GB.Button('Register');
      
      this.onBackCallback = function(){};
      this.onRegisterCallback = function(){};
      
      this.regs = {
        alpha: /[^a-z]/i
      , screenName: /[^a-z\.0-9_]/i
      , email: /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      };
      
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
            "base": $ui.createView(gb.style.get('register.nav'))
          , "back": this.backBtn.views.base
          , "register": this.registerBtn.views.base
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
      var $this = this, data = this.getFormData();
      this.validate(data, function(errors){
        if (errors.length > 0) return $this.reportErrors(errors);
        gb.consumer.register(data, function(error, consumer){
          if (error) return alert(error.message);
          $this.triggerOnRegister(consumer);
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
      var errors = [];
      switch (key) {
        case 'firstName':
          if (value.length < 2)  errors.push({ field: key, message: "First Name must be at least 2 characters" });
          if (this.regs.alpha.test(value))
                                 errors.push({ field: key, message: "First Name can only contain characters A-Z" });
        break;
        case 'lastName':
          if (value.length < 2)  errors.push({ field: key, message: "Last Name must be at least 2 characters" });
          if (this.regs.alpha.test(value))
                                 errors.push({ field: key, message: "Last Name can only contain characters A-Z" });
        break;
        case 'screenName':
          if (value.length < 5)  errors.push({ field: key, message: "Screen Name must be at least 5 characters" });
          if (this.regs.screenName.test(value))
                                 errors.push({ field: key, message: "Screen Name can only contain characters A-Z, periods, and underscores" });
        break;
        case 'email':
          // Only report one error of the same message
          if (value.length < 4){ errors.push({ field: key, message: "Invalid email address" }); break };
          if (!this.regs.email.test(value))
                                 errors.push({ field: key, message: "Invalid email address" });
        break;
        case 'password':
          if (value.length < 5)  errors.push({ field: key, message: "Password must be at least 5 characters" });
        break;
        case 'passwordConfirm': default: break;
      }
      callback(errors);
    },
    
    reportErrors: function (errors) {
      var msg = "";
      for (var i = errors.length - 1; i >= 0; i--){
        msg += errors[i].message + ((i > 0) ? "\n\n" : "") 
      }
      alert(msg);
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