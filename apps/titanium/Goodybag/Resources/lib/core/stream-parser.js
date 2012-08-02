/*
 * Stream Parser
 * For any questions, comments, or complains contact Lalit Kapoor
 */

var streamParser = function(){};

streamParser._formatDate = function(date){
  var originalCalendar = moment.calendar;
  moment.calendar = {
    lastDay : '[Yesterday at] LT',
    sameDay : '[Today at] LT',
    nextDay : '[Tomorrow at] LT',
    lastWeek : '[last] dddd [at] LT',
    nextWeek : '[on the upcoming] dddd [at] LT',
    sameElse : '[on] L'
  };

  var formatted = moment(date).calendar();

  moment.calendar = originalCalendar;

  return formatted;
};

streamParser.render = function(activity){
  var events = activity.events;
  var sentences = {};
  var event = null;

  if (events.length<1){
    return null;
  }

  for (var i=0; i<events.length; i++){
    event = events[i];
    sentences[event] = streamParser.route(activity, event);
  }

  var sentence = null;
  if(events.length>1){
    sentence = streamParser.join(sentences);
  } else {
    sentence = sentences[events[0]];
  }
  return app.fragments.activity({timestamp: moment(Date.create(activity.dates.lastModified)).from(), who: activity.who, action: sentence});
};

streamParser.renderSentence = function(activity){
  var events = activity.events;
  var sentences = {};
  var event = null;

  if (events.length<1){
    return null;
  }

  for (var i=0; i<events.length; i++){
    event = events[i];
    sentences[event] = streamParser.route(activity, event);
  }

  var sentence = null;
  if(events.length>1){
    sentence = streamParser.join(sentences);
  } else {
    sentence = sentences[events[0]];
  }
  return sentence;
};

streamParser.route = function(activity, event){
  var sentence = null;
  switch(event){
    case "eventRsvped":
      sentence = streamParser.eventRsvped(activity);
      break;
    case "pollCreated":
      sentence = streamParser.pollCreated(activity);
      break;
    case "pollAnswered":
      sentence = streamParser.pollAnswered(activity);
      break;
    case "btTapped":
      sentence = streamParser.btTapped(activity);
      break;
    case "fundsDonated":
      sentence = streamParser.fundsDonated(activity);
      break;
    default:
      sentence = null;
  }
    return sentence;
};

streamParser.join = function (sentences){
  //no case yet
  return sentences.join(" and ");
};

streamParser.eventRsvped = function(activity){
  /*
  * Sentence: XX RSVPed to attend a Goodybag event at YY on ZZ
  */
  var who = activity.who;
  var where = activity.data.event.entity;
  var when = activity.data.event.dates.actual;

  //var sentence = sprintf("%s RSVPed to attend a Goodybag event at %s %s", who, where, moment(when).calendar());
  var sentence = app.fragments.activityEventRsvped({where: where, when: streamParser._formatDate(Date.create(when))});
  return sentence;
};

streamParser.pollAnswered = function(activity){
  /*
  * Sentence: XX Answered a poll question: YY
  */
  var what = activity.what;
  what.name = activity.data.poll.name;
  what.question = activity.data.poll.question;

  var sentence = app.fragments.activityPollAnswered({what: what});
  return sentence;
};

streamParser.pollCreated = function(activity){
  /*
  * Sentence: XX Created a poll question: YY
  */
  var what = activity.what;
  what.name = activity.data.poll.name;
  what.question = activity.data.poll.question;

  var sentence = app.fragments.activityPollCreated({what: what});
  return sentence;
};

streamParser.btTapped = function(activity){
  /*
  * Sentence: XX tapped in at: YY and spent $SS.ss resulting in a donation of $DD.dd
  */
  var where = activity.where;
  var data = activity.data;

  var sentence = app.fragments.activityBtTapped({where: where, data: data});
  return sentence;
};

streamParser.fundsDonated = function(activity){
  /*
  * Sentence: XX donated funds to YY
  */
  //activity.data.donation.amount;
  var sentence = app.fragments.activityFundsDonated({data:activity.data});
  return sentence;
};

module.exports = streamParser;
