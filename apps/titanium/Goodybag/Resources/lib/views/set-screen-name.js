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
      
      this.hasCalledOnComplete = false;
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
          
          , "complete": new GB.Button('Set Screen Name!', gb.utils.extend({
              events: {
                click: function(e){
                  $this.setScreenName($this.views.wrapper.fieldset.screenName.input.getValue());
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
    
  , setScreenName: function(value){
      // Validate
      if (value.length < 5)
        return alert("Screen Name must be at least 5 characters");
      if (/[^a-z\.0-9_]/i.test(value))
        return alert("Screen Name can only contain characters A-Z, periods, and underscores");
        
      // Set
      var $this = this;
      gb.consumer.setScreenName(value, function(error){
        if (error) return alert(error.friendlyMessage);
        // Trigger that we've completed this step of registration
        $this.triggerOnComplete();
      });
    }
    
  , triggerOnComplete: function(){
      // if (this.hasCalledOnComplete) return;
      this.onComplete();
      this.hasCalledOnComplete = true;
    },
    
    setOnComplete: function(fn){
      this.onComplete = fn;
    },
  });
})();
