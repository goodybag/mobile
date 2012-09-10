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
        onLoad: this.options.onLoad
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
      console.log("[InfiniScroll] - Adding", view);
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
        console.log("################# ADDD ", view);
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
    
    addEvents: function(){
      this.view.addEventListener('scroll', this.onScrollCurry);
    },
    
    removeEvents: function(){
      this.view.removeEventListener('scroll', this.onScrollCurry);
    },

    /**
     * Re-calculates the new triggerAt property if needed and calls user onNewHeight function
     * Also re-attaches the onscroll event
     */
    triggerNewHeight: function (silent) {
      this.triggerAt = (this.triggerIsPercentage)
                     ? parseInt(this.height * this.triggerRatio)
                     : this.height - this.options.triggerAt;
      this.calculatingHeight = false;
      this.scrollEndTriggered = false;
      this.addEvents();
      if (!silent) this.options.onNewHeight(this.height, this);
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
      console.log("[InfiniScroll] - Start checking height");
      this.checkingHeight = true;
      var $this = this, checkInterval = setInterval(function(){
        var newHeight = $this.wrapper.getSize().height;
        console.log("[InfiniScroll] - Checking Height", newHeight, $this.height);
        if (newHeight !== $this.height){
          $this.height = newHeight;
          clearInterval(checkInterval);
          $this.checkingHeight = false;
          $this.triggerNewHeight();
        }
      }, 100);
    },
    
    clearChildren: function(){
      console.log("clearing children", this.wrapper);
      console.log("[InfiniScroll] - Children", this.view.children.length);
      this.view.remove(this.wrapper);
      console.log("[InfiniScroll] - Children", this.view.children.length);
      console.log("[InfiniScroll] - Wrapper Children", this.wrapper.children.length);
      this.wrapper = this.getNewWrapper();
      console.log("[InfiniScroll] - Wrapper Children", this.wrapper.children.length);
      this.view.add(this.wrapper);
      console.log("[InfiniScroll] - Children", this.view.children.length);
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
     * Checks against scroll events and triggers and removes when necessary,
     * such as when scrolling happens during handler removal or end triggering.
     * @private
     */
    _onScroll: function (e) {
      if (this.clearingChildren) return;
      if (this.scrollEndTriggered) return;
      // In case there was some scrolling while the handler was being removed
      if (this.isCalculatingHeight()) return;
      var trigger = this.triggerAt - this.view.size.height;
      if (trigger <= 0) return;
      if (e.y >= trigger) {
        console.log(e.y, this.triggerAt, this.view.size.height);
        this.scrollEndTriggered = true;
        this.removeEvents()
        console.log("############TRIGGERING SCROLL TO END#############");
        this.triggerScrollEnd(e.y);
      } 
    }
  };
  GB.Views.InfiniScroll = constructor;
  exports = constructor;
})();