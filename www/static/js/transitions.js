(function(){
  this.app = window.app || {};
  this.app.transitions = this.app.transitions || {};
  var transitions = {};

  // Complete
  transitions.slideLeft = function($el){
    var $content = $('#content')
      , $newContent = $('<div class="content" />')
    ;
    $newContent.css({
      position: 'absolute',
      right: ''
    }).append($el);
  };

  // Export
  for (var key in transitions){
    this.app.transitions[key] = transitions[key];
  }
}).call(this);