(function(){
  var $ui = Ti.UI;
  
  var fieldFactory = function(field, text, isPassword){
    var style = 'register.field.input' + (isPassword? ' register.field.password' : '')
    return {
      "base": gb.style.get('register.field.wrapper')
    , "input": gb.style.get(style, {
        hintText: text, events: {}
      })
    , "indicator": gb.style.get('register.field.indicator.base')
    , "separator": gb.style.get('register.field.separator')
    }
  };
  
  GB.Views.add('register', {
    self: gb.style.get('common.scrollView register.self'),
    
    Constructor: function () {
      var $this = this;
      
      this.onBackCallback = function(){};
      this.onRegisterCallback = function(){};
      
      this.backBtn = new GB.Button('Back', gb.style.get('common.bluePage.buttons.gray', { width: 80 }));
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
          "base": gb.style.get('register.wrapper')
        
        /*, "header": $ui.createLabel(gb.utils.extend(
            { text: "Register" }
          , gb.style.get('register.header')
          ))*/
          
        , "fields": {
            "base": gb.style.get('register.fields')
            
          , "firstName":        $this.fieldFactory('firstName',       'First Name')
          , "lastName":         $this.fieldFactory('lastName',        'Last Name')
          , "screenName":       $this.fieldFactory('screenName',      'Screen Name')
          , "email":            $this.fieldFactory('email',           'Email Address')
          , "password":         $this.fieldFactory('password',        'Password', true)
          , "passwordConfirm":  $this.fieldFactory('passwordConfirm', 'One More Time', true)
          }
          
        , "nav": {
            "base": gb.style.get('register.nav.base')
          , "left": {
              "base": gb.style.get('register.nav.left')
            , "btn": this.backBtn.views.base
            }
          , "right": {
              "base": gb.style.get('register.nav.right')
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
      var $this = this, style = 'register.field.input' + (isPassword? ' register.field.password' : '');
      
      return {
        "base": gb.style.get('register.field.wrapper')
      , "input": gb.style.get(style, {
          hintText: text
        , events: {
            blur: function(e){
              $this.validateOne(field, e.source.getValue(), function(errors){
                $this.views.wrapper.fields[field].indicator.set(
                  'BackgroundImage',
                  gb.style.get('register.field.indicator.' + ((errors.length > 0) ? 'red' : 'green')).backgroundImage
                );
              });
            }
          }
        })
      , "indicator": gb.style.get('register.field.indicator.base')
      , "separator": gb.style.get('register.field.separator')
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
      return gb.validate(key, value, callback);
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