(function(){
  this.app = window.app || {};
  this.app.transitions = this.app.transitions || {};
  var transitions = {};

  // Incomplete
  transitions.slideLeft = function($el){
    var $content    = $('#content')
      , $newContent = $('<div class="content" />')
    ;
    $newContent.css({
      position: 'absolute',
      right: ''
    }).append($el);
  };

  transitions.fade = function($el, options, callback){
    var $container = options.$container || $('#content');
    $container.animate({
      opacity: 0
    }, function(){
      $container.html("").html($el).animate({
        opacity: 1
      }, callback);
    });
  };

  transitions.load = function($el, options){
    // Do nothing
  };

  // Export
  for (var key in transitions){
    this.app.transitions[key] = transitions[key];
  }
}).call(this);