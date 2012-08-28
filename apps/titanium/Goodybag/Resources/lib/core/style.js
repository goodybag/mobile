
gb.style = {
  cached:  {},
  base:    {},
  iphone:  {},
  retina:  {},
  android: {},
  web:     {},
  
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
    
    function merger (n, str, o, swap) {
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
    }
    
    if (style == null) 
      style = platform, platform = gb.style.type();
    
    if (typeof style === 'boolean') 
      build = style, style = platform, platform = gb.style.type();
      
    if (typeof options === 'boolean') 
      build = options, options = null;
      
    if (typeof context === 'boolean')
      build = context, context = null;
      
    if (({}).toString.call(style) === '[object Object]') {
      if (options) context = options, options = null;
      options = style, style = platform, platform = gb.style.type();
    }
    
    if (this.cached[style]) {
      if (typeof options === 'object' && this.cached[style].options == options)
        dest = this.cached[style].build;
      else 
        dest = gb.utils.merge(this.cached[style].build, options || {});
    } else {
      if (!gb.style[name]) 
        return null;
      else 
        orig = merger(name, style, {}), orig = merger(platform, style, orig, true);
  
      if (platform == 'retina') 
        orig = merger('iphone', style, orig || {});
        
      if (!orig || orig == undefined) 
        return null;
      else
        dest = gb.utils.merge(orig, options || {});
  
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
              dest[type] = $dp.platformWidth;
            else if (type == 'height') 
              dest[type] = $dp.platformHeight;
        });
      } else if (dest.nomagic) 
        delete dest.nomagic;
    }
    
    if (!this.cached[style])
      this.cached[style] = {
        build: dest,
        options: options
      };
    
    if (dest.build && build) {
      if (dest.build.later) {
        dest.build.later = false;
      } else if (dest.build && (!dest.build.later || dest.build.later == null || dest.build.later == undefined)) {
        var area = dest.build.area || null, type = dest.build.type;
        return Titanium[area || 'UI'][type.indexOf('create') !== -1 ? type : 'create' + type](dest);
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
