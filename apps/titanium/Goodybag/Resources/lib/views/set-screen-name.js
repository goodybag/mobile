(function(){
  var $ui = Ti.UI;
  
  GB.Views.add('welcome', {
    self: $ui.createScrollView(gb.utils.extend(
      gb.style.get('setScreenName.base')
    , gb.style.get('common.scrollView')
    ))
    
  , Constructor: function(){
      this.views = {
        "base": this.self
      , "header": $ui.createLabel(gb.utils.extend(
          { text: "Set your Screen Name and complete your registration" }
        , gb.style.get('welcome.header')
        ))
      , "fieldset": {
          "base": gb.style.get('common.fieldset')
        }
      };
      gb.utils.compoundViews(this.views);
    }
  });
})();
