(function ($dp, $ui, $color, $font, $base, $iphone, $android, $retina, $xhdpi, $hdpi, $mdpi, $ldpi) {
  $base.qrcode = {
    self: {
      top: 54,
      layout: 'vertical',
      backgroundImage: 'screens/main/background.png',
      backgroundColor: 'black',
      build: { type: 'createScrollView' }
    },
    
    label: {
      top: 10,
      color: '#aaaaaa',
      font: {
        fontSize: 18,
        fontStyle: 'normal',
        fontWeight: 'bold'
      },
      build: { type: 'createLabel' }
    },
    
    code: {
      top: 54,
      width: 280,
      height: 280,
      margin: 10
    }
  };
  
  $xhdpi.qrcode = {
    code: {
      top: 80,
      width: 280,
      height: 280,
      margin: 1
    }
  };
})(
  Ti.Platform.displayCaps, Ti.UI, gb.ui.color, gb.ui.font,
  gb.style.base, gb.style.iphone, gb.style.android,
  gb.style.retina, gb.style.xhdpi, gb.style.hdpi, gb.style.mdpi, gb.style.ldpi
);