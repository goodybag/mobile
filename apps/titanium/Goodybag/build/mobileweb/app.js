// App Namespacing.
var gb = {};

// Common JS Requires, Very Useful stuff.
Ti.include('lib/core/components/class.js');
Ti.include('lib/core/config.js');
Ti.include('lib/core/utils.js');

// Components
Ti.include('lib/core/components/view.js');

// Views
Ti.include('lib/views/login.js');
Ti.include('lib/views/main.js');

gb.Views.showView('login');
