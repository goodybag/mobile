(function(){
  var
    $ui = Titanium.UI
  ;
  
  var views = function () {
    return {
      base: gb.style.get('charities.charity.item.base'),
      
      top: {
        base: gb.style.get('charities.charity.item.top.base'),
        fillerTop: gb.style.get('charities.charity.item.top.filler'),
        
        left: {
          base: gb.style.get('charities.charity.item.top.left.base'),
          logo: gb.style.get('charities.charity.item.top.left.logo')
        },
        
        right: {
          base: gb.style.get('charities.charity.item.top.right.base'),
          name: gb.style.get('charities.charity.item.top.right.name')
        },
        
        fillerBottom: gb.style.get('charities.charity.item.top.filler')
      },
      
      bottom: {
        base: gb.style.get('charities.charity.item.bottom.base'),
        selectBtn: gb.style.get('charities.charity.item.bottom.select'),
        detailsBtn: gb.style.get('charities.charity.item.bottom.details')
      }
    };
  };
  
  var constructor = function (data, options) {
    var $this = this;
    this.views = new views;
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
    
    this.views.top.left.logo.set('image', this.model.media.url);
    this.views.top.right.name.set('text', this.model.publicName);
    this.views.bottom.selectBtn.set('image', this.options["charitySelect" + (this.selected ? 'ed' : '') + "Btn"]);
    this.views.bottom.selectBtn.addEventListener('click', function (e) {
      $this.triggerOnSelect(e);
    });
    this.views.bottom.detailsBtn.set('image', this.options.charityDetailsBtn);
    this.views.bottom.detailsBtn.addEventListener('click', function (e) {
      $this.triggerOnDetails(e);
    });
    
    gb.utils.compoundViews(this.views);
  };
  
  constructor.prototype = {
    triggerOnDetails: function(e){
      this.options.onDetails(this, e);
    }
    
  , triggerOnSelect: function(e){
      if (this.selected) return;
      this.views.bottom.selectBtn.set('image', this.options.charitySelectedBtn);
      this.selected = true;
      this.options.onSelect(this, e);
    }
    
  , deselect: function(){
      if (!this.selected) return;
      this.views.bottom.selectBtn.set('image', this.options.charitySelectBtn);
      this.selected = false;
    }
  };
  
  GB.CharityView = constructor;
  
})();

