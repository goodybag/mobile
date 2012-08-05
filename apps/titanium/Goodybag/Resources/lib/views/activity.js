(function(){
  GB.Views.ActivityView = function(model, options){
    this.options = {
      suppressBorder: false
    };
    
    for (var key in options){
      this[options] = options[options];
    }
    
    this.model = model;
    // Main view wrapper
    this.view = Titanium.UI.createView({
      width: '100%'
    , height: "80dp"
    , contentHeight: 'auto'
    });
  };
  GB.Views.ActivityView.prototype = {
    render: function(){
      var events = this.model.attributes.events
      , attr = this.model.attributes
      , pictureContainer = Titanium.UI.createView({
          width: "16%"
        , height: "auto"
        , left: 0
        , top: 0
        })
      , textContainer = Titanium.UI.createView({
          width: "84%"
        , height: "auto"
        , left: "16%"
        , top: 0
        })
      , borderBottom = Titanium.UI.createView({
          bottom: 0
        , height: "1dp"
        , backgroundColor: '#ccc'
        })
      , sentence = attr.who.screenName || "Someone"
      , event
      ;
      console.log(attr);
      // Add profile picture
      pictureContainer.add(Titanium.UI.createImageView({
        image: "https://goodybag-uploads.s3.amazonaws.com/consumers/" + attr.who.id + "-85.png"
      , title: attr.who.screenName
      , top: 0
      , left: "10dp"
      , width: "auto"
      , contentHeight: 'auto'
      }));
      
      // Determine sentence
      for (var i = 0; i < events.length; i++){
        event = events[i];
        switch (event){
          case "eventRsvped":
            sentence += " rsvpd to attend a Goodybag event at " + attr.data.event.entity.name + " " + attr.when;
            break;
          case "pollCreated":
            sentence += " created the poll question: " + attr.data.poll.question;
            break;
          case "pollAnswered":
            sentence += " answered the poll question: " + attr.data.poll.question;
            break;
          case "btTapped":
            sentence += " tapped in at " + attr.where.org.name + " and raised " + attr.data.donationAmount + "\u00A2 for ";
            sentence += (attr.data.charity) ? attr.data.charity.name : "charity"; 
            break;
          case "fundsDonated":
            sentence += " donated " + attr.data.amount + "\u00A2 to charity";
            break;
          default:
            sentence = "";
        }
        // Conjunction for multiple events
        if (i !== (events.length - 1)) sentence += " and";
      }
      
      // Add stream text
      textContainer.add(Titanium.UI.createLabel({
        text: sentence
      , width: "auto"
      , contentHeight: "auto"
      , textAlign: Titanium.UI.TEXT_ALIGNMENT_LEFT
      , top: "28dp"
      , left: "10dp"
      , font: {
          fontSize: 14
        , fontStyle: 'normal'
        }
      }));
      
      this.view.add(pictureContainer);
      this.view.add(textContainer);
      if (this.options.suppressBorder) this.view.add(borderBottom);
      console.log(this.view);
      return this;
    }
  };
})();