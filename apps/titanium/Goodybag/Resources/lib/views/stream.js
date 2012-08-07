
var $http = gb.utils.http
,   $ui = Titanium.UI;

GB.Views.add('stream', {
  self: Titanium.UI.createView({
    top: '55dp'
  , layout: "vertical"
  }),
  
  limit: 15,
  page: 1,
  
  /**
   * Grab and store places location and initialize View.
   * @constructor
   */
  Constructor: function () {
    var self = this;
    this.scrollView = new gb.Views.InfiniScroll({
      showVerticalScrollIndicator: true
    },
    {
      triggerAt: '82%'
    , onScrollToEnd: function(done){
        self.onScrollToEnd(done);
      }
    });
    this.self.add(this.scrollView.view);
  },
  
  onShow: function () {
    var self = this;
    if (this.scrollView.view.children.length !== 0) return;
    console.log("[stream view] - fetching data");
    this.fetchStream(function(error, data){
      if (error) return console.log(error);
      if (!data) return gb.Views.show('stream-no-data');
      self.showItems(data);
    });
    setTimeout(function(){
      setTimeout(function(){
        console.log("going back");
        GB.Views.show('stream');
      }, 5000);
      console.log("show new page");
      GB.Views.show('stream-no-data');
    }, 8000);
  },
  
  showItems: function(data){
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
      this.scrollView.add(new GB.Views.ActivityView(
        new GB.Models.Activity(data[i])
      , options
      ).render().view);
    }
  },
  
  onScrollToEnd: function(){
    console.log("[stream view] - on scroll to end FETCHING NEW ITEMS")
    var self = this;
    this.fetchStream(this.limit, this.limit * ++this.page, function(error, data){
      if (error) return console.log(error);
      self.showItems(data);
    });
  },
  
  fetchStream: function(limit, skip, cb){
    if (this.isFetching) return;
    this.isFetching = true;
    var self = this;
    if (typeof limit === "function"){
      cb = limit;
      limit = 15;
      skip = 0;
    }

    $http.get.sessioned(
      'http://www.goodybag.com/api/consumers/streams?limit=' + limit + '&offset=' + skip
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