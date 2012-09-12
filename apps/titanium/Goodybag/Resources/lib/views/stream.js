
var $http = gb.utils.http
,   $ui = Titanium.UI;

GB.Views.add('stream', {
  destroyOnHide: true,
  
  limit: 15,
  page: 1,
  
  current: null,
  
  Constructor: function () {
    gb.utils.debug(gb.utils.getImage('screens/stream/Main.png'));
    var self = this;
    
    this.self = Titanium.UI.createView({
      backgroundColor: '#ddd'
    , width: $ui.FILL
    });
    
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
    this.self.add(this.noActivity.base);
    this.noActivity.base.hide();
    this.noActivtyShown = false;
    
    this.scrollWrapper = $ui.createView({
      top: 54
    , width: $ui.FILL
    , height: $ui.FILL
    , bottom: '44dp'
    , zIndex: 1
    });
    
    this.nav = {
      container: $ui.createView({
        layout: 'horizontal'
      , width: $ui.FILL
      , height: '44dp'
      , bottom: 0
      , backgroundImage: gb.utils.getImage("screens/stream/Menu.png")
      }),
      
      global: new GB.StreamButton('Global Activity'),
      my: new GB.StreamButton('My Activity')
    };
    
    this.states = {
      my: {
        limit: 15
      , page: 0
      , view: null
      , hasData: false
      },
      global: {
        limit: 15
      , page: 0
      , view: null
      , hasData: false
      }
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
    this.newHeightCurry = function(){
      if (self.loaderShowing) GB.Windows.get('main').hideLoader();
    };
    this.states.global.view = new gb.Views.InfiniScroll(
      {
        showVerticalScrollIndicator: true
      },
      {
        triggerAt: '82%'
      , onScrollToEnd: function(){
          gb.utils.debug("GLOBAl scroll to end");
          self.onScrollToEnd(false);
        }
      , onNewHeight: this.newHeightCurry
      , name: "Global Scroll"
      , refresher: true
      , onLoad: function(done){
          self.onRefresh(done);
        }
      }
    );
    
    // My Stream View
    this.states.my.view = new gb.Views.InfiniScroll(
      {
        showVerticalScrollIndicator: true
      },
      {
        triggerAt: '82%'
      , onScrollToEnd: function(){
          gb.utils.debug("MY scroll to end");
          self.onScrollToEnd(true);
        }
      , onNewHeight: this.newHeightCurry
      , name: "My Scroll"
      , refresher: true
      , onLoad: function(done){
          self.onRefresh(done);
        }
      }
    );

    this.scrollWrapper.add(this.states.global.view.view);
    this.scrollWrapper.add(this.states.my.view.view);
    this.self.add(this.nav.container);
    this.self.add(this.scrollWrapper);
    this.states.global.view.view.hide();
    this.states.my.view.view.hide();
    
    this.onDestroy = function(){
      this.self.remove(this.scrollWrapper);
      this.scrollWrapper = null;
      this.states = null;
      self = null;
    };
  },
  
  onRefresh: function (done) {
    var
      curr  = this.current = this.current || 'global'
    , state = this.states[curr]
    , self  = this
    ;
    gb.api.store.stream = {};
    curr = curr[0].toUpperCase() + curr.substring(1);
    state.view.clearChildren();
    this["fetch" + curr + "Stream"](state.limit = 15, state.page = 0, function(error, data){
      if (error) return gb.utils.debug(error);
      if (!data) return gb.Views.show('stream-no-data');
      console.log(data.length);
      self.showItems(state.view, data);
      done();
    });
  },
  
  onShow: function () {
    var curr = this.current = this.current || 'global';
    if (this.states[this.current].hasData) return;
    this.loaderShowing = true;
    this["show" + curr[0].toUpperCase() + curr.substring(1) + "View"]();
    var $this = this;
  },
  
  showNoActivity: function(){
    if (this.noActivityShown) return;
    this.scrollWrapper.hide();
    this.noActivity.base.show();
    this.noActivityShown = true;
  },
  
  hideNoActivity: function(){
    if (!this.noActivityShown) return;
    this.noActivity.base.hide();
    this.scrollWrapper.show();
    this.noActivityShown = false;
  },
  
  showGlobalView: function(){
    this.nav.global.activate();
    this.nav.my.deactivate();
    var self = this, state = this.states.global;
    gb.utils.debug("hiding MY view showing GLOBAL");
    this.states.my.view.hide();
    state.view.show();
    this.current = "global";
    if (state.hasData) return this.hideNoActivity();
    gb.utils.debug("[stream view] - GLOBAL fetching data");
    this.fetchGlobalStream(state.limit, state.limit * state.page++, function(error, data){
      if (error){
        GB.Windows.get('main').hideLoader();
        gb.utils.debug(error);
      }
      if (!data || data.length === 0){
        self.showNoActivity();
        return GB.Windows.get('main').hideLoader();
      }else if (self.noActivityShown) self.hideNoActivity();
      state.hasData = true;
      self.showItems(self.states.global.view, data);
    });
  },
  
  showMyView: function(){
    this.nav.global.deactivate();
    this.nav.my.activate();
    var self = this, state = this.states.my;
    this.states.global.view.hide();
    gb.utils.debug("hiding GLOBAL view showing MY");
    state.view.show();
    this.current = "my";
    if (state.hasData) return this.hideNoActivity();
    GB.Windows.get('main').showLoader();
    gb.utils.debug("[stream view] - MY - fetching data");
    this.fetchMyStream(state.limit, state.limit * state.page++, function(error, data){
      if (error){
        GB.Windows.get('main').hideLoader();
        gb.utils.debug(error);
      }
      if (!data || data.length === 0){
        self.showNoActivity();
        return GB.Windows.get('main').hideLoader();
      }else if (self.noActivityShown) self.hideNoActivity();
      state.hasData = true;
      if (data.length > 0) return self.showItems(state.view, data);
    });
  },
  
  showItems: function(scrollView, data){
    gb.utils.debug("[stream view] - show items");
    var intermediate = $ui.createView({ width: $ui.FILL, height: $ui.SIZE, layout: 'vertical' });
    for (var i = 0; i < data.length; i++){
      intermediate.add(
        GB.getActivityView(GB.Models.getActivity(data[i]))
      );
    }
    console.log("[Stream View] - Adding to scroll view", intermediate);
    scrollView.add(intermediate);
  },
  
  onScrollToEnd: function(fetchMe){
    GB.Windows.get('main').showLoader();
    gb.utils.debug("[stream view] - on scroll to end FETCHING NEW ITEMS")
    var self = this, state = this.states[fetchMe ? 'my' : 'global'];
    this.fetchStream(fetchMe, state.limit, state.limit * state.page++, function(error, data){
      if (error) return gb.utils.debug(error);
      self.showItems(fetchMe ? self.states.my.view : self.states.global.view, data);
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
    gb.api.stream[fetchMe ? 'my' : 'global']({ limit: limit, skip: skip }, function(error, data){
      self.isFetching = false;
      if (typeof callback === "function") callback(error, data);
    });
  }
});