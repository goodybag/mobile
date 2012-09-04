var WindowLoader = {
  initializeLoader: function(){
    this.loader = {
      base:       gb.style.get('common.loader.base')
    , background: gb.style.get('common.loader.background')
    , middle: {
        base:     gb.style.get('common.loader.middle')
      , spinner:  gb.style.get('common.loader.spinner')
      , text:     gb.style.get('common.loader.text')
      }
    };
    gb.utils.compoundViews(this.loader);
    this.window.add(this.loader.base);
  }

, showLoader : function(text, callback){
    if (typeof text === "function") {
      callback = text;
      text = false;
    }
    if (!text)
      text = gb.config.loadingMessages[Math.floor(Math.random() * gb.config.loadingMessages.length)];
    this.loader.middle.text.setText(text);
    this.loader.base.setZIndex(1000);
    this.loader.middle.spinner.show();
    this.loader.base.animate({ opacity: 1 }, function () {
      if (callback) callback();
    });
  }
  
, hideLoader : function(callback){
    var $this = this;
    
    this.loader.base.animate({ opacity: 0 }, function(){
      $this.loader.base.setZIndex(-1);
      $this.loader.middle.spinner.hide();
      if (callback) callback();
    });
  }
};
