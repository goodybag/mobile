
gb.style = {
  base:    {},
  iphone:  {},
  retina:  {},
  android: {},
  web:     {},
  
  types:   {
    images: [ 
      'image', 'selectedImage', 'backButtonTitleImage', 'barImage', 'titleImage',
      'backgroundImage', 'backgroundDisabledImage', 'backgroundSelectedImage', 'backgroundFocusedImage',
      'tabsBackgroundImage', 'tabsBackgroundDisabledImage', 'tabsBackgroundSelectedImage', 'tabsBackgroundFocusedImage',
      'leftTrackImage', 'rightTrackImage', 'thumbImage', 'disabledLeftTrackImage', 'disabledRightTrackImage', 'disabledThumbImage'
    ],
    
    posizing: [ 
      'top', 'left', 'right', 'bottom', 'height', 'width' 
    ]
  },
  
  merger: function (n, str, o, swap) {
    var x, y;
    if(str.indexOf(' ') != -1) {
      str = str.split(' ')
      for (var i = 0; i < str.length; i++)
      swap = swap ? true : i > 0 ? true : false,
         x = (swap ? o : gb.utils.ref(gb.style[n], str[i])) || {}, 
         y = (swap ? gb.utils.ref(gb.style[n], str[i]) : o) || {},
         o = gb.utils.merge(x, y);
    } else {
      x = (swap ? o : gb.utils.ref(gb.style[n], str)) || {};
      y = (swap ? gb.utils.ref(gb.style[n], str) : o) || {};
      o = gb.utils.merge(x, y);
    }
    
    return o;
  },
  
  /**
   * It's magical. That's all there is to it.
   * 
   * This will let you fetch a style applied to one of the above arrays 
   * and it will delegate a system of events 
   * 
   * @param {Object} name
   * @param {Object} style
   * @param {Object} options
   */
  get: function (platform, style, options, context) {
    var dest = null, base = null, build = true, name = 'base';
    
    if (style == null) 
      style = platform, platform = gb.style.type();
    
    if (typeof style === 'boolean') 
      build = style, style = platform, platform = gb.style.type();
      
    if (typeof object === 'boolean') 
      build = object, object = null;
      
    if (typeof context === 'boolean')
      build = context, context = null;
      
    if (({}).toString.call(style) === '[object Object]') {
      if (options) context = options, options = null;
      options = style, style = platform, platform = gb.style.type();
    }

    if (!gb.style[name]) 
      return null;
    else 
      orig = this.merger(name, style, {}), orig = this.merger(platform, style, orig, true);

    if (platform == 'retina') 
      orig = this.merger('iphone', style, orig || {});
      
    if (!orig || orig == undefined) 
      return null;
    else
      dest = gb.utils.merge(orig, options || {});

    if (!dest || dest == undefined) 
      return null;
    
    if (!dest.nomagic) {
      gb.style.types.images.forEach(function (type) {
        if (dest[type] && typeof dest[type] === 'string') 
          dest[type] = gb.utils.getImage(dest[type]);
      });
      
      gb.style.types.posizing.forEach(function (type) {
        if (dest[type] && typeof dest[type] !== 'string') 
          dest[type] = dest[type] + 'dp';
        else if (dest[type] && dest[type] === 'platform')
          if (type == 'width') dest[type] = $dp.platformWidth;
          else if (type == 'height') dest[type] = $dp.platformHeight;
      });
    } else if (dest.nomagic) delete dest.nomagic;
    
    if (dest.build && build) {
      if (dest.build.later) {
        dest.build.later = false;
      } else if (dest.build && (!dest.build.later || dest.build.later == null || dest.build.later == undefined)) {
        var events = dest.events ? dest.events : null;
        dest.build.type = dest.build.type.replace('create', '');
        dest = new Pool(dest);
        if (events) {
          for (var e in events) {
            (function(type, callback, context) { 
              dest.addEventListener(type, function (e) { 
                return callback.call(this, e, context); 
              });
            })(e, events[e], context);
          }
        }
        
        events = null;
      }
    }
    
    orig = null;
    return dest;
  },
  
  type: function () {
    return (
      (gb.isAndroid) ? 'android' :
      (gb.isIOS) ? (
        (gb.isRetina) ? 
        'retina' : 'iphone' 
      ) : 'web'
    );
  }
};
