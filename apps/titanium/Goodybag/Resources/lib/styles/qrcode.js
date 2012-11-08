(function ($ui, $base, $iphone, $android, $color, $font) {
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
})(
  Ti.UI, 
  gb.style.base, 
  gb.style.iphone, 
  gb.style.android, 
  gb.ui.color,
  gb.ui.font
);