(function ($gb, $ui, $style) {
  $gb.ptr = function (view, callback) {
    var $this = this;
    
    // Settings
    this.callback = callback;
    this.view = view;
    this.wait = 2000;
    this.active = false;
    this.pulling = false;
    this.offset = 0;
    this.messages = {
      inactive: 'Pull down to refresh',
      pulling: 'Release to refresh, or click here to reload!',
      active: 'Refreshing'
    };
    
    // Merge options
    options = {
      xhdpi:    80,
      hdpi:     70,
      mdpi:     60,
      ldpi:     60,
      android:  60,
      iphone:   60,
      retina:   60,
      height: '60dp',
      width: $ui.FILL,
      backgroundColor: 'white',
      layout: 'vertical'
    };
    
    this.total = options[gb.utils.determineRes()];
    
    // Attachment creation
    this.attachment = {
      base: $ui.createView(options),
      phrase: $ui.createLabel({
        text: this.messages.inactive,
        width: $ui.FILL,
        height: $ui.SIZE,
        color: '#444',
        textAlign: 'center',
        top: '20dp',
        font: { fontSize: 13, fontWeight: 'bold' }
      })
    };
    
    gb.utils.compoundViews(this.attachment);
    
    // Attach
    this.view.add(this.attachment.base);
    
    var position = setInterval(function (e) {
      if ($this.offset == $this.total) clearInterval(position);
      $this.view.scrollTo(0, $this.total);
    }, 100);
    
    // Event Listeners
    this._onRefresh = function () {
      $this.pulling = false;
      $this.active = false;
      $this.attachment.phrase.setText($this.messages.inactive);
      $this.view.scrollTo(0, $this.total);
    };
    
    this._onClick = function (e) {
      $this.pulling = false;
      $this.active = true;
      $this.attachment.phrase.setText($this.messages.active);
      $this.view.removeEventListener('click', $this._onClick);
      $this.callback($this._onRefresh);
    };
    
    this._onTouchEnd = function (e) {
      if ($this.pulling && !$this.active && $this.offset <= ($this.total/5)) {
        $this._onClick();
      }
    };
    
    this._onScroll = function (e) {
      if (e.y != null) $this.offset = e.y;
      
      if (!$this.pulling && $this.offset <= ($this.total/2)) {
        $this.pulling = true;
        $this.attachment.phrase.setText($this.messages.pulling);
        $this.view.addEventListener('click', $this._onClick);
      } else if ($this.pulling && !$this.active && $this.offset <= ($this.total/5)) {
        $this.pulling = false;
        $this.active = true;
        $this.attachment.phrase.setText($this.messages.active);
        $this._onClick();
      }
    };
    
    // Remover
    this.remove = function () {
      $this.view.remove($this.attachment);
      $this.view.removeEventListener('touchend', this._onTouchEnd);
      $this.view.removeEventListener('scroll', this._onScroll);
      $this.view.removeEventListener('click', this._onClick);
    };
    
    this.view.addEventListener('touchend', this._onTouchEnd);
    this.view.addEventListener('scroll', this._onScroll);
    
    return this;
  };
})(
  gb,
  Ti.UI, 
  gb.style
);