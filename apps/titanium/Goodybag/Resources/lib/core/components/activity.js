/**
 * Let's just make this damn thing a factory
 */

(function(){
  var $ui = Ti.UI;
  
  var constructor = function(model){
    this.model = model;
    
    // Main view wrapper
    this.base = Titanium.UI.createView({
      width: Ti.UI.FILL
    , height: Ti.UI.SIZE
    , top: '6dp'
    , backgroundColor: '#fff'
    , borderColor: '#ccc'
    , borderWidth: 1
    , borderRadius: 5
    , layout: 'horizontal'
    });
  };
  constructor.prototype = {
    
  };
  
  GB.Views.Activity = constructor;
  exports = constructor;
})();