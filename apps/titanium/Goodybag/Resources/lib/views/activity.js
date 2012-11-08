(function(){
  GB.Views.Activity = function(model, options){
    this.options = {
      suppressBorder: false
    };
    
    for (var key in options){
      this.options[key] = options[options];
    }
    
    this.model = model;
    
    // Main view wrapper
    this.view = Titanium.UI.createView({
      width: Ti.UI.FILL
    , height: Ti.UI.SIZE
    , top: '6dp'
    , layout: 'horizontal'
    });
  };
  
  GB.Views.Activity.prototype = {
    render: function(){
      var events = this.model.attributes.events
      , attr = this.model.attributes
      , sentence = attr.who.screenName || "Someone"
      , imgSrc = attr.who.id || attr.who.screenName || "000000000000000000000000"
      , event, avatar, text
      ;

      // Add profile picture
      try {
        avatar = gb.style.get('stream.avatar');
        avatar.image = "https://s3.amazonaws.com/goodybag-uploads/consumers-secure/" + imgSrc + "-85.png";
        avatar.title = attr.who.screenName;
      
        this.view.add(Titanium.UI.createImageView(avatar));
      catch (e) {
        gb.utils.warn('Caught exception loading image.');
      }
      
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
      text = gb.style.get('stream.text');
      text.text = sentence;
      
      this.view.add(Titanium.UI.createLabel(text));

      if (!this.options.suppressBorder){
        this.view.add(Titanium.UI.createView({
          bottom: 0
        , width: Ti.UI.FILL
        , height: "1dp"
        , top: '10dp'
        , backgroundColor: '#ddd'
        }));
        
        this.view.add(Titanium.UI.createView({
          bottom: 0
        , width: Ti.UI.FILL
        , height: "1dp"
        , top: 0
        , backgroundColor: '#fff'
        }));
      }
      return this;
    }
  };
})();