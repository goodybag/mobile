
var $http = gb.utils.http
,   $ui = Titanium.UI;

GB.Views.add('stream', {
  self: Titanium.UI.createScrollView({
    top: '55dp'
  , text: "just testing"
  }),
  
  /**
   * Grab and store places location and initialize View.
   * @constructor
   */
  Constructor: function () {
    
  },
  
  onShow: function() {
    // var self = this;
    // $http.get('http://goodybag.com/api/consumers/streams', function(error, data){
      // if (error) return console.log(error);
      // console.log("DATA");
      // data = JSON.parse(data);
      // console.log(data);
      // for (var i = 0; i < data.length; i++){
        // self.self.add(
          // new GB.Views.ActivityView(
            // new GB.Models.Activity(data)
          // ).render().view
        // );
      // }
    // });
  }
});