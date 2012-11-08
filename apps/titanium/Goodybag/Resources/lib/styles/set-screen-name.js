(function ($dp, $ui, $color, $font, $base, $iphone, $android, $retina, $xhdpi, $hdpi, $mdpi, $ldpi) {
  $base.setScreenName = {
    "base": {
      zIndex: 10
    }
    
  , "wrapper": {
      width: $ui.FILL
    , height: $ui.SIZE
    , layout: 'vertical'
    }
    
  , "header": {
      textAlign: "center"
    }
    
  , "subHeader": {
      textAlign: "center"
    }
    
  , "nav": {
      width: $ui.FILL
    , height: $ui.SIZE
    , top: '13dp'
    }
  };
})(
  Ti.Platform.displayCaps, Ti.UI, gb.ui.color, gb.ui.font,
  gb.style.base, gb.style.iphone, gb.style.android,
  gb.style.retina, gb.style.xhdpi, gb.style.hdpi, gb.style.mdpi, gb.style.ldpi
);