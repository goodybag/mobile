



var win = Ti.UI.createWindow({ backgroundColor: 'white' });
var row = Ti.UI.createView({
  layout: 'horizontal'
, width: Ti.UI.FILL
, height: "100dp"
, background:  "#fff"
});
row.add(Ti.UI.createLabel({
  width: Ti.UI.SIZE
, height: Ti.UI.SIZE
, top: 0
, textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT
, text: 'I am just testing this stuff'
}));
row.add(Ti.UI.createLabel({
  width: Ti.UI.FILL
, height: Ti.UI.SIZE
, top: 0
, color: "pink"
, textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT
, text: ' to see if it wraps correctly'
}));
win.add(row);
win.open();



// App Namespacing.
/*var gb = {}, GB = gb;

console.log(Ti.Platform.displayCaps.density);
console.log(Ti.Platform.displayCaps.dpi);
console.log(Ti.Platform.displayCaps.platformWidth);

var testActivity = {
  "data":{
    "amount":0.05
  },
  "_id":"4fd4b9809c0886ea0700887b",
  "events":[
    "fundsDonated"
  ],
  "when":"2012-06-10T15:13:00.658Z",
  "feedSpecificData":{
    "involved":{
      "charity":{
        "type":"business",
        "id":"4f512cf31ce79ee36e00000f",
        "name":"Austin Children's Shelter"
      }
    }
  },
  "dates":{
    "lastModified":"2012-06-10T15:13:04.653Z",
    "created":"2012-06-10T15:13:04.653Z"
  },
  "what":{
    "id":"4fd4b97e9c0886ea07008878",
    "type":"donationLog"
  },
  "who":{
    "id":"4f373ad3c7f60c96120003c3",
    "type":"consumer",
    "name":"John Fawcett",
    "screenName":"john.awesome"
  }
};

var moment = require('lib/core/moment');


// Common JS Requires, Very Useful stuff.
Ti.include('lib/core/components/class.js');
Ti.include('lib/core/config.js');
Ti.include('lib/core/utils.js');
Ti.include('lib/core/aes.js');

gb.streamParser = require('lib/core/stream-parser');

// Components
Ti.include('lib/core/components/ui.js');
Ti.include('lib/core/components/view.js');
Ti.include('lib/core/components/window.js');
Ti.include('lib/core/components/qrcode.js');
Ti.include('lib/core/components/infini-scroll.js');

gb.qrcode = QRCode({
  typeNumber: 4,
  errorCorrectLevel: 'M'
});

// Models
Ti.include('lib/models/user.js');
Ti.include('lib/models/place.js')
Ti.include('lib/models/activity.js');

// Create our User
gb.consumer = new GB.Models.User();

// Views
Ti.include('lib/views/login.js');
Ti.include('lib/views/main.js');

// Do Authentication Check
gb.consumer.validate(function (consumer) {
  if (consumer != null) {
    gb.consumer = consumer;
    GB.Windows.show('main');
    gb.consumer.renew();
  } else {
    GB.Windows.show('login');
  }
});*/
