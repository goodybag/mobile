(function(){
  var $ui = Ti.UI;
  
  GB.Views.add('settings', {
    self: $ui.createScrollView(gb.utils.extend(
      gb.style.get('settings.base')
    , gb.style.get('common.grayPage.base')
    , gb.style.get('common.scrollView')
    ))
    
  , Constructor: function(){
      var $this = this;
      
      this.views = {
        "base": this.self
      };
      gb.utils.compoundViews(this.views);
    }
  });
})();
