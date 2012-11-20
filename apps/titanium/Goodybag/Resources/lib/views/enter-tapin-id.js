(function(){
  var $ui = Ti.UI;
  
  GB.Views.add('enter-tapin-id', {
    self: $ui.createScrollView(gb.style.get('enterTapinId.base common.scrollView common.grayPage.base'))
    
  , Constructor: function(){
      var $this = this;
      
      this.window = GB.Windows.get('complete-registration');
      this.hasCalledOnComplete = false;
      this.onComplete = function () {};
      this.completeBtn = new GB.Button('Complete');
      
      this.views = {
        "base": this.self
        
      , "wrapper": {
          "base": $ui.createView(gb.style.get('enterTapinId.wrapper'))

        , "submitTapinIdIsland": {
            "base": $ui.createView(gb.utils.extend(
              {}
            , gb.style.get('common.grayPage.island.base')
            ))
          
          , "shadow": $ui.createView(gb.style.get('common.grayPage.island.shadow'))
          
          , "fill": {
              "base":  $ui.createView(gb.style.get('common.grayPage.island.fill'))
              
            , "wrapper": {
                "base": $ui.createView(gb.style.get('common.grayPage.island.wrapper'))
                
                /**
                 * Header and sub-header
                 */
              , "header:already": $ui.createLabel(gb.utils.extend(
                  { text: "Already have a QR Code?" }
                , gb.style.get('enterTapinId.header:already')
                , gb.style.get('common.grayPage.island.header2')
                ))
                
              , "header:enter": $ui.createLabel(gb.utils.extend(
                  { text: "Enter your Tap-In ID below" }
                , gb.style.get('enterTapinId.header:enter')
                , gb.style.get('common.grayPage.island.paragraph')
                ))
                
                /**
                 * Input area, graphic, and submit
                 */
              , "form": {
                  "base": $ui.createView(gb.style.get('enterTapinId.form.base'))

                , "row": {
                    "base": $ui.createView(gb.style.get('enterTapinId.form.row'))
                    
                  , "inputWrapper": {
                      "base": $ui.createView(gb.utils.extend(
                        {}
                      , gb.style.get('enterTapinId.form.inputWrapper')
                      , gb.style.get('common.grayPage.island.inputWrapper')
                      ))
                      
                    , "input": $ui.createTextField(gb.utils.extend(
                        { hintText: "Tap-In ID" }
                      , gb.style.get('enterTapinId.form.input')
                      , gb.style.get('common.grayPage.island.input')
                      ))
                    }
                    
                  , "image": $ui.createImageView(gb.style.get('enterTapinId.form.image'))
                  }
                  
                , "submitWrapper": {
                    "base": $ui.createView(gb.style.get('enterTapinId.form.submitWrapper'))
                  
                  , "submit": new GB.Button(
                      'Submit'
                    , gb.style.get('enterTapinId.form.submit')
                    , gb.style.get('common.grayPage.island.buttons.gray')
                    , { events: { click: function(e){ $this.submitTapinId(); } } }
                    ).views.base
                  }
                }
              }
            }
          }
        
        , "make": {
            "base": $ui.createView(gb.style.get('enterTapinId.make'))
            
          , "header:makeOne": $ui.createLabel(gb.utils.extend(
              { text: "Don't have one yet?" }
            , gb.style.get('common.grayPage.header2')
            ))
            
          , "btnWrapper": {
              "base": $ui.createView(gb.style.get('enterTapinId.makeBtnWrapper'))
              
            , "makeBtn": new GB.Button(
                'Make One For Me'
              , gb.style.get('enterTapinId.makeBtn')
              , gb.style.get('common.bluePage.buttons.blue')
              , { events: { click: function(e){ $this.generateTapinId(e); } } }
              ).views.base
            }
          }
        }
      };
      gb.utils.compoundViews(this.views);
      // FUCK we need selectors
      this.tapinIdInput = this.views.wrapper.submitTapinIdIsland.fill.wrapper.form.row.inputWrapper.input;
    }
    
  , generateTapinId: function(){
      var $this = this;
      this.window.showLoader();
      gb.consumer.createBarcodeId(function (error, id) {
        $this.window.hideLoader();
        if (error) return gb.handleError(error);
        $this.triggerOnComplete();
      });
    }
    
  , submitTapinId: function(){
      this.window.showLoader();
      var value = gb.utils.checkQRCode(this.tapinIdInput.getValue(), true), $this = this;
      if (value.error) return alert(value.error);
      gb.consumer.setBarcodeId(value.data, function (error) {
        $this.window.hideLoader();
        if (error) return gb.handleError(error);
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
