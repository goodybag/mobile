(function(){
  this.app = window.app || {};
  this.app.Models = window.app.Models || {};
  var models = {};

  models.Goody = utils.Model.extend({
    initialize: function(attributes, options){
      // Set the percentage field
      var percentage = Math.ceil((attributes.funds.charityCentsRemaining / attributes.funds.centsRequired)*100);
      var funds = attributes.funds;
      funds.centsTilGoody = attributes.funds.centsRequired - attributes.funds.charityCentsRemaining;
      if (percentage > 100){
        percentage = 100;
        funds.centsTilGoody = 0;
      }
      if (percentage < 0){
        //this shouldnt be possible..
        percentage = 0
        funds.centsTilGoody = goody.funds.centsRequired;
      };
      this.set('funds', funds);
      this.set('percentage', percentage);

      return this;
    }
  });

  models.User = utils.Model.extend({

  });

  // Export
  for (var key in models){
    this.app.Models[key] = models[key];
  }
}).call(this);