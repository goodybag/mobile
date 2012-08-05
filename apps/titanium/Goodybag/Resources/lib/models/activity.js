/*
 * Model.Activty
 */

if(!GB.Models) 
  GB.Models = {};

GB.Models.Activity = function(attributes){
  this.attributes = attributes;
  if (attributes.events && attributes.events.indexOf('eventRsvped') > -1){
    this.attributes.timestamp = moment(Date.create(this.attributes.dates.lastModified)).from();
    this._formatDate(); 
  }
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
};