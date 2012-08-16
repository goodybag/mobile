
gb.style = {
  iphone: {},
  retina: {},
  android: {},
  web: {},
  
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
  get: function (name, style, options, context) {
    var dest = null, base = null, build = true;
    
    if (style == null) 
      style = name, name = gb.style.type();
    
    if (typeof style === 'boolean') 
      build = style, style = name, name = gb.style.type();
      
    if (typeof object === 'boolean') 
      build = object, object = null;
      
    if (({}).toString.call(style) === '[object Object]') {
      if (options) context = options, options = null;
      options = style, style = name, name = gb.style.type();
    }

    if (!gb.style[name]) 
      return null;
    else
      orig = gb.utils.ref(gb.style[name], style);

    if (name == 'retina') 
      base = gb.utils.ref(gb.style['iphone'], style), orig = gb.utils.merge(base, orig || {});
      
    if (!orig || orig == undefined) 
      return null;
    else
      dest = gb.utils.merge(orig, options);

    if (!dest || dest == undefined) 
      return null;
    
    if (!dest.nomagic) {
      [ // Image Magic, no really.
        'image', 'selectedImage', 'backButtonTitleImage', 'barImage', 'titleImage',
        'backgroundImage', 'backgroundDisabledImage', 'backgroundSelectedImage', 'backgroundFocusedImage',
        'tabsBackgroundImage', 'tabsBackgroundDisabledImage', 'tabsBackgroundSelectedImage', 'tabsBackgroundFocusedImage',
        'leftTrackImage', 'rightTrackImage', 'thumbImage', 'disabledLeftTrackImage', 'disabledRightTrackImage', 'disabledThumbImage'
      ].forEach(function (type) {
        if (dest[type] && typeof dest[type] === 'string') 
          dest[type] = gb.utils.getImage(dest[type]);
      });
      
      [ 'top', 'left', 'right', 'bottom', 'height', 'width' ].forEach(function (type) {
        if (dest[type] && typeof dest[type] !== 'string') 
          dest[type] = dest[type] + 'dp';
        else if (dest[type] && dest[type] === 'platform')
          if (type == 'width') 
            dest[type] = Titanium.Platform.displayCaps.platformWidth;
          else if (type == 'height') 
            dest[type] = Titanium.Platform.displayCaps.platformHeight;
      });
    } else if (dest.nomagic) 
      delete dest.nomagic;
    
    if (dest.build && build) {
      if (dest.build.later) {
        dest.build.later = false;
      } else if (dest.build && (!dest.build.later || dest.build.later == null || dest.build.later == undefined)) {
        var type = dest.build.type; delete dest.build; dest = $ui[type](dest);
        if (dest.events) for (var e in events) dest.addEventListener(e, (context) ? function () { return events[e].apply(context, arguments); } : events[e]);
      }
    }

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
