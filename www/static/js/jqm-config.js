// Disable jqm's routing to use backbone's
$(document).bind("mobileinit", function () {
  $.mobile.ajaxEnabled = false;
  $.mobile.linkBindingEnabled = false;
  $.mobile.hashListeningEnabled = false;
  $.mobile.pushStateEnabled = false;
});

// Manually remove pages from the dom for jqm
$('div[data-role="page"]').live('pagehide', function (event, ui) {
  $(event.currentTarget).remove();
});