
var $http = gb.utils.http
,   $ui = Titanium.UI;

GB.Views.add('stream', {
  destroyed: false,
  loaderShowing: false,
  noActivityShown: false,
  limit: 15,
  page: 1,
  current: null,
  states: {
    my: {
      limit: 15,
      page: 0,
      view: null,
      hasData: false,
      loaded: false
    },
    
    global: {
      limit: 15,
      page: 0,
      view: null,
      hasData: false,
      loaded: false
    }
  },
  
  Constructor: function () {
    var self = this;
    
    this.self = gb.style.get('stream.base');
    
    this.noActivity = {
      "base": $ui.createView(gb.style.get('common.grayPage.island.base', { left: 10, right: 10 }))
    , "shadow": $ui.createView(gb.style.get('common.grayPage.island.shadow'))
    , "fill": {
        "base": $ui.createView(gb.style.get('common.grayPage.island.fill'))
      , "wrapper": {
          "base": $ui.createView(gb.style.get('common.grayPage.island.wrapper'))
        , "header": $ui.createLabel(gb.style.get('common.grayPage.island.header1', {
            text: "There is no activity :("
          , top: 51
          , bottom: 38
          , textAlign: "center"
          }))
        }
      }
    };
    
    gb.utils.compoundViews(this.noActivity);
    
    this.nav = {
      container: gb.style.get('nearby.menu.base'),
      global: new GB.StreamButton('Global Activity'),
      my: new GB.StreamButton('My Activity')
    };
    
    // Nav Group
    this.nav.global.addEventListener('click', function(e){
      gb.utils.debug("current: ", self.current);
      if (self.current !== "global") self.showGlobalView();
    });
    
    this.nav.my.addEventListener('click', function(e){
      gb.utils.debug("current: ", self.current);
      if (self.current !== "my") self.showMyView();
    });
    
    // Top property isn't working for padding in nav view, so add a filler
    this.nav.container.add($ui.createView({ width: $ui.FILL, height: '6dp'}));
    this.nav.container.add(this.nav.global.base);
    this.nav.container.add(this.nav.my.base);

    // Global Stream View
    this.newHeightCurry = function () {
      if (self && self.loaderShowing) 
        GB.Windows.get('main').hideLoader();
    };
    
    this.states.global.view = new gb.Views.InfiniScroll({
        showVerticalScrollIndicator: true,
        backgroundColor: '#ddd',
        height: $ui.SIZE
      }, {
        triggerAt: '82%'
      , onScrollToEnd: function (y, s, callback) {
          gb.utils.debug("GLOBAl scroll to end");
          self.onScrollToEnd(false, callback);
        }
      , onNewHeight: this.newHeightCurry
      , name: "Global Scroll"
      , refresher: true
      , onLoad: function (done) {
          if (self) self.onRefresh(done);
          else GB.Views.get('stream').onRefresh(done);
        }
      }
    );
    
    // My Stream View
    this.states.my.view = new gb.Views.InfiniScroll({
        showVerticalScrollIndicator: true,
        backgroundColor: '#ddd'
      }, {
        triggerAt: '82%'
      , onScrollToEnd: function (y, s, callback) {
          gb.utils.debug("MY scroll to end");
          self.onScrollToEnd(true, callback);
        }
      , onNewHeight: this.newHeightCurry
      , name: "My Scroll"
      , refresher: true
      , onLoad: function(done){
          if (self) self.onRefresh(done);
          else GB.Views.get('stream').onRefresh(done);
        }
      }
    );
  },
  
  onRefresh: function (done) {
    var curr  = this.current = this.current || 'global'
    state = this.states[curr],
    self  = this;
    
    GB.Windows.get('main').showLoader();
    
    gb.api.store.stream = {};
    curr = curr[0].toUpperCase() + curr.substring(1), state.view.clearChildren();
    
    this["fetch" + curr + "Stream"](state.limit = 15, state.page = 0, function(error, data){
      if (error) return done(), gb.utils.debug(error);
      if (!data) return done(), gb.Views.show('stream-no-data');
      self.showItems(state, data);
      done();
    });
  },
  
  onShow: function () {
    var curr = this.current = this.current || 'global';
    if (!this.scrollWrapper) this.scrollWrapper = gb.style.get('stream.holder');
    if (this.states[this.current].hasData) return GB.Windows.get('main').hideLoader();
    this.loaderShowing = true;
    this["show" + curr[0].toUpperCase() + curr.substring(1) + "View"]();
    var $this = this;
  },
  
  showNoActivity: function(){
    if (this.noActivityShown) return;
    if (this.scrollWrapper) this.scrollWrapper.hide();
    this.self.add(this.noActivity.base);
    this.noActivityShown = true;
  },
  
  hideNoActivity: function(){
    if (!this.noActivityShown) return;
    this.self.remove(this.noActivity.base);
    this.noActivityShown = false;
  },
  
  showGlobalView: function () {
    // Deactivate buttons
    this.nav.global.activate(),  this.nav.my.deactivate();
    
    // Initialize  variables
    var self = this, state = this.states.global;
    
    gb.utils.debug("[STREAM] Hiding MY view, showing GLOBAL view.");
    
    // Close states
    this.states.my.view.hide(), state.view.show();
    this.current = "global";
    
    if (state.hasData && this.noActivityShown) 
      this.hideNoActivity(), this.scrollWrapper.show();
    
    gb.utils.debug("[STREAM] Adding items to GLOBAL view.");
    
    this.fetchGlobalStream(state.limit, state.limit * state.page++, function (error, data) {
      if (error) GB.Windows.get('main').hideLoader(), gb.utils.debug(error);
      
      if (!data || data.length === 0) {
        self.showNoActivity();
        return GB.Windows.get('main').hideLoader();
      } else if (self.noActivityShown) 
        self.hideNoActivity();
      
      state.hasData = true;
      if (data.length > 0) return self.showItems(state, data);
    });
  },
  
  showMyView: function(){
    // Deactivate buttons
    this.nav.global.deactivate(), this.nav.my.activate();
    
    // Initialize Variables
    var self = this, state = this.states.my;
    
    gb.utils.debug("[STREAM] Hiding global view, showing my view.");
    
    // Hide global view
    this.states.global.view.hide(), state.view.show();
    this.current = "my";
    
    // Manage no activity screens, data management, and destruction.
    if (state.hasData && this.noActivityShown) 
      this.hideNoActivity(), this.scrollWrapper.show();
    
    // Show Loader
    GB.Windows.get('main').showLoader();
    
    gb.utils.debug("[STREAM] Adding items to MY view.");
    
    this.fetchMyStream(state.limit, state.limit * state.page++, function (error, data) {
      if (error) GB.Windows.get('main').hideLoader(), gb.utils.debug(error);
      
      if (!data || data.length === 0) {
        self.showNoActivity();
        return GB.Windows.get('main').hideLoader();
      } else if (self.noActivityShown) 
        self.hideNoActivity();
      
      state.hasData = true;
      if (data.length > 0) return self.showItems(state, data);
    });
  },
  
  showItems: function (scroller, data, callback) {
    var intermediate = $ui.createView({ 
      width: $ui.FILL, 
      height: $ui.SIZE, 
      layout: 'vertical'
    });
    
    gb.utils.debug('[STREAM] Looping through data, adding to middle-man view.');
    
    for (var i = 0; i < data.length; i++)
      intermediate.add(GB.getActivityView(GB.Models.getActivity(data[i])));
    
    gb.utils.debug('[STREAM] Adding middle-man to state.');  
    scroller.view.add(intermediate);
    
    gb.utils.debug('[STREAM] Checking loaded values.')
    if (!scroller.loaded) {
      gb.utils.debug('[STREAM] Adding state view to scrollWrapper');
      this.scrollWrapper.add(scroller.view.view);
      
      if (!this.preloaded) {
        if (!this.preloaded) this.self.add(this.nav.container),
        gb.utils.debug('[STREAM] Adding navigation container to main view.');
        this.self.add(this.scrollWrapper),
        gb.utils.debug('[STREAM] Adding scrollWrapper to main view.');
        if (!this.preloaded) this.preloaded = true, gb.utils.debug('[STREAM] Preloaded is now true.');
      }
      
      scroller.loaded = true;
    }
    
    GB.Windows.get('main').hideLoader();
    if (typeof callback === 'function') callback();
  },
  
  onScrollToEnd: function (fetchMe, callback) {
    GB.Windows.get('main').showLoader();
    gb.utils.debug("[STREAM] Scrolled to end of view, fetching new items.")
    var $this = this, $state = this.states[fetchMe ? 'my' : 'global'];
    this.fetchStream(fetchMe, $state.limit, $state.limit * $state.page++, function (error, data) {
      if (error) return gb.utils.debug(error), callback();
      if ($this && $state) $this.showItems($state, data, callback);
      else return gb.utils.debug('[STREAM] Could not load due to state && this being undefined'), callback();
    });
  },
  
  
  fetchGlobalStream: function(limit, skip, cb){
    this.fetchStream(false, limit, skip, cb);
  },
  
  fetchMyStream: function(limit, skip, cb){
    this.fetchStream(true, limit, skip, cb);
  },
  
  fetchStream: function(fetchMe, limit, skip, callback){
    if (this.isFetching) return;
    this.isFetching = true;
    var self = this;
    if (typeof limit === "function"){
      callback  = limit;
      limit     = 15;
      skip      = 0;
    }
    
    gb.api.stream[fetchMe ? 'my' : 'global']({ limit: limit, offset: skip }, function(error, data){
      self.isFetching = false;
      if (typeof callback === "function") callback(error, data);
    });
  }
});