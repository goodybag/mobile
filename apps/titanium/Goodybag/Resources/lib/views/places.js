!(function(gb, $http, $file) {
  gb.Views.add('places', {
    self: Titanium.UI.createScrollView({
      top: '55dp'
    }),

    places: [],
    
    elements: {
      row: Ti.UI.createTableViewRow({
        color: "black"
      , borderColor: "#ece"
      , background: 'white'
      , hasChild: true
      , className: 'place' // Used for Performance Reasons.
      }),
      
      table: Ti.UI.createTableView({
        data: LocationData
      , backgroundColor: '#ffffff'
      , borderColor: '#eeeeee'
      , separatorColor: '#eeeeee'
      , color: 'black'
      , top: 0
      , minRowHeight: 40
      })
    },
    
    /**
     * Grab storage file for places and update with latest data.
     */
    Constructor: function () {
      var $self = this;
      
      this.fetch(function (error, results) {
        var i = 0;

        if(results.data.length > 1)
          for (i = 0, i < results.data.length; i++) 
            $self.places.push(new Place(results.data[i]));
      }, 1000);
    },
    
    onShow: function (context) {
      var $self = this.self, $el = this.elements, $user = gb.consumer;
      console.log(this.places);
    },
    
    fetch: function (callback, page) {
      var limit = 30, skip = page * limit;
      
      this.store = $file.getFile($file.applicationDataDirectory, 'places.json');
      
      if(this.store.exists()) {
        callback(null, JSON.parse(this.store.read().text()));
      }
      
      $http.get(gb.config.api.participating + limit + '&skip=' + skip, function (error, results) {
        if(error) {
          callback(error);
        } else {
          callback(null, JSON.parse(results));
        }
      });
    },
    
    createLocation: function () {
      
    },
    
    clickLocation: function (e) {
      
    }
  });
})(
  gb,
  gb.utils.http,
  Titanium.Filesystem
);
