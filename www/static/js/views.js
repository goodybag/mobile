(function(){
  this.app = window.app || {};
  this.app.Views = window.app.Views || {};
  var views = {};

  views.Goody = utils.View.extend({
    className: 'goody',
    events: {
      'click': 'goodyClick'
    },
    initialize: function(){
    },
    render: function(){
      $(this.el).html(app.fragments.goody(this.model.toJSON()));
    },
    goodyClick: function(e){
      console.log("GOODY CLICKED!!!!!!!!");
    }
  });

  // Export
  for (var name in views){
    this.app.Views[name] = views[name];
  }
}).call(this);