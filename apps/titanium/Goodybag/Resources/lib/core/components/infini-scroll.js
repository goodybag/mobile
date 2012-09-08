(function () {
  var $ui = Titanium.UI;

  var constructor = function (viewOptions, options) {
    var $this = this;

    /**
     * Options for the base view (ScrollView)
     */
    this.viewOptions = {
      layout: "vertical"
    , width: $ui.FILL
    , height: $ui.FILL
    };

    /**
     * Options for InfiniScroll
     *
     * - **onNewHeight**  {Function}  - Called when a new height for the scroll view has been calculated
     * - **onBottom**     {Function}  - Called when scrolled within the triggerAt option
     * - **triggerAt**    {Unit}      - (percent/dp) When to trigger the 'scrollToBottom' event
     */
    this.options = {
      onNewHeight: function(height, myInfiniScroll){}
    , onBottom: function(myInfiniScroll){}
    , triggerAt:   '90%'
    , refresher: false
    };

    for (var key in viewOptions) this.viewOptions[key] = viewOptions[key];
    for (var key in options) this.options[key] = options[key];
    this.view = $ui.createScrollView(this.viewOptions);
    this.wrapper = this.getNewWrapper();
    if (this.options.refresher){
      this.refresher = new GB.PullToRefresh(this.view, {
        // onLoad: this.options.onLoad
      })
      this.view.add(this.refresher.views.base);
    }
    this.view.add(this.wrapper);
    this.scrollEndTriggered = false;
    this.postLayoutAdded = false;
    
    /**
     * Current Height of the ScrollView
     */
    this.height = 0;
    /**
     * Current dp value for trigger at - differs from the one in options because
     * Someone can pass in a percentage to trigger at and this value represents the dp
     * value of that percentage
     */
    this.triggerAt = 0;
    /**
     * Keeps state for current rounds trigger status
     */
    this.triggered = false;
    /**
     * Maintains state for whether or no we're calculating a new height
     */
    this.calculatingHeight = false;

    // Cache whether or not this a percentage we're dealing with and the trigger ratio
    if (this.triggerIsPercentage = this.options.triggerAt.indexOf('%')) {
      this.triggerRatio = parseFloat(this.options.triggerAt) / 100;
    } else {
      this.triggerAt = parseInt(this.options.triggerAt);
    }

    // Apparently fn.bind isn't working so we'll curry it
    this.onScrollCurry = function (e) { $this._onScroll(e); };
    this.view.addEventListener('scroll', this.onScrollCurry);
  };

  constructor.prototype = {
    /**
     * Proxy Methods
     */
    add: function (view) {
      if (!this.checkingHeight){
        this.startHeightCheck();
      }
      if (Object.prototype.toString.call(view)[8] === "A"){
        var intermediate = $ui.createView({ width: $ui.FILL, height: $ui.SIZE, layout: 'vertical' });
        for (var i = 0; i < view.length; i++){
          intermediate.add(view[i]);
        }
        this.wrapper.add(intermediate);
      }else{
        this.wrapper.add(view);
      }
    },

    hide: function () {
      return this.view.hide();
    },

    show: function () {
      return this.view.show();
    },

    scrollTo: function (x, y) {
      return this.view.scrollTo(x, y);
    },

    /**
     * Re-calculates the new triggerAt property if needed and calls user onNewHeight function
     * Also re-attaches the onscroll event
     */
    triggerNewHeight: function () {
      this.triggerAt = (this.triggerIsPercentage)
                     ? parseInt(this.height * this.triggerRatio)
                     : this.height - this.options.triggerAt;
      this.calculatingHeight = false;
      this.scrollEndTriggered = false;
      this.view.addEventListener('scroll', this.onScrollCurry);
      this.options.onNewHeight(this.height, this);
    },

    triggerScrollEnd: function (scrollY) {
      this.options.onScrollToEnd(scrollY, this);
    },

    /**
     * isCalculatingHeight
     * Returns the caclulation state of the scroll
     * @return {Boolean}
     */
    isCalculatingHeight: function () {
      return this.calculatingHeight;
    },
    
    startHeightCheck: function(){
      this.checkingHeight = true;
      var $this = this, checkInterval = setInterval(function(){
        var newHeight = $this.wrapper.getSize().height;
        if (newHeight !== $this.height){
          $this.height = newHeight;
          clearInterval(checkInterval);
          $this.checkingHeight = false;
          $this.triggerNewHeight();
        }
      }, 100);
    },
    
    clearChildren: function(){
      this.view.remove(this.wrapper);
      this.view.add(this.wrapper = this.getNewWrapper());
      this.height = 0;
    },
    
    getNewWrapper: function(){
      return $ui.createView({
        width: $ui.FILL
      , height: $ui.SIZE
      , layout: 'vertical'
      });
    },

    /**
     * Bound to the postlayout even on the Base View
     * Updates the height and nextChild property when a layout change occurs
     * @private
     */
    _onPostLayout: function (e) {
      if (!this.postLayoutAdded) return;
      var height = this.wrapper.getSize().height;
      // Don't do anything if the height hasn't changed yet
      if (height === this.height) return;
      this.postLayoutAdded = false;
      this.wrapper.removeEventListener('postlayout', this.onPostLayoutCurry);
      // Introducing the wrapper, you don't need to add up children boxes.. silly me!
      this.height = height;
      this.triggerNewHeight();
    },

    /**
     * Checks against scroll events and triggers and removes when necessary,
     * such as when scrolling happens during handler removal or end triggering.
     * @private
     */
    _onScroll: function (e) {
      if (this.scrollEndTriggered) return;
      // In case there was some scrolling while the handler was being removed
      if (this.isCalculatingHeight()) return;
      if (e.y >= this.triggerAt - this.view.size.height) {
        this.scrollEndTriggered = true;
        this.view.removeEventListener('scroll', this.onScrollCurry);
        this.triggerScrollEnd(e.y);
      } 
    }
  };
  GB.Views.InfiniScroll = constructor;
  exports = constructor;
})();