// App and References
var gb = {}
,   GB = gb
,   $ui = Titanium.UI
,   $dp = Titanium.Platform.displayCaps
,   $prop = Titanium.App.Properties;

var streamData = [{"data":{"donationAmount":5,"charity":{"type":"charity","id":"4f512cf31ce79ee36e00000f","name":"Austin Children's Shelter"}},"_id":"50254b55f5c134282500001d","events":["btTapped"],"when":"2012-08-10T17:56:37.380Z","dates":{"lastModified":"2012-08-10T17:56:37.576Z","created":"2012-08-10T17:56:37.576Z"},"where":{"locationId":"4fd0aacc5673a4070b000226","org":{"type":"business","id":"4fd0aacc5673a4070b000225","name":"Zen Market"}},"what":{"type":"tapIn","id":"50254b55f5c134282500001c"},"who":{"type":"consumer"}},{"data":{"donationAmount":10,"charity":{"type":"charity","id":"4ffb455e44b618b2020002ae","name":"Health Alliance for Austin Musicians"}},"_id":"50254b4956b5747d24000055","events":["btTapped"],"when":"2012-08-10T17:56:25.491Z","dates":{"lastModified":"2012-08-10T17:56:25.594Z","created":"2012-08-10T17:56:25.594Z"},"where":{"locationId":"4ff1b114c39fb76e0100008e","org":{"type":"business","id":"4ff1b0fbc39fb76e01000085","name":"Dub Academy"}},"what":{"type":"tapIn","id":"50254b4956b5747d24000054"},"who":{"type":"consumer","screenName":"Dub Academy"}},{"data":{"donationAmount":5,"charity":{"type":"charity","id":"4f512ee685986ee56e000016","name":"Austin Humane Society"}},"_id":"50254b499637ab7e24000070","events":["btTapped"],"when":"2012-08-10T17:56:25.373Z","dates":{"lastModified":"2012-08-10T17:56:25.543Z","created":"2012-08-10T17:56:25.543Z"},"where":{"locationId":"4f508499e51d3c896c00009b","org":{"type":"business","id":"4f508499e51d3c896c00009a","name":"Aster's Ethiopian Restaurant"}},"what":{"type":"tapIn","id":"50254b499637ab7e2400006f"},"who":{"type":"consumer"}},{"data":{"donationAmount":5,"charity":{"type":"charity","id":"4f512ee685986ee56e000016","name":"Austin Humane Society"}},"_id":"50254b2895f3aa262500001a","events":["btTapped"],"when":"2012-08-10T17:55:51.707Z","dates":{"lastModified":"2012-08-10T17:55:52.077Z","created":"2012-08-10T17:55:52.077Z"},"where":{"locationId":"4f508499e51d3c896c00009b","org":{"type":"business","id":"4f508499e51d3c896c00009a","name":"Aster's Ethiopian Restaurant"}},"what":{"type":"tapIn","id":"50254b2795f3aa2625000019"},"who":{"type":"consumer"}},{"data":{"donationAmount":5,"charity":{"type":"charity","id":"4f512ee685986ee56e000016","name":"Austin Humane Society"}},"_id":"502549779637ab7e24000068","events":["btTapped"],"when":"2012-08-10T17:48:38.816Z","dates":{"lastModified":"2012-08-10T17:48:39.107Z","created":"2012-08-10T17:48:39.107Z"},"where":{"locationId":"4f5ceffa015146331700001b","org":{"type":"business","id":"4f5ceffa015146331700001a","name":"Dickey's Barbecue Pit"}},"what":{"type":"tapIn","id":"502549769637ab7e24000067"},"who":{"type":"consumer"}},{"data":{"donationAmount":5,"charity":{"type":"charity","id":"4ffb45f544b618b2020002c9","name":"Please Be Kind To Cyclists"}},"_id":"502547999637ab7e2400005d","events":["btTapped"],"when":"2012-08-10T17:40:41.140Z","dates":{"lastModified":"2012-08-10T17:40:41.231Z","created":"2012-08-10T17:40:41.231Z"},"where":{"locationId":"4fb20a0d73559a2a0d000a25","org":{"type":"business","id":"4fb20a0d73559a2a0d000a24","name":"Me and U Bistro"}},"what":{"type":"tapIn","id":"502547999637ab7e2400005c"},"who":{"type":"consumer","screenName":"Apagafuego"}},{"data":{"donationAmount":5,"charity":{"type":"charity","id":"4f512cf31ce79ee36e00000f","name":"Austin Children's Shelter"}},"_id":"5025427595f3aa2625000012","events":["btTapped"],"when":"2012-08-10T17:18:45.292Z","dates":{"lastModified":"2012-08-10T17:18:45.551Z","created":"2012-08-10T17:18:45.551Z"},"where":{"locationId":"4f5921f9047ba1bc0400005f","org":{"type":"business","id":"4f5921f9047ba1bc0400005e","name":"Charlotte's Fiesta Flowers"}},"what":{"type":"tapIn","id":"5025427595f3aa2625000011"},"who":{"type":"consumer"}},{"data":{"donationAmount":5,"charity":{"type":"charity","id":"4f512ee685986ee56e000016","name":"Austin Humane Society"}},"_id":"5025405fdff14e7f24000099","events":["btTapped"],"when":"2012-08-10T17:09:51.151Z","dates":{"lastModified":"2012-08-10T17:09:51.593Z","created":"2012-08-10T17:09:51.593Z"},"where":{"locationId":"4fb20a1012afd8280d000d80","org":{"type":"business","id":"4fb20a1012afd8280d000d7f","name":"East Village Cafe"}},"what":{"type":"tapIn","id":"5025405fdff14e7f24000098"},"who":{"type":"consumer"}},{"data":{"donationAmount":5,"charity":{"type":"charity","id":"4f512ee685986ee56e000016","name":"Austin Humane Society"}},"_id":"50253d3cf5c1342825000012","events":["btTapped"],"when":"2012-08-10T16:56:28.721Z","dates":{"lastModified":"2012-08-10T16:56:28.848Z","created":"2012-08-10T16:56:28.848Z"},"where":{"locationId":"4fb20a9612afd8280d000df5","org":{"type":"business","id":"4fb20a9612afd8280d000df4","name":"Austin Table Tennis Association"}},"what":{"type":"tapIn","id":"50253d3cf5c1342825000011"},"who":{"type":"consumer","screenName":"Comos"}},{"data":{"donationAmount":5,"charity":{"type":"charity","id":"4f512ee685986ee56e000016","name":"Austin Humane Society"}},"_id":"50253cd77429a12425000012","events":["btTapped"],"when":"2012-08-10T16:54:46.887Z","dates":{"lastModified":"2012-08-10T16:54:47.015Z","created":"2012-08-10T16:54:47.015Z"},"where":{"locationId":"4fb20a9afbfffd290d000c51","org":{"type":"business","id":"4fb20a9afbfffd290d000c50","name":"Full English Cafe"}},"what":{"type":"tapIn","id":"50253cd67429a12425000011"},"who":{"type":"consumer","screenName":"Stros"}},{"data":{"donationAmount":5,"charity":{"type":"charity","id":"4f512cf31ce79ee36e00000f","name":"Austin Children's Shelter"}},"_id":"50253c3556b5747d2400004d","events":["btTapped"],"when":"2012-08-10T16:52:05.155Z","dates":{"lastModified":"2012-08-10T16:52:05.274Z","created":"2012-08-10T16:52:05.274Z"},"where":{"locationId":"4f86af3e0f237f79210002b5","org":{"type":"business","id":"4f86af3e0f237f79210002b4","name":"Chris' Liquor"}},"what":{"type":"tapIn","id":"50253c3556b5747d2400004c"},"who":{"type":"consumer"}},{"data":{"donationAmount":5,"charity":{"type":"charity","id":"4f512cf31ce79ee36e00000f","name":"Austin Children's Shelter"}},"_id":"50253966dff14e7f24000086","events":["btTapped"],"when":"2012-08-10T16:40:06.285Z","dates":{"lastModified":"2012-08-10T16:40:06.492Z","created":"2012-08-10T16:40:06.492Z"},"where":{"locationId":"4f592142a618eec00400005a","org":{"type":"business","id":"4f592142a618eec004000059","name":"Texas Rib Kings"}},"what":{"type":"tapIn","id":"50253966dff14e7f24000085"},"who":{"type":"consumer","screenName":"mdc81"}},{"data":{"donationAmount":5,"charity":{"type":"charity","id":"4f512ee685986ee56e000016","name":"Austin Humane Society"}},"_id":"502538ee2bdbb2f620000709","events":["btTapped"],"when":"2012-08-10T16:38:05.864Z","dates":{"lastModified":"2012-08-10T16:38:06.656Z","created":"2012-08-10T16:38:06.656Z"},"where":{"locationId":"4ffc84e6aa034e9e0000017c","org":{"type":"business","id":"4ffc84d4aa034e9e00000178","name":"Flying Threads"}},"what":{"type":"tapIn","id":"502538ed2bdbb2f620000708"},"who":{"type":"consumer"}},{"data":{"donationAmount":5,"charity":{"type":"charity","id":"4f512ee685986ee56e000016","name":"Austin Humane Society"}},"_id":"502538ce70a76f8024000046","events":["btTapped"],"when":"2012-08-10T16:37:34.439Z","dates":{"lastModified":"2012-08-10T16:37:34.643Z","created":"2012-08-10T16:37:34.643Z"},"where":{"locationId":"4ffc84e6aa034e9e0000017c","org":{"type":"business","id":"4ffc84d4aa034e9e00000178","name":"Flying Threads"}},"what":{"type":"tapIn","id":"502538ce70a76f8024000045"},"who":{"type":"consumer","screenName":"Flying Threads"}},{"data":{"donationAmount":10,"charity":{"type":"charity","id":"4f512ee685986ee56e000016","name":"Austin Humane Society"}},"_id":"50253869dff14e7f2400007b","events":["btTapped"],"when":"2012-08-10T16:35:53.769Z","dates":{"lastModified":"2012-08-10T16:35:53.881Z","created":"2012-08-10T16:35:53.881Z"},"where":{"locationId":"4f50a18be9ac4c8a6c00007c","org":{"type":"business","id":"4f50a18be9ac4c8a6c00007b","name":"Mikado Ryotei"}},"what":{"type":"tapIn","id":"50253869dff14e7f2400007a"},"who":{"type":"consumer","screenName":"Comos"}}];

var moment = require('lib/core/moment');


// Common JS Requires, Very Useful stuff.
Ti.include('lib/core/components/class.js');
Ti.include('lib/core/config.js');
Ti.include('lib/core/utils.js');
Ti.include('lib/core/aes.js');
Ti.include('lib/core/ui.js');
Ti.include('lib/core/style.js');

// Components
Ti.include('lib/core/components/view.js');
Ti.include('lib/core/components/window.js');
Ti.include('lib/core/components/qrcode.js');
Ti.include('lib/core/components/infini-scroll.js');
Ti.include('lib/core/components/activity.js');
Ti.include('lib/core/components/stream-button.js');
Ti.include('lib/core/components/pull-to-refresh/pull-to-refresh.js');
Ti.include('lib/core/components/charity-view.js');

// Styles
Ti.include('lib/styles/common.js');
Ti.include('lib/styles/login.js');
Ti.include('lib/styles/main.js');
Ti.include('lib/styles/sidebar.js');
Ti.include('lib/styles/qrcode.js');
Ti.include('lib/styles/register.js');
Ti.include('lib/styles/nearby.js');
Ti.include('lib/styles/welcome.js');

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
Ti.include('lib/views/register.js');
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
});
