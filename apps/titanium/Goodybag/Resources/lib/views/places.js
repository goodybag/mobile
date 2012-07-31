
var $http = gb.utils.http,
    $file = Titanium.Filesystem;


GB.Views.add('places', {
  self: Titanium.UI.createScrollView({
    top: '55dp'
  }),

  places: [],
  
  elements: {
    table: Ti.UI.createTableView({
      backgroundColor: '#ffffff'
    , borderColor: '#eeeeee'
    , separatorColor: '#eeeeee'
    , color: 'black'
    , top: 0
    })
  },
  
  /**
   * Grab storage file for places and update with latest data.
   */
  Constructor: function () {
    var $self = this;

    this.fetch(function (error, results) {
      $self.store.write(JSON.stringify(results));
    }, true);
  },
  
  onShow: function (context) {
    var $this = this, $self = this.self, $el = this.elements, $user = gb.consumer;
    
    console.log(JSON.stringify($self));

    $this.fetch(function (error, results) {
      var places = [], data = [], current, row;

      for (var i = 0; i < results.data.length; i++) {
        current = new GB.Models.Place(results.data[i]);
        
        row = current.toRow(function (e) {
          $this.onClick.apply(this, [ e ]);
        });
        
        places.push(row); 
        $this.places.push(current);
      }
      
      $el.table.setData(places);
      $self.add($el.table);
    }, true);
  },
  
  onClick: function (evnt) {
    console.log('clicked on ' + this.getName());
  },
  
  fetch: function (callback, download) {
    var limit = 1000, called = false;
    
    this.store = $file.getFile($file.applicationDataDirectory, 'places.json');
    
    if (this.store.exists()) {
      callback(null, JSON.parse(this.store.read()));
      called = true;
    }
    
    if (download) {
      $http.get(gb.config.api.participating + limit, function (error, results) {
        if (error) {
          if (!called) callback(error);
        } else {
          if (!called) callback(null, JSON.parse(results));
        }
      });
    }
  }
});