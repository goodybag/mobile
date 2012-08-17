(function(){
  var $ui = Ti.UI;
  
  GB.Views.add('welcome', {
    self: $ui.createView(gb.style.get('welcome.base'))
    
  , Constructor: function(){
      this.views = {
        "base": this.self
      , "header": $ui.createLabel(gb.utils.extend(
          { text: "Welcome to Goodybag!" }
        , gb.style.get('welcome.header')
        ))
      , "smiley": $ui.createLabel(gb.utils.extend(
          { text: ":)" }
        , gb.style.get('welcome.smiley')
        , gb.style.get('welcome.header')
        ))
      };
      gb.utils.compoundViews(this.views);
    }
  });
})();
