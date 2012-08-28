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
      base: gb.style.get('charities.charity.item.base'),
      
      top: {
        base: gb.style.get('charities.charity.item.top.base'),
        fillerTop: gb.style.get('charities.charity.item.top.filler'),
        
        left: {
          base: gb.style.get('charities.charity.item.top.left.base'),
          logo: gb.style.get('charities.charity.item.top.left.logo', {
            image: this.model.media.url
          })
        },
        
        right: {
          base: gb.style.get('charities.charity.item.top.right.base'),
          name: gb.style.get('charities.charity.item.top.right.name', {
            text: this.model.publicName
          })
        },
        
        fillerBottom: gb.style.get('charities.charity.item.top.filler')
      },
      
      bottom: {
        base: gb.style.get('charities.charity.item.bottom.base'),
        
        selectBtn: gb.style.get('charities.charity.item.bottom.select', {
          image: this.options["charitySelect" + (this.selected ? 'ed' : '') + "Btn"]
        , events: {
            click: function(e){
              $this.triggerOnSelect(e);
            }
          }
        }),
        
        detailsBtn: gb.style.get('charities.charity.item.bottom.details', {
          image: this.options.charityDetailsBtn
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

