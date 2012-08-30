
var $http = gb.utils.http
,   $ui = Titanium.UI;

GB.Views.add('stream', {
  destroyOnHide: true,
  
  limit: 15,
  page: 1,
  
  current: null,
  
  /**
   * Grab and store places location and initialize View.
   * @constructor
   */
  Constructor: function () {
    gb.utils.debug(gb.utils.getImage('screens/stream/Main.png'));
    var self = this;
    
    this.self = Titanium.UI.createView({
      backgroundColor: '#ddd'
    , width: $ui.FILL
    });
    
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
//     
    // Global Stream View
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
      , name: "Global Scroll"
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
      , name: "My Scroll"
      }
    );
    
    // No Tapins
    // this.noTapins = {
      // "base": $ui.createView({
        // width: $ui.FILL
      // , height: $ui.SIZE
      // , layout: 'vertical'
      // , left: '8dp'
      // , right: '8dp'
      // })
//       
    // , "submitTapinIdIsland": {
        // "base": $ui.createView(gb.utils.extend(
          // {}
        // , gb.style.get('common.grayPage.island.base')
        // ))
//       
      // , "shadow": $ui.createView(gb.style.get('common.grayPage.island.shadow'))
//       
      // , "fill": {
          // "base":  $ui.createView(gb.style.get('common.grayPage.island.fill'))
//           
        // , "wrapper": {
            // "base": $ui.createView(gb.style.get('common.grayPage.island.wrapper'))
//             
            // /**
             // * Header and sub-header
             // */
          // , "header:already": $ui.createLabel(gb.utils.extend(
              // { text: "You haven't Tapped In anywhere yet" }
            // , gb.style.get('enterTapinId.header:already')
            // , gb.style.get('common.grayPage.island.header1')
            // ))
//             
          // , "header:enter": $ui.createLabel(gb.utils.extend(
              // { text: "Press the button below to see our participating businesses" }
            // , gb.style.get('enterTapinId.header:enter')
            // , gb.style.get('common.grayPage.island.paragraph')
            // ))
// 
          // , "submitWrapper": {
              // "base": $ui.createView(gb.style.get('enterTapinId.form.submitWrapper'))
//             
            // , "submit": new GB.Button(
                // 'Participating Businesses'
              // , gb.style.get('enterTapinId.form.submit')
              // , gb.style.get('common.grayPage.island.buttons.gray')
              // , { events: { click: function(e){  } } }
              // ).views.base
            // }
          // }
        // }
      // }
    // };
    // gb.utils.compoundViews(this.noTapins);
    
    // Pull to Refresh
    // this.states.global.refresher = new GB.PullToRefresh(this.states.global.view.view, {
      // onLoad: function(done){
        // self.onRefresh(done);
      // }
    // });
    // this.states.my.refresher = new GB.PullToRefresh(this.states.my.view.view, {
      // onLoad: function(done){
        // self.onRefresh(done);
      // }
    // });
    
    this.scrollWrapper.add(this.states.global.view.view);
    this.scrollWrapper.add(this.states.my.view.view);
    this.self.add(this.nav.container);
    this.self.add(this.scrollWrapper);
    this.states.global.view.view.hide();
    this.states.my.view.view.hide();
    
    this.refreshButton = $ui.createLabel({
      width: '15dp'
    , height: '15dp'
    , text: 0xe14d
    , zIndex: 2000
    , top: 10
    , right: 10
    , color: '#fff'
    , borderWidth: 1
    });
    this.self.add(this.refreshButton);
    
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
    curr = curr[0].toUpperCase() + curr.substring(1);
    this["fetch" + curr + "Stream"](state.limit = 15, state.page = 0, function(error, data){
      if (error) return gb.utils.debug(error);
      if (!data) return gb.Views.show('stream-no-data');
      self.showItems(state.view.view, data);
      done();
    });
  },
  
  onShow: function () {
    var curr = this.current = this.current || 'global';
    if (this.states[this.current].hasData) return;
    this["show" + curr[0].toUpperCase() + curr.substring(1) + "View"]();
  },
  
  showGlobalView: function(){
    this.nav.global.activate();
    this.nav.my.deactivate();
    var self = this, state = this.states.global;
    gb.utils.debug("hiding MY view showing GLOBAL");
    this.states.my.view.hide();
    state.view.show();
    this.current = "global";
    if (state.hasData) return;
    gb.utils.debug("[stream view] - GLOBAL fetching data");
    this.fetchGlobalStream(state.limit, state.limit * state.page++, function(error, data){
      if (error) return gb.utils.debug(error);
      // if (!data) return gb.Views.show('stream-no-data');
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
    if (state.hasData) return;
    gb.utils.debug("[stream view] - MY - fetching data");
    this.fetchMyStream(state.limit, state.limit * state.page++, function(error, data){
      if (error) return gb.utils.debug(error);
      // if (!data) return gb.Windows.get('main').showPage('stream-no-data');
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
    console.log("[Stream View] - Adding to scroll view");
    scrollView.add(intermediate);
  },
  
  onScrollToEnd: function(fetchMe){
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
    gb.api.stream[fetchMe ? 'me' : 'global']({ limit: limit, skip: skip }, function(error, data){
      self.isFetching = false;
      callback(error, data);
    });
  }
});