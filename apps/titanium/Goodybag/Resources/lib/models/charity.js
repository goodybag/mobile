/*
 * Model.Activty
 */

if(!GB.Models) 
  GB.Models = {};

(function(){
  var constructor = function(data){
    this.attributes = data;
  };
  constructor.prototype = {
    select: function(callback){
      
    }
  };
  
  GB.Models.Charity = constructor;
  exports = constructor;
})();
