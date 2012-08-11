/**
 * PullToRefresh -
 * Generalized version of https://github.com/appcelerator/titanium_mobile/blob/master/demos/KitchenSink/Resources/examples/table_view_pull_to_refresh.js
 * 
 */

(function(){
  var $ui = Titanium.UI;
  
  var constructor = function(scrollView, options){
    /**
     * Defaults
     * 
     * - **backgroundColor**  {String} - Hex or shorthand value for background color
     * - **height**           {Unit}   - Height of the Pull to refresh view
     */
    this.options = {
      backgroundColor: '#e2e7ed'
    , width: $ui.FILL
    , height: '170dp' // Probably sufficiently tall
    , perceivedHeight: 60
    , defaultText: "Pull down to refresh"
    , pullingText: "Release to refresh"
    , reloadText: "Reloading..."
    , onLoad: function(done){
        setTimeout(function(){
          done();
        }, 2000);
      }
    };
    
    for (var key in options){
      this.options[key] = options[key];
    }
    
    this.perceivedHeight = this.options.perceivedHeight;
    
    // Handle state
    this.pulling = false;
    this.reloading = false;
    
    this.views = {
      base: $ui.createView({
        backgroundColor: this.options.backgroundColor
      , width: this.options.width
      , height: this.options.height
      , layout: 'vertical'
      , top: -parseInt(this.options.height) + 'dp'
      })
      
    , filler: $ui.createView({
        width: $ui.FILL
      , height: '99dp'
      })
      
    , wrapper: $ui.createView({
        width: $ui.FILL
      , height: $ui.SIZE
      , layout: 'horizontal'
      , bottom: 0
      })
      
    , arrow: $ui.createView({
        backgroundImage: 'lib/core/components/pull-to-refresh/images/white-arrow.png'
      , width: '23dp'
      , height: '60dp'
      , bottom: '10dp'
      , left: '20dp'
      })
      
    , textWrapper: $ui.createView({
        width: $ui.FILL
      , height: $ui.SIZE
      , layout: 'vertical'
      , bottom: '10dp'
      })
      
    , status: $ui.createLabel({
        text: this.options.defaultText
      , width: $ui.FILL
      , height: $ui.SIZE
      , color: "#576c89"
      , textAlign: "center"
      , font: { fontSize: 13, fontWeight: "bold" }
      , shadowColor: "#fff"
      , shadowOffset: { x: 0, y: 1 }
      })
      
    , date: $ui.createLabel({
        text: "Last Updated: " + this.getDateStr()
      , width: $ui.FILL
      , height: $ui.SIZE
      , top: '2dp'
      , color: "#576c89"
      , textAlign: "center"
      , font: { fontSize: 12 }
      , shadowColor: "#fff"
      , shadowOffset: { x: 0, y: 1 }
      })
      
    , activityIndicator: $ui.createActivityIndicator({
        width: 20
      , height: 20
      , bottom: 13
      })
      
    , border: $ui.createView({
        width: $ui.FILL
      , height: '2dp'
      , backgroundColor:"#576c89"
      })
    };
    
    this.views.textWrapper.add(this.views.status);
    this.views.textWrapper.add(this.views.date);
    this.views.wrapper.add(this.views.arrow);
    this.views.wrapper.add(this.views.activityIndicator);
    this.views.wrapper.add(this.views.textWrapper);
    this.views.wrapper.add(this.views.border);
    this.views.base.add(this.views.filler);
    this.views.base.add(this.views.wrapper);
    this.setScrollView(scrollView);
  };
  constructor.prototype = {
    /**
     * Sets the scroll view for the instance to use and delegates events
     * @param {Object} scrollView
     */
    setScrollView: function(scrollView){
      this.log("setting scroll view", scrollView);
      // If we had a previous scroll view, remove the pull to refresh
      if (this.scrollView){
        this.log('removing base view');
        this.views.base.remove();
      }
      this.scrollView = scrollView;
      this.log('scrollview set, add refresher to scrollview');
      this.scrollView.add(this.views.base);
      this.log('refresher added, registering events');
      this.registerEvents();
    }
    /**
     * Registers the events needed if the scroll view changes
     */
  , registerEvents: function(){
      var $this = this;
      this.scrollView.addEventListener('scroll', function(e){
        $this._onScroll(e);
      });
      this.scrollView.addEventListener('dragEnd', function(e){
        $this._onDragEnd(e);
      });
      this.log('events added!');
    }
  , enterPullMode: function(){
      this.pulling = false;
      var t = Ti.UI.create2DMatrix();
      this.views.arrow.animate({ transform: t, duration: 180 });
      this.views.status.setText(this.options.defaultText);
    }
  , enterReleaseMode: function(){
      this.log("entering release mode");
      var t = Ti.UI.create2DMatrix();
      t = t.rotate(-180);
      this.pulling = true;
      this.views.arrow.animate({ transform: t, duration: 180 });
      this.views.status.setText(this.options.pullingText);
    }
  , enterLoadingMode: function(){
      var views = this.views, currScroll = this.offset, scrollInterval, $this = this;
      this.scrollView.scrollTo(0, currScroll);
      this.reloading = true;
      this.pulling = false;
      views.arrow.hide();
      views.activityIndicator.show();
      views.status.setText(this.options.reloadText);
      scrollInterval = setInterval(function(){
        console.log(currScroll)
        if (currScroll >= -$this.perceivedHeight) clearInterval(scrollInterval);
        else $this.scrollView.scrollTo(0, ++currScroll);
      }, 2);
      views.arrow.transform = Ti.UI.create2DMatrix();
    }
  , getDateStr: function(){
      var date = new Date(), dateStr = date.getMonth() + '/' + date.getDate() + '/' + date.getFullYear();
      if (date.getHours() >= 12){
        dateStr += ' ' + (date.getHours() == 12 ? date.getHours() : date.getHours() - 12)
                       + ':' + date.getMinutes() +' PM';
      }else{
        datestr += ' ' + date.getHours() + ':' + date.getMinutes() + ' AM';
      }
      return dateStr;
    }
    
  , _onDoneLoading: function(){
      this.reloading = false;
      var views = this.views, currScroll = -this.perceivedHeight, scrollDownInterval, $this = this;
      views.date.setText("Last Updated: " + this.getDateStr());
      views.status.setText(this.options.defaultText);
      views.activityIndicator.hide();
      views.arrow.show();
      scrollDownInterval = setInterval(function(){
        if (currScroll >= 0) clearInterval(scrollDownInterval);
        else $this.scrollView.scrollTo(0, ++currScroll);
      }, 2);
    }
  , _onScroll: function(e){
      this.offset = e.y;
      this.log(this.offset, (-this.perceivedHeight - 5));
      if (this.offset < (-this.perceivedHeight - 5) && !this.pulling && !this.reloading){
        this.enterReleaseMode();
      }
      else if ((this.offset > (-this.perceivedHeight - 5) && this.offset < 0 ) && this.pulling && !this.reloading){
        this.enterPullMode();
      }
    }
  , _onDragEnd: function(e){
      console.log(e);
      this.log("on drag end!", e.y);
      if (this.pulling && !this.reloading){
        var $this = this;
        this.enterLoadingMode(e.y);
        // Bind hasn't been working for me, so we'll curry
        this.options.onLoad(function(done){
          $this._onDoneLoading();
        });
      }
    }
  , log: function(msg, other){
      console.log("[PullToRefresh] - " + msg, other);
    }
  };
  GB.PullToRefresh = constructor;
  exports = constructor;
})();

