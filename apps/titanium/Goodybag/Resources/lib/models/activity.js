/*
 * Model.Activty
 */

if(!GB.Models) 
  GB.Models = {};
  
(function(){
  var formatDate = function(attributes){
    var originalCalendar = moment.calendar, when;
    moment.calendar = {
      lastDay   : '[Yesterday at] LT',
      sameDay   : '[Today at] LT',
      nextDay   : '[Tomorrow at] LT',
      lastWeek  : '[last] dddd [at] LT',
      nextWeek  : '[on the upcoming] dddd [at] LT',
      sameElse  : '[on] L'
    };
    when = moment(Date.create(attributes.data.event.dates.actual)).calendar();
    moment.calendar = originalCalendar;
    return when;
  };
  
  var generateSentence = function(attributes){
    var sentence = attributes.who.screenName || "Someone", events = attributes.events;
    // Determine sentence
    for (var i = 0, event; i < events.length; i++){
      event = events[i];
      switch (event){
        case "eventRsvped":
          sentence += " rsvpd to attend a Goodybag event at " + attributes.data.event.entity.name + " " + attributes.when;
          break;
        case "pollCreated":
          sentence += " created the poll question: " + attributes.data.poll.question;
          break;
        case "pollAnswered":
          sentence += " answered the poll question: " + attributes.data.poll.question;
          break;
        case "btTapped":
          sentence += " tapped in at " + attributes.where.org.name + " and raised " + attributes.data.donationAmount + "\u00A2 for ";
          sentence += (attributes.data.charity) ? attributes.data.charity.name : "charity"; 
          break;
        case "fundsDonated":
          sentence += " donated " + attributes.data.amount + "\u00A2 to charity";
          break;
        default:
          sentence = "";
      }
      // Conjunction for multiple events
      if (i !== (events.length - 1)) sentence += " and";
    }
    sentence = sentence + " " + attributes.timestamp;
    return sentence;
  };
  
  GB.Models.getActivity = function(attributes){
    if (attributes.dates.lastModified) {
      attributes.timestamp = moment(new Date(attributes.dates.lastModified));
      attributes.timestamp = attributes.timestamp.from();
    }
    
    if (attributes.events && attributes.events.indexOf('eventRsvped') > -1){
      attributes.when = formatDate(attributes);
    }
    
    attributes.sentence = generateSentence(attributes);
    
    return attributes;
  };
})();