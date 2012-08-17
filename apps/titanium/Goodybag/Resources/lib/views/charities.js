(function(){
  var $http = gb.utils.http
  ,   $ui = Titanium.UI
  ,   detailsCharitySelect = gb.utils.getImage('screens/charity/buttons/charity_select.png')
  ,   detailsCharitySelected = gb.utils.getImage('screens/charity/buttons/charity_selected.png');
  
  
  var views = {
    "base": $ui.createView({
      width: $ui.FILL
    , height: $ui.FILL
    , top: '54dp'
    , backgroundColor: '#ddd'
    , layout: 'vertical'
    })
    
  , "charityList": {
      base: $ui.createScrollView({
        width: $ui.FILL
      , height: $ui.FILL
      , layout: 'vertical'
      , showVerticalScrollIndicator: true
      })
      
    , "header": $ui.createLabel({
        text: "Choose a Charity to Raise Funds For!"
      , width: $ui.FILL
      , height: $ui.SIZE
      , top: '16dp'
      , bottom: '16dp'
      , color: gb.ui.color.grayDarker
      , textAlign: "center"
      , font: {
          fontSize: 16
        , fontWeight: 'bold'
        }
      , shadowColor: '#fff'
      , shadowOffset: { x: 0, y: 1 }
      })
    }
    
  , "charityDetails": {
      "base": $ui.createView({
        width: $ui.FILL
      , layout: 'vertical'
      , top: '10dp'
      })
      
    , "mainContent": {
        "base": $ui.createView({
          width: '318dp'
        , height: '333dp'
        , top: 0
        , backgroundImage: gb.utils.getImage('screens/charity/charity_backdrop.png')
        })
        
      , "wrapper": {
          "base": $ui.createView({
            width: $ui.FILL
          , height: $ui.SIZE
          , left: '12dp'
          , right: '12dp'
          , top: 0
          , layout: 'vertical'
          })
          
        , "header": {
            "base": $ui.createView({
              width: $ui.FILL
            , height: '44dp'
            , top: '12dp'
            })
            
          , "left": {
              "base": $ui.createView({
                width: '210dp'
              , height: $ui.SIZE
              , left: 0
              , top: '8dp'
              , layout: 'vertical'
              })
              
            , "name": $ui.createLabel({
                width: $ui.FILL
              , height: $ui.SIZE
              , color: gb.ui.color.grayDark
              , font: {
                  fontSize: 14
                , fontWeight: 'bold'
                }
              })
              
            , "url": $ui.createLabel({
                width: $ui.FILL
              , height: $ui.SIZE
              , top: '-2dp'
              , color: gb.ui.color.blueBright
              , font: {
                  fontSize: 12
                }
              })
            }
            
          , "right": {
              "base": $ui.createView({
                width: '80dp'
              , right: 0
              })
              
            , "logo": $ui.createImageView({
                height: '44dp'
              , center: { x: '54dp', y: '22dp' }
              })
            }
          }
          
        , "content": {
            "base": $ui.createView({
              width: $ui.FILL
            , height: $ui.SIZE
            })
            
          , "text": $ui.createLabel({
              text: "loading"
            , width: $ui.FILL
            , height: $ui.SIZE
            , color: gb.ui.color.base
            , font: {
                fontSize: gb.ui.font.fontSize
              }
            })
          }
        }
        
      , "charitySelect": $ui.createButton({
          image: detailsCharitySelect
        , style:Titanium.UI.iPhone.SystemButtonStyle.PLAIN
        , bottom: '12dp'
        })
      }
      
    , "bottom": {
      
        "base": $ui.createView({
          width: $ui.FILL
        , height: $ui.SIZE
        , top: '8dp'
        })
        
      , "back": $ui.createButton({
          image: gb.utils.getImage('screens/charity/buttons/charity_back.png')
        , width: '304dp'
        , height: '47dp'
        , borderWidth: 0
        , borderColor: null
        , style:Titanium.UI.iPhone.SystemButtonStyle.PLAIN
        , backgroundColor: 'transparent'
        })
      }
    }
  };
  
  gb.utils.compoundViews(views);
  
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
      
      this.views.charityDetails.base.hide();
      
      this.views.charityDetails.bottom.base.addEventListener('click', function(){
        $this.showCharityList();
      });
    },
    
    onShow: function () {
      if (this.hasLoaded) return;
      var $this = this;
      this.fetchData(function(error, data){
        if (error) return console.log(error);
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
    
    showCharityList: function(){
      if (this.current === "charityList") return;
      this.current = "charityList"
      this.views.charityDetails.base.hide();
      this.views.charityList.base.setHeight($ui.FILL);
      this.views.charityList.base.show();
    },
    
    showCharityDetails: function(charity){
      if (this.current === "charityDetails") return;
      this.current = "charityDetails";
      // Fill in details
      var
        details = this.views.charityDetails
      , header  = details.mainContent.wrapper.header
      , select  = details.mainContent.charitySelect
      , $this   = this
      ;
      header.left.name.setText(charity.model.publicName);
      header.left.url.setText(charity.model.url);
      header.right.logo.setImage(charity.model.media.url);
      if (charity.selected) select.setImage(detailsCharitySelected);
      else select.setImage(detailsCharitySelect);
      if (this.onDetailsCharitySelect){
        select.removeEventListener('click', this.onDetailsCharitySelect);
      }
      this.onDetailsCharitySelect = function(e){
        if (charity.selected) return;
        select.setImage(detailsCharitySelected);
        charity.triggerOnSelect(e);
      };
      select.addEventListener('click', this.onDetailsCharitySelect);
      // For some reason the view's block properties are still prevalent after it's hidden
      this.views.charityList.base.setHeight(0);
      this.views.charityList.base.hide();
      details.base.show();
    },
    
    showData: function (data) {
      var charity, list = this.views.charityList.base, $this = this;
      for (var i = 0; i < data.length; i++) {
        charity = new GB.CharityView(data[i], {
          onSelect: function(charity, e){ $this.onCharitySelect(charity, e) }
        , onDetails: function(charity, e){ $this.onCharityDetails(charity, e) }
        , selected: data[i]._id === gb.consumer.getCharityId()
        });
        if (charity.selected) this.selected = charity;
        list.add(charity.views.base);
      }
    },
    
    selectCharity: function(charity, callback){
      if (this.selected) this.selected.deselect();
      this.selected = charity;
      callback || (callback = function(){});
      gb.consumer.setCharity({
        id: charity.model._id
      , name: charity.model.publicName
      }, function(error){
        if (error) return console.log(error);
        callback();
      });
    },
    
    fetchData: function (callback) {
      var $this = this;
      if (this.isFetching) return;
      this.isFetching = true;
      $http.get(gb.config.api.charities, function(error, data){
        if (error) return console.log(error);
        data = JSON.parse(data);
        $this.isFetching = false;
        callback(data.error, data.data);
      });
    }
  });
})();