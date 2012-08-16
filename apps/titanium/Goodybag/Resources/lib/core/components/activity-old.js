/**
 * Let's just make this damn thing a factory
 */

(function(){
  var $ui = Ti.UI;
  
  var constructor = function(model){
    this.model = model;
    // Main view wrapper
    this.view = Titanium.UI.createView({
      width: Ti.UI.FILL
    , height: Ti.UI.SIZE
    , top: '6dp'
    , backgroundColor: '#fff'
    , borderColor: '#ccc'
    , borderWidth: 1
    , borderRadius: 5
    , layout: 'horizontal'
    });
  };
  constructor.prototype = {
    render: function(){
      var events = this.model.attributes.events
      , attr = this.model.attributes
      , imgSrc = (attr.who.id || attr.who.screenName)
               ? ("-secure/" + escape(attr.who.id || attr.who.screenName))
               : "/000000000000000000000000"
      , rowHeight = '16dp'
      , createRow = function(children){
          children = children || [];
          var row = $ui.createView({
            layout: 'horizontal'
          , width: $ui.FILL
          , height: rowHeight
          , bottom: '1dp'
          });
          for (var i = 0; i < children.length; i++){
            row.add(children[i]);
          }
          return row;
        }
      , createLabel = function(text, color, weight, isFill){
          return $ui.createLabel({
            text: text
          , width: isFill ? $ui.FILL : $ui.SIZE
          , height: rowHeight
          , color: color
          , font: {
              fontSize: gb.ui.font.base.size
            , fontWeight: weight || 'normal'
            }
          });
        }
      , imageView
      , rightSide = $ui.createView({
          layout: 'vertical'
        , width: $ui.FILL
        , height: $ui.SIZE
        , top: 0
        , left: "8dp"
        })
      , verticalGap = $ui.createView({
          width: $ui.FILL
        , height: '11dp'
        })
      , event
      ;
      
      this.view.add(verticalGap);
      
      // Add profile picture
      console.log("https://s3.amazonaws.com/goodybag-uploads/consumers" + imgSrc + "-85.png");
      this.view.add($ui.createImageView({
        image: "https://s3.amazonaws.com/goodybag-uploads/consumers" + imgSrc + "-85.png"
      , title: attr.who.screenName
      , width: "42dp"
      , height: "42dp"
      
      // For now, I'm getting rid of border due to the uncertainty of whether or not
      // A user even has a profile picture
      // , borderWidth: 1
      // , borderColor: isUnknown ? '#ededed' : '#ccc'
      , borderRadius: 5
      , top: '4dp'
      , left: "-3dp"
      }));
      
      // Determine sentence
      var firstRow;
      for (var i = 0; i < events.length; i++){
        event = events[i];
        firstRow = createRow();
        
        // First one, add the name
        if (i === 0){
          firstRow.add(createLabel(attr.who.screenName || "Someone", gb.ui.color.base, 'bold'));
        }else{ // Else conjuction 
          firstRow.add(createLabel('And', gb.ui.color.grayLighter))
        }
        
        switch (event){
          case "eventRsvped":
            // Finish action
            firstRow.add(createLabel(' rsvpd to attend', gb.ui.color.grayLighter, null, true));
            rightSide.add(firstRow);
            // Add subject
            rightSide.add(createRow([
              createLabel('at ', gb.ui.color.grayLighter)
            , createLabel(attr.data.event.entity.name, gb.ui.color.base, 'bold', true)
            ]));
            // Add result
            rightSide.add(createRow([
              createLabel(' at ', gb.ui.color.grayLighter)
            , createLabel(attr.when, gb.ui.color.blue, null, true)
            ]));
            break;
          case "pollCreated":
            // Finish action
            firstRow.add(createLabel(' asked:', gb.ui.color.grayLighter, null, true));
            rightSide.add(firstRow);
            // Add subject
            rightSide.add(createRow([
              createLabel(attr.data.poll.question, gb.ui.color.blue, null, true)
            ]));
            break;
          case "pollAnswered":
            // Finish action
            firstRow.add(createLabel(' answered:', gb.ui.color.grayLighter, null, true));
            rightSide.add(firstRow);
            // Add subject
            rightSide.add(createRow([
              createLabel(attr.data.poll.question, gb.ui.color.blue, null, true)
            ]));
            break;
          case "btTapped":
            // Finish action
            firstRow.add(createLabel(' tapped in', gb.ui.color.grayLighter, null, true));
            rightSide.add(firstRow);
            // Add subject
            rightSide.add(createRow([
              createLabel('at ', gb.ui.color.grayLighter)
            , createLabel(attr.where.org.name, gb.ui.color.base, 'bold', true)
            ]));
            // Add result
            rightSide.add(createRow([
              createLabel('raising ', gb.ui.color.base)
            , createLabel(attr.data.donationAmount + "\u00A2", gb.ui.color.pink, 'medium')
            , createLabel(' for ', gb.ui.color.base)
            , createLabel(attr.data.charity ? attr.data.charity.name : "charity", gb.ui.color.blue, null, true)
            ]));
            break;
          case "fundsDonated":
            // Finish action
            firstRow.add(createLabel(' donated', gb.ui.color.grayLighter, null, true));
            rightSide.add(firstRow);
            // Add subject
            rightSide.add(createRow([
              createLabel(attr.data.amount + "\u00A2", gb.ui.color.pink)
            , createLabel(" to charity", gb.ui.color.grayLighter, null, true) 
            ]));
            break;
          default: return;
        }
      }
      this.view.add(rightSide);
      this.view.add(verticalGap);
      
      return this;
    }
  };
  
  GB.Views.Activity = constructor;
  exports = constructor;
})();