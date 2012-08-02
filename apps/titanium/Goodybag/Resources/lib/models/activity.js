/*
 * Model.Activty
 */

var streamParser  = require('./../stream-parser')
,   moment        = require('./../moment');

var Activity = function(attributes){
  this.attributes = attributes;
  this.attributes.action = streamParser.renderSentence(attributes);
  this.attributes.timestamp = moment(Date.create(attributes.dates.lastModified)).from();
};

Activity.prototype = {
  /*
   * Returns the activity we need to render the view
   */
  toJSON: function(){
    var attr = this.attributes;
    return {
      who: {
        id: attr.who.id
      , name: attr.who.name
      , screenName: attr.who.screenName
      }
    , action: attr.action
    , timestamp: attr.timestamp
    };
  }
};

module.exports = Activity;