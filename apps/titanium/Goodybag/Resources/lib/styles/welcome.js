(function ($dp, $ui, $color, $font, $base, $iphone, $android, $retina, $xhdpi, $hdpi, $mdpi, $ldpi) {
  $base.welcome = {
    "base": {
      width: $ui.FILL,
      height: $ui.FILL,
      backgroundImage: 'background.png',
      zIndex: 10,
      layout: 'vertical'
    },
    
    "header": {
      width: $ui.FILL,
      height: $ui.SIZE,
      top: 120,
      textAlign: "center",
      color: $color.white,
      shadowColor: $color.blueDark,
      shadowOffset: {
        x: 0,
        y: -1
      },
      font: {
        fontSize: 28
      }
    },
    
    "smiley": {
      top: 30,
      font: {
        fontSize: 72
      }
    }
  };
})(
  Ti.Platform.displayCaps, Ti.UI, gb.ui.color, gb.ui.font,
  gb.style.base, gb.style.iphone, gb.style.android,
  gb.style.retina, gb.style.xhdpi, gb.style.hdpi, gb.style.mdpi, gb.style.ldpi
);