(function(){
  var $ui = Ti.UI;
  
  var constructor = function(options){
    this.views = {
      "base": $ui.createView(gb.utils.extend(
        options || {}
      , gb.style.get('common.grayPage.island.base')
      ))
    
    , "shadow": $ui.createView(gb.style.get('common.grayPage.island.shadow'))
    
    , "fill": {
        "base":  $ui.createView(gb.style.get('common.grayPage.island.fill'))
        
      , "wrapper": {
          "base": $ui.createView(gb.style.get('common.grayPage.island.wrapper'))
        }
      }
    };
    gb.utils.compoundViews(this.views);
    this.content = this.views.fill.wrapper.base;
  };
  constructor.prototype = {
    add: function(view){
      this.content.add(view);
    }
  , remove: function(view){
      this.content.remove(view);
    }
  };
  GB.Island = constructor;
  exports = constructor;
})();
