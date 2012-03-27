(function(){
  this.utils = window.utils || {};
  var slice   = Array.prototype.slice
    , splice  = Array.prototype.splice
    , _utils  = {} // Private utils
  ;

  _utils.overloadShortHand = function(types){
    types = types.toLowerCase();
    if (types.indexOf(',') == -1 && types.indexOf('t') == -1 && types.indexOf('u') == -1) return types;
    return types.match(/\b[a-z]/g).join('');
  };

  _utils.overload = function(functions){
    this.functionList = {};
    var shortHandKey;
    for (var argTypes in functions){
      shortHandKey = utils.overloadShortHand(argTypes);
      functionList[shortHandKey] = functions[argTypes];
    }
    return function(){
      var key = "", i = 0;
      for (; i < arguments.length; i++)
        key += Object.prototype.toString.call(arguments[i])[8].toLowerCase();
      if (!functionList.hasOwnProperty(key)) throw new Error("The function of type " + key + " is undefined");
      return functionList[key].apply(this, arguments);
    };
  };

  _utils.gbLoader = function($ele, options){
    if (!($ele instanceof jQuery)) $ele = $($ele);
    if (!$ele.hasClass('gb-loader')){
      var $loading  = $('<div class="gb-loading"></div>')
        , $overlay  = $('<div class="gb-loader-overlay"></div>')
        , options   = options || {}
      ;
      $loading.append('<span class="loader-block s1"></span>')
              .append('<span class="loader-block s2"></span>')
              .append('<span class="loader-block s3"></span>');
      if (exists(options.overlayCss)) $overlay.css(options.overlayCss);
      if (exists(options.loaderCss)) $loading.css(options.loaderCss);
      $overlay.append($loading);
      $ele.addClass('gb-loader').prepend($overlay);
    }else{
      $('.gb-loading, .gb-loader-overlay', $ele).remove();
      $ele.removeClass('gb-loader');
    }
    return function(){toggleLoader($ele, options)};
  };

  _utils.exists = function(variable){
    if (typeof x !== "undefined" && x !== null) {
      return true;
    }
    return false;
  };

  // Helper function to get a value from a Backbone object as a property or as a function.
  _utils.getValue = function(object, prop) {
    if (!(object && object[prop])) return null;
    return Object.isFunction(object[prop]) ? object[prop]() : object[prop];
  };

  // The self-propagating extend function that Backbone classes use.
  _utils.extend = function(protoProps, classProps){
    var child = utils.inherits(this, protoProps, classProps);
    child.extend = this.extend;
    return child;
  };

  _utils.goodyJoin =  function(data){
    var progressObj       = {}
      , mediasObj         = {}
      , goodiesJoined     = []
      , loyaltiesProgress = data.loyaltiesProgress
      , i                 = 0
      , businessId
      , cents
      , goodyJ
    ;
    for(; i<loyaltiesProgress.length; i++){
      businessId = loyaltiesProgress[i].org.id;
      progressObj[businessId] = loyaltiesProgress[i];
    }
    var bizMedias = data.bizMedias;
    for(i=0; i<bizMedias.length; i++){
      businessId = bizMedias[i]._id.toString();
      mediasObj[businessId] = bizMedias[i].media;
    }
    var loyalties = data.loyalties;
    for(var i=0; i<loyalties.length; i++){
      businessId = loyalties[i].org.id;
      goodyJ = loyalties[i];
      goodyJ.media = mediasObj[businessId];

      //customer may not have progress with the business yet..
      cents = exists(progressObj[businessId]) && exists(progressObj[businessId].data)
              ? progressObj[businessId].data.tapIns
              : null;
      goodyJ.funds.charityCentsRemaining = exists(cents) && exists(cents.charityCentsRemaining)? cents.charityCentsRemaining : 0;
      goodyJ.funds.charityCentsRaised    = exists(cents) && exists(cents.charityCentsRaised)   ? cents.charityCentsRaised    : 0;
      goodyJ.funds.charityCentsRedeemed  = exists(cents) && exists(cents.charityCentsRedeemed) ? cents.charityCentsRedeemed  : 0;
      goodiesJoined.push(goodyJ);
    }
    return goodiesJoined;
  };


  // Backbone.Events
  // -----------------

  // A module that can be mixed in to *any object* in order to provide it with
  // custom events. You may bind with `on` or remove with `off` callback functions
  // to an event; trigger`-ing an event fires all callbacks in succession.
  //
  //     var object = {};
  //     _.extend(object, Backbone.Events);
  //     object.on('expand', function(){ alert('expanded'); });
  //     object.trigger('expand');
  //
  _utils.Events = {
    // Bind an event, specified by a string name, `ev`, to a `callback`
    // function. Passing `"all"` will bind the callback to all events fired.
    on: function(events, callback, context) {
      var ev;
      events = events.split(/\s+/);
      var calls = this._callbacks || (this._callbacks = {});
      while (ev = events.shift()) {
        // Create an immutable callback list, allowing traversal during
        // modification.  The tail is an empty object that will always be used
        // as the next node.
        var list  = calls[ev] || (calls[ev] = {});
        var tail = list.tail || (list.tail = list.next = {});
        tail.callback = callback;
        tail.context = context;
        list.tail = tail.next = {};
      }
      return this;
    },

    // Remove one or many callbacks. If `context` is null, removes all callbacks
    // with that function. If `callback` is null, removes all callbacks for the
    // event. If `ev` is null, removes all bound callbacks for all events.
    off: function(events, callback, context) {
      var ev, calls, node;
      if (!events) {
        delete this._callbacks;
      } else if (calls = this._callbacks) {
        events = events.split(/\s+/);
        while (ev = events.shift()) {
          node = calls[ev];
          delete calls[ev];
          if (!callback || !node) continue;
          // Create a new list, omitting the indicated event/context pairs.
          while ((node = node.next) && node.next) {
            if (node.callback === callback &&
              (!context || node.context === context)) continue;
            this.on(ev, node.callback, node.context);
          }
        }
      }
      return this;
    },

    // Trigger an event, firing all bound callbacks. Callbacks are passed the
    // same arguments as `trigger` is, apart from the event name.
    // Listening for `"all"` passes the true event name as the first argument.
    trigger: function(events) {
      var event, node, calls, tail, args, all, rest;
      if (!(calls = this._callbacks)) return this;
      all = calls['all'];
      (events = events.split(/\s+/)).push(null);
      // Save references to the current heads & tails.
      while (event = events.shift()) {
        if (all) events.push({next: all.next, tail: all.tail, event: event});
        if (!(node = calls[event])) continue;
        events.push({next: node.next, tail: node.tail});
      }
      // Traverse each list, stopping when the saved tail is reached.
      rest = slice.call(arguments, 1);
      while (node = events.pop()) {
        tail = node.tail;
        args = node.event ? [node.event].concat(rest) : rest;
        while ((node = node.next) !== tail) {
          node.callback.apply(node.context || this, args);
        }
      }
      return this;
    }
  };

  // Model
  // --------------

  // Create a new model, with defined attributes. A client id ('cid')
  // is automatically generated and assigned for you.
  _utils.Model = (function(){
    var _model = function(attributes, options) {
      var defaults;
      attributes || (attributes = {});
      if (options && options.parse) attributes = this.parse(attributes);
      if (defaults = utils.getValue(this, 'defaults')) {
        attributes = Object.merge(Object.merge({}, defaults), attributes);
      }
      if (options && options.collection) this.collection = options.collection;
      this.attributes = {};
      this._escapedAttributes = {};
      this.cid = utils.uniqueId('c');
      if (!this.set(attributes, {silent: true})) {
        throw new Error("Can't create an invalid model");
      }
      delete this._changed;
      this._previousAttributes = Object.clone(this.attributes);
      this.initialize.apply(this, arguments);
    };
    Object.merge(_model.prototype, _utils.Events);
    Object.merge(_model.prototype, {
      idAttribute: 'id',
      initialize: function(){},
      toJSON: function() {
        return Object.clone(this.attributes);
      },
      get: function(attr) {
        return this.attributes[attr];
      },
      escape: function(attr) {
        var html;
        if (html = this._escapedAttributes[attr]) return html;
        var val = this.attributes[attr];
        return this._escapedAttributes[attr] = String.escape(val == null ? '' : '' + val);
      },
      has: function(attr) {
        return this.attributes[attr] != null;
      },
      set: function(key, value, options) {
        var attrs, attr, val;
        if (Object.isObject(key) || key == null) {
          attrs = key;
          options = value;
        } else {
          attrs = {};
          attrs[key] = value;
        }

        options || (options = {});
        if (!attrs) return this;
        if (attrs instanceof utils.Model) attrs = attrs.attributes;
        if (options.unset) for (attr in attrs) attrs[attr] = void 0;

        if (!this._validate(attrs, options)) return false;

        if (this.idAttribute in attrs) this.id = attrs[this.idAttribute];

        var now = this.attributes;
        var escaped = this._escapedAttributes;
        var prev = this._previousAttributes || {};
        var alreadySetting = this._setting;
        this._changed || (this._changed = {});
        this._setting = true;

        for (attr in attrs) {
          val = attrs[attr];
          if (!Object.equal(now[attr], val)) delete escaped[attr];
          options.unset ? delete now[attr] : now[attr] = val;
          if (this._changing && !Object.equal(this._changed[attr], val)) {
            this.trigger('change:' + attr, this, val, options);
            this._moreChanges = true;
          }
          delete this._changed[attr];
          if (!Object.equal(prev[attr], val) || (Object.has(now, attr) != Object.has(prev, attr))) {
            this._changed[attr] = val;
          }
        }
        if (!alreadySetting) {
          if (!options.silent && this.hasChanged()) this.change(options);
          this._setting = false;
        }
        return this;
      },
      unset: function(attr, options) {
        (options || (options = {})).unset = true;
        return this.set(attr, null, options);
      },
      clear: function(options) {
        (options || (options = {})).unset = true;
        return this.set(Object.clone(this.attributes), options);
      },
      url: function() {
        var base = utils.getValue(this.collection, 'url') || utils.getValue(this, 'urlRoot') || urlError();
        if (this.isNew()) return base;
        return base + (base.charAt(base.length - 1) == '/' ? '' : '/') + encodeURIComponent(this.id);
      },
      parse: function(resp, xhr) {
        return resp;
      },
      clone: function() {
        return new this.constructor(this.attributes);
      },
      isNew: function() {
        return this.id == null;
      },
      change: function(options) {
        if (this._changing || !this.hasChanged()) return this;
        this._changing = true;
        this._moreChanges = true;
        for (var attr in this._changed) {
          this.trigger('change:' + attr, this, this._changed[attr], options);
        }
        while (this._moreChanges) {
          this._moreChanges = false;
          this.trigger('change', this, options);
        }
        this._previousAttributes = Object.clone(this.attributes);
        delete this._changed;
        this._changing = false;
        return this;
      },
      hasChanged: function(attr) {
        if (!arguments.length) return !Object.isEmpty(this._changed);
        return this._changed && Object.has(this._changed, attr);
      },
      changedAttributes: function(diff) {
        if (!diff) return this.hasChanged() ? Object.clone(this._changed) : false;
        var val, changed = false, old = this._previousAttributes;
        for (var attr in diff) {
          if (Object.equal(old[attr], (val = diff[attr]))) continue;
          (changed || (changed = {}))[attr] = val;
        }
        return changed;
      },
      previous: function(attr) {
        if (!arguments.length || !this._previousAttributes) return null;
        return this._previousAttributes[attr];
      },
      previousAttributes: function() {
        return Object.clone(this._previousAttributes);
      },
      isValid: function() {
        return !this.validate(this.attributes);
      },
      _validate: function(attrs, options) {
        if (options.silent || !this.validate) return true;
        attrs = Object.merge(Object.merge({}, this.attributes), attrs);
        var error = this.validate(attrs, options);
        if (!error) return true;
        if (options && options.error) {
          options.error(this, error, options);
        } else {
          this.trigger('error', this, error, options);
        }
        return false;
      }
    });
    return _model;
  })();

  _utils.View = (function (){
    var _view = function(options) {
      this.cid = utils.uniqueId('view');
      this._configure(options || {});
      this._ensureElement();
      this.initialize.apply(this, arguments);
      this.delegateEvents();
    };

    // Cached regex to split keys for `delegate`.
    var eventSplitter = /^(\S+)\s*(.*)$/;

    // List of view options to be merged as properties.
    var viewOptions = ['model', 'collection', 'el', 'id', 'attributes', 'className', 'tagName'];

    // Set up all inheritable **Backbone.View** properties and methods.
    Object.merge(_view.prototype, _utils.Events);
    Object.merge(_view.prototype, {
      // The default `tagName` of a View's element is `"div"`.
      tagName: 'div',

      // jQuery delegate for element lookup, scoped to DOM elements within the
      // current view. This should be prefered to global lookups where possible.
      $: function(selector) {
        return this.$el.find(selector);
      },
      initialize: function(){},
      render: function() {
        return this;
      },
      remove: function() {
        this.$el.remove();
        return this;
      },
      make: function(tagName, attributes, content) {
        var el = document.createElement(tagName);
        if (attributes) $(el).attr(attributes);
        if (content) $(el).html(content);
        return el;
      },
      setElement: function(element, delegate) {
        this.$el = $(element);
        this.el = this.$el[0];
        if (delegate !== false) this.delegateEvents();
        return this;
      },
      delegateEvents: function(events) {
        if (!(events || (events = utils.getValue(this, 'events')))) return;
        this.undelegateEvents();
        for (var key in events) {
          var method = events[key];
          if (!Object.isFunction(method)) method = this[events[key]];
          if (!method) throw new Error('Event "' + events[key] + '" does not exist');
          var match = key.match(eventSplitter);
          var eventName = match[1], selector = match[2];
          method = method.bind(this);
          eventName += '.delegateEvents' + this.cid;
          if (selector === '') {
            this.$el.bind(eventName, method);
          } else {
            this.$el.delegate(selector, eventName, method);
          }
        }
      },
      undelegateEvents: function() {
        this.$el.unbind('.delegateEvents' + this.cid);
      },
      _configure: function(options) {
        if (this.options) options = Object.merge({}, this.options, options);
        for (var i = 0, l = viewOptions.length; i < l; i++) {
          var attr = viewOptions[i];
          if (options[attr]) this[attr] = options[attr];
        }
        this.options = options;
      },
      _ensureElement: function() {
        if (!this.el) {
          var attrs = utils.getValue(this, 'attributes') || {};
          if (this.id) attrs.id = this.id;
          if (this.className) attrs['class'] = this.className;
          this.setElement(this.make(this.tagName, attrs), false);
        } else {
          this.setElement(this.el, false);
        }
      }
    });

    return _view;
  })();

  var idCounter = 0;
  _utils.uniqueId = function(prefix) {
    var id = idCounter++;
    return prefix ? prefix + id : id;
  };

  _utils.exists = function(x) {
    if (typeof x !== "undefined" && x !== null)
    return true;
    return false;
  };

  // Helper function to correctly set up the prototype chain, for subclasses.
  // Similar to `goog.inherits`, but uses a hash of prototype properties and
  // class properties to be extended.
  var ctor = function(){};
  _utils.inherits = function(parent, protoProps, staticProps) {
    var child;
    if (protoProps && protoProps.hasOwnProperty('constructor')) {
      child = protoProps.constructor;
    } else {
      child = function(){ parent.apply(this, arguments); };
    }
    Object.merge(child, parent);
    ctor.prototype = parent.prototype;
    child.prototype = new ctor();
    if (protoProps) Object.merge(child.prototype, protoProps);
    if (staticProps) Object.merge(child, staticProps);
    child.prototype.constructor = child;
    child.__super__ = parent.prototype;
    return child;
  };

  _utils.View.extend = _utils.Model.extend = _utils.extend;


  // Export
  for (var key in _utils){
    this.utils[key] = _utils[key];
  }
}).call(this);