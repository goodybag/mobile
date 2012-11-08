(function ($dp, $ui, $color, $font, $base, $iphone, $android, $retina, $xhdpi, $hdpi, $mdpi, $ldpi) {
  $base.stream = {
    base: {
      top: 54,
      backgroundColor: '#ddd',
      build: { type: 'createView' }
    },
    
    holder: {
      bottom: 50,
      backgroundColor: '#ddd',
      height: $ui.SIZE,
      build: { type: 'createView' }
    },
    
    avatar: {
      decodeRetries: 1,
      width: 42,
      height: 42,
      top: 16,
      left: -3,
      zIndex: 1,
      borderRadius: 5
    },
    
    text: {
      width: $ui.FILL,
      height: $ui.SIZE,
      textAlign: $ui.TEXT_ALIGNMENT_LEFT,
      top: 11,
      bottom: 11,
      left: 42,
      right: 6,
      color: $color.base,
      font: {
        fontSize: $font.base.size,
      },
      zIndex: 4
    }
  };
  
  $hdpi.stream = {
    avatar: {
      width: 50,
      height: 50,
      top: 10,
      bottom: 10
    },
    text: {
      left: 60,
      top: 15,
      bottom: 20,
      width: '75%'
    }
  };
})(
  Ti.Platform.displayCaps, Ti.UI, gb.ui.color, gb.ui.font,
  gb.style.base, gb.style.iphone, gb.style.android,
  gb.style.retina, gb.style.xhdpi, gb.style.hdpi, gb.style.mdpi, gb.style.ldpi
);