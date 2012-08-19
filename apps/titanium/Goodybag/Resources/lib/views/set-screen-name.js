(function(){
  var $ui = Ti.UI;
  
  GB.Views.add('set-screen-name', {
    self: $ui.createScrollView(gb.utils.extend(
      gb.style.get('setScreenName.base')
    , { layout: 'composite' }
    , gb.style.get('common.bluePage.base')
    , gb.style.get('common.scrollView')
    ))
    
  , Constructor: function(){
      var $this = this, btnStyle = gb.style.get('common.bluePage.buttons.blue');
      btnStyle.default.width = "200dp";
      
      this.onComplete = function(){};
      this.completeBtn = new GB.Button('Complete');
      
      this.views = {
        "base": this.self
      , "wrapper": {
          "base": $ui.createView(gb.utils.extend(
            gb.style.get('setScreenName.wrapper')
          ))
          
        , "header": $ui.createLabel(gb.utils.extend(
            { text: "Welcome to Goodybag!" }
          , gb.style.get('common.bluePage.header1')
          , gb.style.get('setScreenName.header')
          ))
          
        , "subHeader": $ui.createLabel(gb.utils.extend(
            { text: "Enter your desired alias" }
          , gb.style.get('common.bluePage.baseText')
          , gb.style.get('setScreenName.subHeader')
          ))
          
        , "fieldset": {
            "base": $ui.createView(gb.utils.extend(
               gb.style.get('common.bluePage.fieldset')
             , { width: '200dp' }
            ))
          , "screenName": {
              "base": $ui.createView(gb.style.get('register.field.wrapper'))
            , "input": $ui.createTextField(gb.utils.extend({
                hintText: "Screen Name"
              }
              , { width: $ui.FILL }
              , gb.style.get('register.field.input')
              ))
            }
          }
          
        , "nav": {
            "base": $ui.createView(gb.style.get('setScreenName.nav'))
          
          , "complete": new GB.Button('Complete Registration!', gb.utils.extend({
              events: {
                click: function(e){
                  $this.complete();
                }
              }
            }
            , btnStyle
            )).views.base
          }
        }
      };
      gb.utils.compoundViews(this.views);
    }
    
  , complete: function(){
      
    }
  });
})();
