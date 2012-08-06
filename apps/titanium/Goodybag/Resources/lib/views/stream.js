
var $http = gb.utils.http
,   $ui = Titanium.UI;

GB.Views.add('stream', {
  self: Titanium.UI.createView({
    top: '55dp'
  , contentWidth:'auto'
  , contentHeight:'auto'
  , layout: "vertical"
  , showVerticalScrollIndicator: false
  , showHorizontalScrollIndicator: true
  }),
  
  wrapper: $ui.createScrollView({
    layout: 'vertical'
  , height: 'auto'
  , top: 0
  }),
  
  elements: {
    
  },
  
  /**
   * Grab and store places location and initialize View.
   * @constructor
   */
  Constructor: function () {
    this.self.add(this.wrapper);
    this.wrapper.add($ui.createView({
      width: '100%'
    , height: '1dp'
    }))
  },
  
  onShow: function() {
    var self = this;
    $http.get('http://www.goodybag.com/api/consumers/streams?limit=15&offset=0', function(error, data){
      if (error) return console.log(error);
      data = JSON.parse(data);
      data = data.data;
      if (!data.length){
        gb.Views.show('stream-no-data');
      }
      var options = {};
      for (var i = 0; i < data.length; i++){
        if (i === (data.length - 1)) options.suppressBorder = true;
        self.wrapper.add(
          new GB.Views.ActivityView(
            new GB.Models.Activity(data[i])
          , options
          ).render().view
        );
      }
      self.wrapper.add($ui.createView({
        text: "Just Testing"
      }));
    });
  },
  
  fetchStream: function(cb){
    $http.get('http://www.goodybag.com/api/consumers/streams?limit=15&offset=0', function(error, data){
      if (error) return console.log(error);
      data = JSON.parse(data);
    });
  }
});