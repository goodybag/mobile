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

  transitions.fade = function($el){
    var $content = $('#content');
    $content.animate({
      opacity: 0
    }, function(){
      $content.html($el).animate({
        opacity: 1
      });
    });
  };

  // Export
  for (var key in transitions){
    this.app.transitions[key] = transitions[key];
  }
}).call(this);