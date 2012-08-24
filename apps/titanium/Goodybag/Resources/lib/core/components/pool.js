var Pool = function (obj) {
  function extend (from, to) {
    if (from == null || typeof from != "object") return from;
    if (from.constructor != Object && from.constructor != Array) return from;
    if (
      from.constructor == Date || 
      from.constructor == RegExp || 
      from.constructor == Function ||
      from.constructor == String || 
      from.constructor == Number || 
      from.constructor == Boolean
    ) return new from.constructor(from);
    to = to || new from.constructor();
    for (var name in from) to[name] = typeof to[name] == "undefined" ? extend(from[name], null) : to[name];
    return to;
  }
  
  if (obj.build) {
    obj = extend(obj);
    if (obj.events) delete obj.events;
  } 
  
  return {
    pool: obj.build? null : obj,
    type: obj.build? obj.build.type || null : null,
    area: obj.build? obj.build.area || null : null,
    method: obj.build? obj.build.method || null : null,
    holder: obj,
    pendingChildren: null,
    pendingEvents: null,
    children: null,
    events: null,
    cuuid: 0,
    euuid: 0,
    pooler: true,
    
    create: function () {
      if (this.pool) return this;
      if (this.holder.build) this.holder.build = null;
      if (this.type) this.pool = Titanium[this.area || 'UI'][(this.method || 'create') + this.type](this.holder), this.holder = null;
      if (this.pendingChildren) for (var i in this.pendingChildren) this.add(this.pendingChildren[i], i), this.pendingChildren[i] = null;
      if (this.pendingEvents) for (var i in this.pendingEvents) this.addEvent(this.pendingEvents[i].type, this.pendingEvents[i].callback, i);
      return this;
    },
    
    open: function () {
      if (!this.pool) this.create();
      this.pool.open();
    },
    
    show: function () {
      if (this.pool) this.pool.show();
    },
    
    hide: function () {
      if (this.pool) this.pool.hide();
    },
    
    get: function (id) {
      return id? this.pool? this.pool[id] : this.holder[id] : this.pool;
    },
    
    getChild: function (id) {
      return this.children? this.children[id] : this.pendingChildren[id];
    },
    
    getEvent: function (id) {
      return this.events? this.events[id] : this.pendingEvents[id];
    },
    
    set: function (id, value) {
      if (this.pool) this.pool[id] = value;
      else this.holder[id] = value;
    },
    
    add: function (child, id) {
      var area = this.pool? 'children' : 'pendingChildren';
      if (!this[area]) this[area] = {};
      id = id || this.cuuid++;
      this[area][id] = child.pooler? child : new Pool(child), this[area][id].create();
      if (this.pool) this.pool.add(this[area][id].pool);
      return id;
    },
    
    addEvent: function (type, callback, id) {
      var area = this.pool? 'events' : 'pendingEvents';
      if (!this[area]) this[area] = {};
      id = id || this.euuid++;
      this[area][id] = { type: type, callback: callback };
      if (this.pool) this.pool.addEventListener(this[area][id].type, this[area][id].callback);
      return true;
    },
    
    removeEvent: function (id) {
      
    },
    
    addEventListener: function (type, callback, id) { 
      return this.addEvent(type,callback,id); 
    },
    
    removeEventListener: function (id) {
      return this.removeEvent(id);
    },
    
    remove: function (obj) {
      if (!this.children) return false;
      if (typeof obj === 'string') if (this.children[obj]) this._removeChild(obj);
      else for (var i in this.children) if (this.children[i].pool == obj) this._removeChild(i);
      return true;
    },
    
    close: function (excessive) {
      if (this.pool.hide) 
        console.log('hiding pool'),
        this.pool.hide();
      
      if (this.children) {
        console.log('removing children from: ' + this.pool.name);
        for (var i in this.children)
          this._remove(i);
      }
          
      if (this.events) {
        console.log('removing events');
        for (var i in this.events)
          this.pool.removeEventListener(this.events[i].type, this.events[i].callback),
          this.events[i] = null;
      }
      
      if (this.pool.close) 
        console.log('closing the pool'),
        this.pool.close();
        
      console.log('nullifying the objects')
      this.pool = null;
      this.holder = null;
      this.children = null;
      this.pendingChildren = null;
      this.pendingEvents = null;
      this.events = null;
      
      if (excessive) {
        console.log('nullifying excessives')
        , this.area = null
        , this.method = null
        , this.type = null;
        
        delete this.pool, this.holder, this.children, this.pendingChildren, this.pendingEvents = null, this.events = null;
        delete this.area, this.method, this.type;
      }
    },
    
    _removeEvent: function (id) {
      var area = this.pool? 'events' : 'pendingEvents';
      if (this.pool) this.pool.removeEventListener(this[area][id].type, this[area][id].callback);
      this[area][id] = null;
      delete this[area][id];
    },
    
    _removeChild: function (id) {
      console.log('removing ' + id);
      var area = this.pool? 'children' : 'pendingChildren';
      if (this.pool) this.pool.remove(this[area][id].pool);
      this[area][id].close(true),
      this[area][id] = null;
      delete this[area][id];
    }
  };
};
