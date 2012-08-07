
var $http = gb.utils.http
,   $ui = Titanium.UI;

GB.Views.add('stream', {
  self: Titanium.UI.createView({
    top: '55dp'
  , layout: "vertical"
  }),
  
  limit: 15,
  page: 1,
  
  current: 'global',
  
  /**
   * Grab and store places location and initialize View.
   * @constructor
   */
  Constructor: function () {
    var self = this;
    
    // Nav Group
    this.nav = $ui.createView({
      layout: 'horizontal'
    , width: $ui.FILL
    // , height: $ui.SIZE
    , bottom: 0
    });
    this.navGlobal = $ui.createButton({
      title: 'Global Activity'
    });
    this.navMy = $ui.createButton({
      title: 'My Activity'
    });
    this.navGlobal.addEventLisntener('click', function(e){
      if (self.current !== "global") self.showGlobalView();
    });
    this.navMy.addEventLisntener('click', function(e){
      if (self.current !== "my") self.showMyView();
    });
    this.nav.add(this.navGlobal);
    this.nav.add(this.navMy);
    
    // Global Stream View
    this.globalView = new gb.Views.InfiniScroll(
      {
        showVerticalScrollIndicator: true
      },
      {
        triggerAt: '82%'
      , onScrollToEnd: function(){
          self.onScrollToEnd(false);
        }
      }
    );
    
    // My Stream View
    this.myView = new gb.Views.InfiniScroll(
      {
        showVerticalScrollIndicator: true
      },
      {
        triggerAt: '82%'
      , onScrollToEnd: function(){
          self.onScrollToEnd(true);
        }
      }
    );
    
    this.globalView.view.hide();
    this.myView.view.hide();
    
    this.self.add(this.globalView.view);
    this.self.add(this.myView.view);
    this.self.add(this.nav);
  },
  
  onShow: function () {
    this["show" + this.current[0].toUppercase() + this.current.substring(1) + "View"]();
  },
  
  showGlobalView: function(){
    var self = this;
    this.globalView.view.show();
    if (this.globalView.view.children.length !== 0) return;
    console.log("[stream view] - fetching data");
    this.fetchGlobalStream(function(error, data){
      if (error) return console.log(error);
      if (!data) return gb.Views.show('stream-no-data');
      self.showItems(this.globalView.view, data);
    });
  },
  
  showMyView: function(){
    var self = this;
    this.myView.view.show();
    if (this.myView.view.children.length !== 0) return;
    console.log("[stream view] - fetching data");
    this.fetchMyStream(function(error, data){
      if (error) return console.log(error);
      if (!data) return gb.Views.show('stream-no-data');
      self.showItems(this.myView.view, data);
    });
  },
  
  showItems: function(scrollView, data){
    console.log("[stream view] - show items");
    var options = {}, view;
    for (var i = 0; i < data.length; i++){
      view = data[i];
      // Suppress border isn't working yet for some reason. However, if it were
      // working, then when we load in new items, we'd ahve to keep track of the
      // last item so that we can add a border to the view when it's no longer
      // the last item.
      if (i === (data.length - 1)) options.suppressBorder = true;
      console.log("adding item", i);
      scrollView.add(new GB.Views.ActivityView(
        new GB.Models.Activity(data[i])
      , options
      ).render().view);
    }
  },
  
  onScrollToEnd: function(fetchMe){
    console.log("[stream view] - on scroll to end FETCHING NEW ITEMS")
    var self = this;
    this.fetchStream(fetchMe, this.limit, this.limit * ++this.page, function(error, data){
      if (error) return console.log(error);
      self.showItems(data);
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
    var self = this;
    if (typeof limit === "function"){
      cb = limit;
      limit = 15;
      skip = 0;
    }

    $http.get.sessioned(
      'http://www.goodybag.com/api/consumers' + (fetchMe ? '/me/' : '') + '/streams'
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