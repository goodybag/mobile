
var $http = gb.utils.http
,   $ui = Titanium.UI;

GB.Views.add('stream', {
  self: Titanium.UI.createView({
    top: '54dp'
  , backgroundColor: '#ddd'
  , width: $ui.FILL
  }),
  
  scrollWrapper: $ui.createView({
    top: 0
  , width: $ui.FILL
  , height: $ui.FILL
  , bottom: '44dp'
  }),
  
  nav: {
    container: $ui.createView({
      layout: 'horizontal'
    , width: $ui.FILL
    , height: '44dp'
    , bottom: 0
    , backgroundImage: gb.utils.getImage("screens/stream/Menu.png")
    }),
    
    global: new GB.StreamButton('Global Activity'),
    my: new GB.StreamButton('My Activity')
  },
  
  states: {
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
  },
  
  limit: 15,
  page: 1,
  
  current: null,
  
  /**
   * Grab and store places location and initialize View.
   * @constructor
   */
  Constructor: function () {
    console.log(gb.utils.getImage('screens/stream/Main.png'));
    var self = this;
    
    // Nav Group
    this.nav.global.addEventListener('click', function(e){
      console.log("current: ", self.current);
      if (self.current !== "global") self.showGlobalView();
    });
    this.nav.my.addEventListener('click', function(e){
      console.log("current: ", self.current);
      if (self.current !== "my") self.showMyView();
    });
    // Top property isn't working for padding in nav view, so add a filler
    this.nav.container.add($ui.createView({ width: $ui.FILL, height: '6dp'}));
    this.nav.container.add(this.nav.global.base);
    this.nav.container.add(this.nav.my.base);
    
    // Global Stream View
    this.states.global.view = new gb.Views.InfiniScroll(
      {
        showVerticalScrollIndicator: true
      },
      {
        triggerAt: '82%'
      , onScrollToEnd: function(){
          console.log("GLOBAl scroll to end");
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
          console.log("MY scroll to end");
          self.onScrollToEnd(true);
        }
      , name: "My Scroll"
      }
    );
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
  },
  
  onRefresh: function (done) {
    var
      curr  = this.current = this.current || 'global'
    , state = this.states[curr]
    , self  = this
    ;
    curr = curr[0].toUpperCase() + curr.substring(1);
    this["fetch" + curr + "Stream"](state.limit = 15, state.page = 0, function(error, data){
      if (error) return console.log(error);
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
    var self = this, state = this.states.global;
    console.log("hiding MY view showing GLOBAL");
    this.states.my.view.hide();
    state.view.show();
    this.current = "global";
    this.nav.global.activate();
    this.nav.my.deactivate();
    if (state.hasData) return;
    console.log("[stream view] - GLOBAL fetching data");
    this.fetchGlobalStream(state.limit, state.limit * state.page++, function(error, data){
      if (error) return console.log(error);
      if (!data) return gb.Views.show('stream-no-data');
      state.hasData = true;
      self.showItems(self.states.global.view.view, data);
    });
  },
  
  showMyView: function(){
    var self = this, state = this.states.my;
    this.states.global.view.hide();
    console.log("hiding GLOBAL view showing MY");
    state.view.show();
    this.current = "my";
    this.nav.global.deactivate();
    this.nav.my.activate();
    if (state.hasData) return;
    console.log("[stream view] - MY - fetching data");
    this.fetchMyStream(state.limit, state.limit * state.page++, function(error, data){
      if (error) return console.log(error);
      if (!data) return gb.Views.show('stream-no-data');
      state.hasData = true;
      self.showItems(state.view.view, data);
    });
  },
  
  showItems: function(scrollView, data){
    console.log("[stream view] - show items");
    for (var i = 0; i < data.length; i++){
      scrollView.add(
        new GB.Views.Activity(
          new GB.Models.Activity(data[i])
        ).views.base
      );
    }
  },
  
  onScrollToEnd: function(fetchMe){
    console.log("[stream view] - on scroll to end FETCHING NEW ITEMS")
    var self = this, state = this.states[fetchMe ? 'my' : 'global'];
    this.fetchStream(fetchMe, state.limit, state.limit * state.page++, function(error, data){
      if (error) return console.log(error);
      self.showItems(fetchMe ? self.states.my.view : self.states.global.view, data);
    });
  },
  
  fetchGlobalStream: function(limit, skip, cb){
    this.fetchStream(false, limit, skip, cb);
  },
  
  fetchMyStream: function(limit, skip, cb){
    this.fetchStream(true, limit, skip, cb);
  },
  
  fetchStream: function(fetchMe, limit, skip, cb){
    if (this.isFetching) return;
    this.isFetching = true;
    var self = this, url = fetchMe ? gb.config.api.stream.me : gb.config.api.stream.global;
    if (typeof limit === "function"){
      cb = limit;
      limit = 15;
      skip = 0;
    }
    
    // test data
    // self.isFetching = false;
    // cb(null, streamData);
    // return;
    // Test DAta
    
    $http.get.sessioned(
      url
    + '?limit='   + limit
    + '&offset='  + skip
    , gb.consumer.session
    , function(error, data){
        if (error) return console.log(error);
        data = JSON.parse(data);
        self.isFetching = false;
        cb(data.error, data.data);
      }
    );
  }
});