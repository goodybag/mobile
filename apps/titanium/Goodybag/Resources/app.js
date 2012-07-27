// App Namespacing.
var gb = {}, GB = gb;

// Common JS Requires, Very Useful stuff.
Ti.include('lib/core/components/class.js');
Ti.include('lib/core/config.js');
Ti.include('lib/core/utils.js');
Ti.include('lib/core/aes.js');

// Components
Ti.include('lib/core/components/view.js');
Ti.include('lib/core/components/window.js');
Ti.include('lib/core/components/qrcode.js');

gb.qrcode = QRCode({
  typeNumber: 4,
  errorCorrectLevel: 'M'
});

// Models
Ti.include('lib/models/user.js');
Ti.include('lib/models/place.js');

// Create our User
gb.consumer = new gb.models.User();

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
});
