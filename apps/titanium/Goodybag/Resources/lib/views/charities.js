(function(){
  var $http = gb.utils.http
  ,   $ui = Titanium.UI;
  
  var views = {
    "base": gb.style.get('charities.self'),
    
    "charityList": {
      base: gb.style.get('charities.charity.list.base'),
      header: gb.style.get('charities.charity.list.header'),
    },
    
    "charityDetails": {
      "base": gb.style.get('charities.charity.details.base')
      
    , "mainContent": {
        "base": gb.style.get('charities.charity.details.content.base')
        
      , "wrapper": {
          "base": gb.style.get('charities.charity.details.content.wrapper.base')
          
        , "header": {
            "base": gb.style.get('charities.charity.details.content.wrapper.header.base')
            
          , "left": {
              "base": gb.style.get('charities.charity.details.content.wrapper.header.left.base')
            , "name": gb.style.get('charities.charity.details.content.wrapper.header.left.name')
            , "url":  gb.style.get('charities.charity.details.content.wrapper.header.left.url')
          }
          
          , "right": {
              "base": gb.style.get('charities.charity.details.content.wrapper.header.right.base')              
            , "logo": gb.style.get('charities.charity.details.content.wrapper.header.right.logo')
            }
          }
          
        , "content": {
            "base": gb.style.get('charities.charity.details.content.wrapper.content.base')
          , "text": gb.style.get('charities.charity.details.content.wrapper.content.text')
          }
        }
        
      , "charitySelect": gb.style.get('charities.charity.select')
      }
      
    , "bottom": {
        "base": gb.style.get('charities.charity.bottom.base')
      , "back": gb.style.get('charities.charity.bottom.back')
      }
    }
  };
  
  GB.Views.add('charities', {
    self: views.base,
    
    /**
     * Keeps track of the selected view
     */
    selected: null,
    
    /**
     * Keeps track of current page view (charity list || charity details)
     */
    current: 'charityList',
    
    /**
     * @constructor
     */
    Constructor: function () {
      var $this = this;
      this.isFetching = false;
      this.hasLoaded = false;
      this.views = views;
      this.hasCalledOnComplete = false;
      this.onComplete = function () {};
      this.backId = null;
    },
    
    onShow: function () {
      var $this = this;
      
      if (!views.base.pool) gb.utils.compoundViews(views);
      if (!this.backId) this.backId = this.views.charityDetails.bottom.base.addEventListener('click', function(){
        $this.showCharityList();
      });
      
      console.log('showing charities, onShow method');
      
      this.fetchData(function(error, data){
        if (error) return gb.utils.debug(error);
        console.log('fetched charity data, has loaded is true showData called.');
        $this.hasLoaded = true;
        $this.showData(data);
      });
    },
    
    onCharitySelect: function(charity){
      this.selectCharity(charity);
    },
    
    onCharityDetails: function(charity){
      this.showCharityDetails(charity);
    },
    
    triggerOnComplete: function(){
      if (this.hasCalledOnComplete) return;
      this.onComplete();
      this.hasCalledOnComplete = true;
    },
    
    setOnComplete: function (fn) {
      this.onComplete = fn;
    },
    
    showCharityList: function(){
      if (this.current === "charityList") return;
      this.current = "charityList";
      this.views.charityDetails.base.hide();
      this.views.charityList.base.set('height', $ui.FILL);
      this.views.charityList.base.show();
    },
    
    showCharityDetails: function (charity) {
      if (this.current === "charityDetails") return;
      
      this.current = "charityDetails";
      
      // Fill in details
      var
        details = this.views.charityDetails
      , select_image = gb.utils.getImage('screens/charity/buttons/charity_select.png')
      , selected_image = gb.utils.getImage('screens/charity/buttons/charity_selected.png')
      , header  = details.mainContent.wrapper.header
      , select  = details.mainContent.charitySelect
      , $this   = this
      ;
      
      header.left.name.set('text', charity.model.publicName);
      header.left.url.set('text', charity.model.url);
      header.right.logo.set('image', charity.model.media.url);
      
      if (charity.selected) select.set('image', selected_image);
      else select.set('image', select_image);
      
      if (this.onDetailsCharitySelect) {
        select.removeEventListener('click', this.onDetailsCharitySelect);
      }
      
      this.onDetailsCharitySelect = function (e) {
        if (charity.selected) return;
        select.set('image', selected_image);
        charity.triggerOnSelect(e);
      };
      
      select.addEventListener('click', this.onDetailsCharitySelect);
      
      // For some reason the view's block properties are still prevalent after it's hidden
      this.views.charityList.base.set('height', 0);
      this.views.charityList.base.hide();
      details.base.show();
    },
    
    showData: function (data) {
      var charity, list = this.views.charityList.base, $this = this;
      
      gb.utils.debug('showing charities');
      for (var i = 0; i < data.length; i++) {
        charity = new GB.CharityView(data[i], {
          onSelect: function (charity, e) { $this.onCharitySelect(charity, e) }
        , onDetails: function (charity, e) { $this.onCharityDetails(charity, e) }
        , selected: data[i]._id === gb.consumer.getCharityId()
        });
        
        if (charity.selected) this.selected = charity;
        list.add(charity.views.base);
      }
    },
    
    selectCharity: function(charity, callback){
      var $this = this;
      if (this.selected) this.selected.deselect();
      this.selected = charity;
      callback || (callback = function(){});
      gb.consumer.setCharity({
        id: charity.model._id
      , name: charity.model.publicName
      }, function(error){
        if (error) return console.log(error);
        $this.triggerOnComplete(); // Registration step complete
        callback();
      });
    },
    
    fetchData: function (callback) {
      var $this = this;
      if (this.isFetching) return;
      this.isFetching = true;
      $http.get(gb.config.api.charities, function(error, data){
        if (error) return gb.utils.debug(error);
        data = JSON.parse(data);
        $this.isFetching = false;
        callback(data.error, data.data);
      });
    }
  });
})();