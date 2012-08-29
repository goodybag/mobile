/**
 * Activity View
 */
GB.getActivityView = function(model){
  var
    $this   = this
  , post    = 0
  , imgSrc  = model.who.screenName
            ? "-secure/" + escape(model.who.screenName)
            : "/000000000000000000000000"
  ;
  
  return gb.utils.compoundViews({
    // Main view wrapper
    base: $ui.createView({
      width: $ui.FILL
    , height: $ui.SIZE
    , top: '6dp'
    })
    
    // Profile picture
  , image: $ui.createImageView({
      image: "https://s3.amazonaws.com/goodybag-uploads/consumers" + imgSrc + "-128.png"
    , decodeRetries: 1
    , defaultImage: gb.utils.getImage('avatar.png')
    , width: "42dp"
    , height: "42dp"
    , title: model.who.screenName
    , top: "16dp"
    , left: "-3dp"
    , zIndex: 1
    , borderRadius: 5
    , events: {
        error: function (e) {
          e.source.setImage('https://s3.amazonaws.com/goodybag-uploads/consumers/000000000000000000000000-128.png');
        }
      }
    })
    
  , container: {
      base: $ui.createView({
        width: $ui.FILL
      , height: $ui.SIZE
      , backgroundColor: '#fff'
      , borderColor: '#ccc'
      , borderWidth: 1
      , borderRadius: 5
      , layout: 'horizontal'
      , left: '5dp'
      , right: '5dp'
      })
      
    , fillerTop: $ui.createView({
        width: $ui.FILL
      , height: '11dp'
      })
       
    , fillerLeft: $ui.createView({
        width: '42dp'
      , height: '52dp'
      , top: 0
      , left: 0
      })
      
    , sentence: $ui.createLabel({
        text: model.sentence
      , width: $ui.FILL
      , height: $ui.SIZE
      , right: '6dp'
      , top: 0
      , color: gb.ui.color.base
      , font: {
          fontSize: gb.ui.font.base.size
        }
      })
      
    , fillerBottom: $ui.createView({
        width: $ui.FILL
      , height: '11dp'
      })
    }
  });
};