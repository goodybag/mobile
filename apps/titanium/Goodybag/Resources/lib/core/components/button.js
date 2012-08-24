/**
 * Class.Button
 * 
 * Create a button
 * Pass in styles for three states
 * @param {String} - Button text
 * @param {Object|optional} - styling
 * 
 * Options:
 * {
     "default": {
        width: '100dp'
      , height: '40dp'
      , borderRadius: 5
      , borderWidth: 1
      , borderColor: '#165b87'
      , color: '#fff'
      , font: {
          fontSize: 14
        , fontWeight: 'bold'
        }
      , shadowOffset: { x: 0, y: -1 }
      , shadowColor: gb.ui.color.blueDark
      , opacity: 1
      , backgroundGradient: {
          type: 'linear'
        , startPoint: { x: 0, y: 0 }
        , endPoint:   { x: 0, y: '100%' }
        , colors: [{ color: '#1f7eba', offset: 0.0 }, { color: '#0667a0', offset: 1.0 }]
        }
      , topShadow: {
          color: '#fff'
        , opacity: 0.1
        }
      , bottomShadow: {
          color: '#fff'
        , opacity: 0.07
        }
      }
    , "active": {
        backgroundGradient: {
          type: 'linear'
        , startPoint: { x: 0, y: 0 }
        , endPoint:   { x: 0, y: '100%' }
        , colors: [{ color: '#0667a0', offset: 0.0 }, { color: '#0667a0', offset: 1.0 }]
        }
      , topShadow: {
          color: '#fff'
        , opacity: 0
        }
      , opacity: 1
      }
    , "disabled": {
        opacity: 0.4
      }
    }
 */

(function(){
  var $ui = Ti.UI;
  
  var constructor = function(text){
    this.text = text;
    this.state = "default";
    // Apply Options
    this.options = {};
    var args = Array.prototype.slice.call(arguments, 1), states = "default,disabled,active";
    for (var i = args.length - 1, arg; i >= 0; i--){
      arg = args[i];
      for (var key in arg){
          this.options[key] = (states.indexOf(key) > -1) 
                            ? gb.utils.extend(this.options[key] || {}, arg[key])
                            : arg[key];
        
      }
    }
    if (args.length === 0) this.options = gb.style.get('common.bluePage.buttons.blue');
    
    this._setupViews();
    this._delegateEvents();
    this._mapStyles();
  };
  constructor.prototype = {
    /**
     * Sets the state of the button
     * @param {String} - The state you want to set the button to (default|active|disabled)
     */
    set: function(state){
      if (this.state === state) return;
      var changed = this.styles[this.state === "default" ? state : this.state], fn, viewStyles;
      this.state = state;
      // Apply new properties
      for (var view in changed){
        viewStyles = changed[view];
        for (var styleType in viewStyles){
          fn = "set" + (styleType[0].toUpperCase() + styleType.substring(1));
          this.views[view][fn](this.styles[state][view][styleType]);
        }
      }
    }
    
  , _delegateEvents: function(){
      for (var event in this.options.events){
        this.views.base.addEventListener(event, this.options.events[event]);
      }
    }
    
    /**
     * Cache style changes so we don't have to calculate them when we change states
     */
  , _mapStyles: function(){
      var props, styleState;
      this.styles = { "default": {}, "active": {}, "disabled": {} };
      
      // Setup blank view objects for styles to be applied
      for (var view in this.views){
        this.styles['default'][view] = {};
        this.styles['active'][view] = {};
        this.styles['disabled'][view] = {};
      }
      
      for (var state in this.options){
        styleState = this.styles[state];
        props = this.options[state];
        for (var styleType in props){
          // Certain styles are mapped to different views
          switch (styleType){
            case 'width':
              styleState.base.width = props.width;
            break;
            case 'height':
              var height = parseInt(props.height);
              styleState.base.height = height + 1 + 'dp';
              styleState.fill.height = height - 2 + 'dp';
              styleState.border.height = props.height;
            break;
            case 'borderRadius':
              styleState.base.borderRadius = props.borderRadius + 1;
              styleState.fill.borderRadius = props.borderRadius;
              styleState.border.borderRadius = props.borderRadius;
            break;
            case 'borderWidth': case 'borderColor':
              styleState.border[styleType] = props[styleType];
            break;
            case 'color': case 'shadowOffset': case 'shadowColor': case 'font':
              styleState.text[styleType] = props[styleType];
            break;
            case 'backgroundGradient':
              styleState.fill.backgroundGradient = props.backgroundGradient;
            break;
            case 'topShadow':
              styleState.topShadow.backgroundColor = props.topShadow.color;
              styleState.topShadow.opacity = props.topShadow.opacity;
            break;
            case 'bottomShadow':
              styleState.bottomShadow.backgroundColor = props.bottomShadow.color;
              styleState.bottomShadow.opacity = props.bottomShadow.opacity;
            break;
            case 'opacity': case 'backgroundColor': case 'top': case 'right': case 'bottom': case 'left':
              styleState.base[styleType] = props[styleType];
            break;
            default: break;
          }
        }
      }
    }
    
  , addEventListener: function(name, fn){
      this.views.base.addEventListener(name, fn);
    }
    
  , removeEventListener: function(name, fn){
      this.views.base.removeEventListener(name, fn);
    }
    
  , _setupViews: function(){
      var base = this.options['default'], $this = this;
      this.views = {
        "base": $ui.createView({
          width: base.width
        , height: parseInt(base.height) + 1 + 'dp'
        , borderRadius: base.borderRadius + 1
        , top: base.top
        , left: base.left
        , right: base.right
        , bottom: base.bottom
        })
        
      , "bottomShadow": $ui.createView({
          width: $ui.FILL
        , height: '12dp'
        , backgroundColor: base.bottomShadow.color
        , opacity: base.bottomShadow.opacity
        , bottom: 0
        })
        
      , "topShadow": $ui.createView({
          width: $ui.FILL
        , height: '12dp'
        , backgroundColor: base.topShadow.color
        , opacity:base.topShadow.opacity
        , top: 0
        })
        
      , "fill": $ui.createButton({
          width: $ui.FILL
        , height: parseInt(base.height) - 2 + 'dp'
        , top: '2dp'
        , borderRadius: base.borderRadius
        , borderWidth: 0
        , borderColor: null
        , backgroundGradient: base.backgroundGradient
        , style:Titanium.UI.iPhone.SystemButtonStyle.PLAIN
        , backgroundColor: 'transparent'
        })
        
      , "text": $ui.createLabel({
          width: $ui.FILL
        , height: $ui.SIZE
        , text: this.text
        , textAlign: 'center'
        , font: base.font
        , color: base.color
        , shadowOffset: base.shadowOffset
        , shadowColor: base.shadowColor
        })
        
      , "border": $ui.createView({
          width: $ui.FILL
        , height: base.height
        , borderRadius: base.borderRadius
        , borderWidth: base.borderWidth
        , borderColor: base.borderColor
        , top: 0
        })
      };
      gb.utils.compoundViews(this.views);
      this.views.base.addEventListener('touchstart', function(e){
        if ($this.state === "disabled") return;
        $this.set('active');
      });
      this.views.base.addEventListener('touchend', function(e){
        if ($this.state === "disabled") return;
        $this.set('default');
      });
      this.views.base.addEventListener('touchcancel', function(e){
        if ($this.state === "disabled") return;
        $this.set('default');
      });
    }
  };
  GB.Button = constructor;
  exports = constructor;
})();
