(function(){
  var $ui = Ti.UI;
  
  GB.Views.add('email-change-request', {
    self: $ui.createScrollView(gb.utils.extend(
      gb.style.get('settings.base')
    , gb.style.get('common.grayPage.base')
    , gb.style.get('common.scrollView')
    ))
    
  , Constructor: function(){
      var $this = this;

      this.views = {
        "base": this.self
        
      , "pageWrapper": {
          "base": $ui.createView(gb.style.get('common.grayPage.wrapper'))

        , "island": {
            "base": $ui.createView(gb.utils.extend(
              gb.style.get('settings.island')
            , gb.style.get('common.grayPage.island.base')
              // Fuck it, inline styles
            , { top: '12dp' }
            ))
          
          , "shadow": $ui.createView(gb.style.get('common.grayPage.island.shadow'))
          
          , "fill": {
              "base":  $ui.createView(gb.style.get('common.grayPage.island.fill'))
              
            , "wrapper": {
                "base": $ui.createView(gb.style.get('common.grayPage.island.wrapper'))
                
              , "header": $ui.createLabel(gb.utils.extend(
                  { text: "Please check your email" }
                , gb.style.get('common.grayPage.island.header1')
                ))
                
              , "subtext": $ui.createLabel(gb.utils.extend(
                  { text: "We sent a confirmation email to your new address. Please check your email and click the verification link to complete the process." }
                , gb.style.get('common.grayPage.island.paragraph')
                ))
                
              } // Wrapper
            } // Fill
          } // Island
        
        , "navWrapper": {
            "base": $ui.createView(gb.style.get('common.grayPage.island.bottomNavWrapper'))
            
          , "backBtn": new GB.Button(
              'Back'
            , { "default": { width: $ui.FILL } }
            , gb.style.get('common.grayPage.buttons.gray')
            , { events: { click: function(){ $this.onBack(); } } }
            ).views.base
          }
        }
      };
      gb.utils.compoundViews(this.views);
    }
  
    
  , onShow: function(){

    }
    
  , onBack: function(){
      if (this.currentFocus) this.currentFocus.blur();
      GB.Views.show('settings');
    }
  });
})();
