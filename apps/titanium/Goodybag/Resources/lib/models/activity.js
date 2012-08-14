/*
 * Model.Activty
 */

if(!GB.Models) 
  GB.Models = {};

GB.Models.Activity = function(attributes){
  this.attributes = attributes;
  this.attributes.timestamp = moment(new Date(this.attributes.dates.lastModified)).from();
  if (attributes.events && attributes.events.indexOf('eventRsvped') > -1){
    this._formatDate(); 
  }
  this.generateSentence();
};

GB.Models.Activity.prototype = {
  /*
   * Sets the this.when date for event rsvps
   */
  _formatDate: function(){
    var originalCalendar = moment.calendar;
    moment.calendar = {
      lastDay   : '[Yesterday at] LT',
      sameDay   : '[Today at] LT',
      nextDay   : '[Tomorrow at] LT',
      lastWeek  : '[last] dddd [at] LT',
      nextWeek  : '[on the upcoming] dddd [at] LT',
      sameElse  : '[on] L'
    };
    this.when = moment(Date.create(this.attributes.data.event.dates.actual)).calendar();
    moment.calendar = originalCalendar;
  }
  
, getSentence: function(){
    return this.sentence;
  }
  
, generateSentence: function(){
    var
      attr      = this.attributes
    , sentence  = attr.who.screenName || "Someone"
    , events    = attr.events
    ;
    // Determine sentence
    for (var i = 0, event; i < events.length; i++){
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
    this.sentence = sentence + " " + attr.timestamp;
    return sentence;
  }
};