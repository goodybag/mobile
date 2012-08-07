(function(){
  var $ui = Titanium.UI;
  
  GB.Views.InfiniScroll = Class({
    /**
     * Options for the base view (ScrollView) 
     */
    viewOptions: {
      layout: "vertical"
    },
    
    /**
     * Options for InfiniScroll
     * 
     * - **onNewHeight**  {Function}  - Called when a new height for the scroll view has been calculated
     * - **onBottom**     {Function}  - Called when scrolled within the triggerAt option 
     * - **triggerAt**    {Unit}      - (percent/dp) When to trigger the 'scrollToBottom' event
     */
    options: {
      onNewHeight: function(height, myInfiniScroll){}
    , onBottom: function(myInfiniScroll){}
    , triggerAt:   '90%'
    },
    
    /**
     * Current Height of the ScrollView
     */
    height: 0,
    
    /**
     * Current dp value for trigger at - differs from the one in options because
     * Someone can pass in a percentage to trigger at and this value represents the dp
     * value of that percentage
     */
    triggerAt: 0,
    
    /**
     * Keeps state for current rounds trigger status
     */
    triggered: false,
    
    /**
     * The next child to start adding height from when we trigger the postLayout event
     * We keep track of this so we don't iterate through all of the old children that got added previously
     * And we only add in the new height
     */
    nextChild: 0,
    
    /**
     * Maintains state for whether or no we're calculating a new height
     */
    calculatingHeight: false,
    
    /**
     * Base ScrollView for InfiniScroll
     */
    view: null,
    
    /**
     * @constructor
     */
    Constructor: function(viewOptions, options){
      var self = this;
      for (var key in viewOptions){
        this.viewOptions[key] = viewOptions[key];
      }
      
      for (var key in options){
        this.options[key] = options[key];
      }
      
      this.view = $ui.createScrollView(this.viewOptions);
      this.scrollEndTriggered = false;
      
      // Yes, I meant single equal sign
      if (this.triggerIsPercentage = this.options.triggerAt.indexOf('%')){
        this.triggerRatio = parseFloat(this.options.triggerAt) / 100;
      }else{
        this.triggerAt = parseInt(this.options.triggerAt);
      }
      
      // Apparently fn.bind isn't working so we'll curry it
      this.onPostLayoutCurry = function(e){ self._onPostLayout(e); };
      this.onScrollCurry = function(e){ self._onScroll(e); };
      this.view.addEventListener('postlayout', this.onPostLayoutCurry);
      this.view.addEventListener('scroll', this.onScrollCurry);
    },
    
    add: function(view){
      this.view.add(view);
    },
    
    /**
     * Re-calculates the new triggerAt property if needed and calls user onNewHeight function
     * Also re-attaches the onscroll event
     */
    triggerNewHeight: function(){
      console.log("[InfiniScroll] - triggerNewHeight");
      var self = this;
      if (this.triggerIsPercentage){
        this.triggerAt = this.height * this.triggerRatio; 
      }
      this.calculatingHeight = false;
      this.scrollEndTriggered = false;
      this.view.addEventListener('scroll', this.onScrollCurry);
      this.options.onNewHeight(this.height, this);
    },
    
    triggerScrollEnd: function(scrollY){
      this.options.onScrollToEnd(scrollY, this);
    },
    
    /**
     * isCalculatingHeight
     * Returns the caclulation state of the scroll
     * @return {Boolean}
     */
    isCalculatingHeight: function(){
      return this.calculatingHeight;
    },
    
    /**
     * @private _postLayout
     * Bound to the postlayout even on the Base View
     * Udates the height and nextChild property when a layout change occurs 
     */
    _onPostLayout: function(e){
      console.log("[InfiniScroll] - onPostLayout");
      if (e.source === this.view && this.view.children.length > 0){
        this.calculatingHeight = true;
        var children = this.view.children;
        console.log("[InfiniScroll] - onPostLayout children length: ", children.length);
        for (var i = this.nextChild || 0, child; i < children.length; i++){
          child = children[i];
          this.height += parseInt(child.getSize().height) || 0;
          this.height += parseInt(child.getTop())         || 0;
          this.height += parseInt(child.getBottom())      || 0;
        }
        this.nextChild = children.length;
        this.triggerNewHeight();
      }
    },
    
    _onScroll: function(e){
      console.log("[InfiniScroll] - scrolling", e.y, this.triggerAt - this.view.size.height);
      if (this.scrollEndTriggered) return;
      // In case there was some scrolling while the handler was being removed
      if (this.isCalculatingHeight()) return;
      if (e.y >= this.triggerAt - this.view.size.height){
        this.scorllEndTriggered = true;
        this.view.removeEventListener('scroll', this.onScrollCurry);
        console.log("[InfiniScroll] - Trigger scroll to end");
        this.triggerScrollEnd(e.y);
      }
    }
  });
})();