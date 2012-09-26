var WindowLoader = {
  initializeLoader: function(){
    var $this = this;

    this._loader = {
      time: 0
    , tooLong: 5
    };
    
    this.loader = {
      base: gb.style.get('common.loader.base', {
        events: {
          'click': function(){
            if ($this._loader.time >= $this._loader.tooLong) $this.hideLoader();
          }
        }
      })
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

, showLoader: function(text, callback){
    var $this = this;
    
    if (typeof text === "function"){
      callback = text;
      text = false;
    }
    if (!text){
      text = gb.config.loadingMessages[Math.floor(Math.random() * gb.config.loadingMessages.length)];
    }
    
    this.loader.middle.text.setText(text);
    this.loader.base.setZIndex(1000);
    this.loader.middle.spinner.show();
    this.loader.base.animate({ opacity: 1 }, function(){
      if (callback) callback();
    });
    
    this.isLoading = true;
    this.loader.base.hidden = false;
    
    this._loader.interval = setInterval(function(){
      if (++$this._loader.time >= $this._loader.tooLong){
        $this.loader.middle.text.setText("Taking too long? Just tap here to hide this thing!");
        clearInterval($this._loader.interval);
      }
    }, 1000);
  }
  
, hideLoader: function(callback){
    var $this = this;
    
    if (!this.loader.base.hidden){
      clearInterval(this._loader.interval);
      this._loader.time = 0;
      this.loader.base.animate({ opacity: 0 }, function(){
        $this.loader.base.setZIndex(-1);
        $this.loader.middle.spinner.hide();
        if (callback) callback();
      });
      this.loader.base.hidden = true;
    }
  }
};
