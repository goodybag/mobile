(function(){
  var
    $ui = Titanium.UI
  ;
  
  var constructor = function(data, options){
    var $this = this;
    
    this.model = data;
    
    this.options = {
      onSelect: function(charity, e){
        alert('selected ' + charity.publicName);
      }
    , onDetails: function(charity, e){
        alert('details for ' + charity.publicName);
      }
    , charitySelectedBtn: gb.utils.getImage("screens/charity/buttons/charity_selected_small.png")
    , charitySelectBtn:   gb.utils.getImage("screens/charity/buttons/charity_select_small.png")
    , charityDetailsBtn:  gb.utils.getImage("screens/charity/buttons/charity_details.png")
    , selected:           false
    };
    
    for (var key in options){
      this.options[key] = options[key];
    }
    
    this.selected = this.options.selected;
    
    this.views = {
      base: $ui.createView({
        width: $ui.FILL
      , height: $ui.SIZE
      , layout: 'vertical'
      , bottom: '15dp'
      , zIndex: 3
      })
      
    , top: {
        base: $ui.createView({
          width: '318dp'
        , height: '80dp'
        , layout: 'horizontal'
        , backgroundImage: gb.utils.getImage('screens/charity/charity_backdrop.png')
        , zIndex: 2
        })
        
      , fillerTop: $ui.createView({
          width: $ui.FILL
        , height: '12dp'
        })
        
      , left: {
          base: $ui.createView({
            width: '100dp'
          , height: '56dp'
          })
          
         , logo: $ui.createImageView({
            width: $ui.SIZE
          , height: '52dp'
          , image: this.model.media.url
          })
        }
        
      , right: {
          base: $ui.createView({
            width: $ui.FILL
          , height: '56dp'
          , left: '30dp'
          })
          
        , name: $ui.createLabel({
            text: this.model.publicName
          , width: $ui.FILL
          , color: gb.ui.color.grayDarker
          , font: {
              fontSize: gb.ui.font.base.fontSize + 2
            , fontWeight: 'bold'
            }
          })
        }
      
      , fillerBottom: $ui.createView({
          width: $ui.FILL
        , height: '12dp'
        })
      }
      
    , bottom: {
        base: $ui.createView({
          width: $ui.FILL
        , height: '30dp'
        , layout: 'horizontal'
        , top: '-1dp'
         , left: '4dp'
        , zIndex: 1
        })
        
      , selectBtn: $ui.createButton({
          width: '155dp'
        , height: '30dp'
        , left: '1dp'
        , image: this.options["charitySelect" + (this.selected ? 'ed' : '') + "Btn"]
        , events: {
            click: function(e){
              $this.triggerOnSelect(e);
            }
          }
        })
        
      , detailsBtn: $ui.createButton({
          width: '155dp'
        , height: '30dp'
        , image: this.options.charityDetailsBtn
        , events: {
            click: function(e){
              $this.triggerOnDetails(e);
            }
          }
        })
      }
    };
    
    gb.utils.compoundViews(this.views);
  };
  
  constructor.prototype = {
    triggerOnDetails: function(e){
      this.options.onDetails(this, e);
    }
  , triggerOnSelect: function(e){
      if (this.selected) return;
      this.views.bottom.selectBtn.setImage(this.options.charitySelectedBtn);
      this.selected = true;
      this.options.onSelect(this, e);
    }
  , deselect: function(){
      if (!this.selected) return;
      this.views.bottom.selectBtn.setImage(this.options.charitySelectBtn);
      this.selected = false;
    }
  };
  
  GB.CharityView = constructor;
  
})();

