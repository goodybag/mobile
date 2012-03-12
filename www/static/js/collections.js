(function(){
  this.app = window.app || {};
  this.app.Collections = window.app.Collections || {};
  var collections = {};

  collections.Loyalties = Backbone.Collections.extend({
    model: app.Models.Loyalty,
    url: '/api/consumers/loyalties?progress=1&media=1',

    getJoined: function(){
      var progressObj = {};
      var mediasObj = {};
      var businessId;
      var loyaltiesProgress = data.loyaltiesProgress;
      for(var i=0; i<loyaltiesProgress.length; i++){
        businessId = loyaltiesProgress[i].org.id;
        progressObj[businessId] = loyaltiesProgress[i];
      }
      /*var bizMedias = data.bizMedias;
      for(var i=0; i<bizMedias.length; i++){
        businessId = bizMedias[i]._id.toString();
        mediasObj[businessId] = bizMedias[i].media;
      }*/
      var loyalties = data.loyalties;
      var cents;
      var goodiesJoined = [], goodyJ;
      for(var i=0; i<loyalties.length; i++){
        businessId = loyalties[i].org.id;
        goodyJ = loyalties[i];
        //goodyJ.media = mediasObj[businessId];
        cents = exists(progressObj[businessId])? progressObj[businessId].data.tapIns : null; //customer may not have progress with the business yet..
        goodyJ.funds.charityCentsRemaining = exists(cents) && exists(cents.charityCentsRemaining)? cents.charityCentsRemaining : 0;
        goodyJ.funds.charityCentsRaised    = exists(cents) && exists(cents.charityCentsRaised)   ? cents.charityCentsRaised    : 0;
        goodyJ.funds.charityCentsRedeemed  = exists(cents) && exists(cents.charityCentsRedeemed) ? cents.charityCentsRedeemed  : 0;
        goodiesJoined.push(goodyJ);
      }
      return goodiesJoined;
    }
  });

  // Export
  for (var name in collections){
    this.app.Collections[name] = collections[name];
  }
}).call(this);