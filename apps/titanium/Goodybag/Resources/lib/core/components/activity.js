/**
 * Let's just make this damn thing a factory
 */

(function(){
  var $ui = Ti.UI;
  
  var constructor = function(model){
    this.model = model;
    this.setViews();
  };
  constructor.prototype = {
    setViews: function(){
      this.views = {
      // Main view wrapper
        base: $ui.createView({
          width: Ti.UI.FILL
        , height: Ti.UI.SIZE
        , top: '6dp'
        , backgroundColor: '#fff'
        , borderColor: '#ccc'
        , borderWidth: 1
        , borderRadius: 5
        , layout: 'horizontal'
        })
        // Profile picture
      , image: createImageView({
          image: "https://s3.amazonaws.com/goodybag-uploads/consumers" + imgSrc + "-85.png"
        , title: attr.who.screenName
        , width: "42dp"
        , height: "42dp"
        // For now, I'm getting rid of border due to the uncertainty of whether or not
        // A user even has a profile picture
        // , borderWidth: 1
        // , borderColor: isUnknown ? '#ededed' : '#ccc'
        , borderRadius: 5
        , top: '4dp'
        , left: "-3dp"
        })
        
      , rightSide: {
          
        }
      };
    }
  };
  
  GB.Views.Activity = constructor;
  exports = constructor;
})();