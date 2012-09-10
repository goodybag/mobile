GB.PeriodicRefresher = function(api, store, period){
  this.api = api;
  this.store = store;
  this.period = period || 1000 * 30;
  this.isRunning = false;
  var $this = this;
  this._curriedTick = function(){ $this._onTick(); };
};

GB.PeriodicRefresher.prototype = {
  start: function(){
    gb.utils.debug("[Periodic Updater] - start");
    if (this.isRunning) return;
    this.periodic = setInterval(this._curriedTick, this.period); 
    this.isRunning = true;
  }
, stop: function(){
    gb.utils.debug("[Periodic Updater] - stop");
    if (!this.isRunning) return;
    clearInterval(this.periodic);
    this.isRunning = false;
  }
, isRunning: function(){
    return this.isRunning;
  }
, _onTick: function(){
    gb.utils.debug("[Periodic Updater] - tick");
    this.store = {};
    this.api(function(){  });
  }
};
