(function(){
  var
    $ui = Titanium.UI
  ;
  
  var constructor = function(model){
    this.views = {
      base: $ui.createView({
        width: $ui.FILL
      , height: $ui.SIZE
      , layout: 'vertical'
      , borderColor: '#ccc'
      , borderWidth: 1
      , borderRadius: 5
      })
      
    , top: {
        base: $ui.createView({
          width: $ui.FILL
        , height: $ui.SIZE
        , layout: 'horizontal'
        , left: '5dp'
        , right: '5dp'
        , backgroundGradient: {
            type: 'linear'
          , startPoint: { x: '0%', y: '0%' }
          , endPoint:   { x: '0%', y: '100%'}
          , colors: [
              { color: '#ececec', offset: 0 }
            , { color: '#ffffff', offset: 0.2 }
            ]
          }
        })
        
      , fillerTop: $ui.createView({
          width: $ui.FILL
        , height: '12dp'
        })
        
      , left: {
          base: $ui.createView({
            width: '107dp'
          , height: '43dp'
          })
          
         , logo: $ui.createImage({
            width: $ui.SIZE
          , height: '43dp'
          })
        }
        
      , right: {
          base: $ui.createview({
            width: $ui.FILL
          , height: '43dp'
          })
        }
      }
      
      , fillerBottom: $ui.createView({
          width: $ui.FILL
        , height: '12dp'
        })
      
    , bottom: {
        base: $ui.createView({
          width: $ui.FILL
        , height: '30dp'
        , layout: 'horizontal'
        })
        
        
      }
    };
    
    gb.utils.compoundViews(this.views);
  };
  constructor.prototype = {
    
  };
  
  GB.CharityView = constructor;
  
})();

