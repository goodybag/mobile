
var $http = gb.utils.http
,   $ui = Titanium.UI;

GB.Views.add('stream-no-data', {
  self: Titanium.UI.createView({
    top: '55dp'
  }),
  
  /**
   * Grab and store places location and initialize View.
   * @constructor
   */
  Constructor: function () {
    this.self.add(gb.ui.header1("There doesn't seem to be any activity"));
  }
});