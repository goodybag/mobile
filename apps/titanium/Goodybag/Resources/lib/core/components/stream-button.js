(function(){
  var $ui = Titanium.UI;
  
  var constructor = function(text, options){
    this.options = {
      width: '150dp'
    , height: '33dp'
    , left: '7dp'
    , inactiveState: {
        background: gb.utils.getImage('screens/stream/buttons/Activity.default.png')   
      , color: gb.ui.color.grayDark
      , shadowColor: '#dadada'
      , shadowOffset: { x: 0, y: 1 }
      }
    , activeState: {
        background: gb.utils.getImage('screens/stream/buttons/Activity.active.png')
      , color: gb.ui.color.white
      , shadowColor: '#086582'
      , shadowOffset: { x: 0, y: -1 }
      }
    , font: {
        fontSize: gb.ui.font.base.fontSize
      , fontWeight: 'bold'
      }
    , textAlign: 'center'
    , isActive: false
    };
    
    for (var key in options){
      this.options[key] = options[key];
    }
    
    this.active = this.options.isActive;
    this.stateOptions = this.options[this.active ? 'activeState' : 'inactiveState'];
    
    this.button = $ui.createButton({
      width: this.options.width
    , height: this.options.height
    , left: this.options.left
    , backgroundImage: this.stateOptions.background
    });
    
    this.label = $ui.createLabel({
      text: text
    , width: $ui.FILL
    , height: $ui.SIZE
    , textAlign: this.options.textAlign
    , color: this.stateOptions.color
    , font: this.options.font
    , shadowOffset: this.stateOptions.shadowOffset
    , shadowColor: this.stateOptions.shadowColor
    });
    this.button.add(this.label);
    return this;
  };
  constructor.prototype = {
    activate: function(){
      if (this.active) return;
      this.active = true;
      this.setStyles();
      return this;
    }
  , deactivate: function(){
      if (!this.active) return;
      this.active = false;
      this.setStyles();
      return this;
    }
  , setStyles: function(){
      this.stateOptions = this.options[this.active ? 'activeState' : 'inactiveState'];
      this.button.setBackgroundImage(this.stateOptions.background);
      this.label.setColor(this.stateOptions.color);
      this.label.setShadowColor(this.stateOptions.shadowColor);
      this.label.setShadowOffset(this.stateOptions.shadowOffset);
      return this;
    }
  , addEventListener: function(fn, prop){
      return this.button.addEventListener(fn, prop);
    }
  , removeEventListener: function(fn, prop){
      return this.button.removeEventListener(fn, prop);
    }
  };
  GB.StreamButton = constructor;
  exports = constructor;
})();

