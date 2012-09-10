// App and References
var gb = {}
,   GB = gb
,   $ui = Titanium.UI
,   $dp = Titanium.Platform.displayCaps
,   $prop = Titanium.App.Properties;

var moment = require('lib/core/moment');
var Ligature = require('lib/core/components/iconic/iconic').iconic({ font: 'LigatureSymbols' });

// Base
Ti.include('lib/core/components/class.js');

// Basic File Loading Structure in JSON Form, Excluding Views.
gb.files = {
  "core": [
    'config',
    'utils',
    'aes',
    'ui',
    'api',
    'style'
  ],
  
  "styles": [
    'common',
    'login',
    'main',
    'sidebar',
    'qrcode',
    'register',
    'nearby',
    'welcome',
    'profile',
    'set-screen-name',
    'enter-tapin-id',
    'settings'
  ],
  
  "core/components": [
    'view',
    'window-loader',
    'window',
    'qrcode',
    'infini-scroll',
    'activity',
    'stream-button',
    'pull-to-refresh/pull-to-refresh',
    'charity-view',
    'button',
    'validate',
    'periodic-refresh',
    'events'
  ],
  
  "models": [
    'user',
    'place',
    'activity'
  ]
};

for (var dir in gb.files) {
  var i, files = gb.files[dir];
  for (i = 0; i < files.length; i++)
    Titanium.include('/lib/' + dir + '/' + files[i] + '.js');
}

// Create the QRCode
gb.qrcode = QRCode({
  typeNumber: 4,
  errorCorrectLevel: 'M'
});

// Create our User
gb.consumer = new GB.Models.User();

// Views and windows
Titanium.include('/lib/views/main.js');

[ 'register',
  'qrcode',
  'nearby', 
  'stream', 
  'charities', 
  'welcome', 
  'profile',
  'settings',
  'stream-no-data', 
  'set-screen-name',
  'enter-tapin-id',
  'edit-setting',
  'email-change-request'
].forEach(function (item) {
  Titanium.include('/lib/views/' + item + '.js');
});

[ 'login', 'complete-registration' ].forEach(function (item) {
  Titanium.include('/lib/views/' + item + '.js');
});

// Do Authentication Check
gb.consumer.validate(function (consumer) {
  if (consumer !== null && typeof consumer !== "undefined") {
    gb.consumer = consumer;
    GB.Windows.show(gb.consumer.hasCompletedRegistration() ? 
      'main' : 'complete-registration'
    );
    gb.consumer.renew();
  } else {
    gb.consumer.logout();
    GB.Windows.show('login');
  }
});
