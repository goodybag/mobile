(function(){
  var $ui = Ti.UI;
  
  GB.Views.add('welcome', {
    self: $ui.createView(gb.style.get('welcome.base'))
    
  , Constructor: function(){
      var btn = new GB.Button('Hello');
    
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
      , "button": btn.views.base
      };
      gb.utils.compoundViews(this.views);
    }
  });
})();
