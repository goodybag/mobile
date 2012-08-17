/**
 * Activity View
 */

(function(){
  var
    $ui = Titanium.UI
  , getVerticalGap = function(){
      return $ui.createView({
        width: $ui.FILL
      , height: '11dp'
      });
    }
  ;
  
  var constructor = function(model){
    this.model = model;
    this.tries = 0;
    
    var
      attr    = this.model.attributes
    , $this   = this
    , post    = 0
    , imgSrc  = (attr.who.id || attr.who.screenName)
              ? ("-secure/" + escape(attr.who.id || attr.who.screenName))
              : "/000000000000000000000000"
    ;
    
    this.id = (attr.who.id || attr.who.screenName)
    ? escape(attr.who.id || attr.who.screenName)
    : '000000000000000000000000';
    
    this.views = {
      // Main view wrapper
      base: $ui.createView({
        width: $ui.FILL
      , height: $ui.SIZE
      , top: '6dp'
      })
      
      // Profile picture
    , image: $ui.createImageView({
        image: "https://s3.amazonaws.com/goodybag-uploads/consumers" + imgSrc + "-128.png"
      , decodeRetries: 1
      , defaultImage: gb.utils.getImage('avatar.png')
      , width: "42dp"
      , height: "42dp"
      , title: attr.who.screenName
      , top: "16dp"
      , left: "-3dp"
      , zIndex: 1
      , borderRadius: 5
      , events: {
          error: function (e) {
            if ($this.tries == 2) return $this.setToDefaultImage();
            if ($this.tries == 1) $this.setInsecureSubdomainImage($this.id);
            if ($this.tries == 0) $this.setSubdomainImage($this.id);
            
            $this.tries++;
          }
        }
      })
      
    , container: {
        base: $ui.createView({
          width: $ui.FILL
        , height: $ui.SIZE
        , backgroundColor: '#fff'
        , borderColor: '#ccc'
        , borderWidth: 1
        , borderRadius: 5
        , layout: 'horizontal'
        , left: '5dp'
        , right: '5dp'
        })
        
      , fillerTop: getVerticalGap()
         
      , fillerLeft: $ui.createView({
          width: '42dp'
        , height: '52dp'
        , top: 0
        , left: 0
        })
        
      , sentence: $ui.createLabel({
          text: this.model.getSentence()
        , width: $ui.FILL
        , height: $ui.SIZE
        , right: '6dp'
        , top: 0
        , color: gb.ui.color.base
        , font: {
            fontSize: gb.ui.font.base.size
          }
        })
        
      , fillerBottom: getVerticalGap()
      }
    };
    
    gb.utils.compoundViews(this.views);
  };
  
  constructor.prototype = {
    setToDefaultImage: function(){
      this.views.image.setImage("https://s3.amazonaws.com/goodybag-uploads/consumers/000000000000000000000000-128.png");
    },
    
    setSubdomainImage: function (id) {
      this.views.image.setImage("https://goodybag-uploads.s3.amazonaws.com/consumers-secure/" + id + "-128.png");
    },
    
    setInsecureSubdomainImage: function (id) {
      this.views.image.setImage("https://goodybag-uploads.s3.amazonaws.com/consumers/" + id + "-128.png");
    },
    
    setInsecureImage: function (id) {
      this.views.image.setImage("https://s3.amazonaws.com/goodybag-uploads/consumers/" + id + "-128.png");
    }
  };
  
  GB.Views.Activity = constructor;
  exports = constructor;
})();