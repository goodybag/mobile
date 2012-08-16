
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
    this.self.add($ui.createLabel({
      width: $ui.FILL
    , height: $ui.SIZE
    , color: gb.ui.color.base
    , font: {
        fontSize: 14
      }
    , text: "There doesn't seem to be anything going on here :/"
    }));
  }
});