(function ($dp, $ui, $color, $font, $base, $iphone, $android, $retina, $xhdpi, $hdpi, $mdpi, $ldpi) {
  $base.register = {
    "self": {
      height: 'platform',
      backgroundImage: 'screens/login/background.png'
    },
    
    "wrapper": {
      width: $ui.FILL,
      height: $ui.SIZE,
      left: 10,
      right: 10,
      top: 136,
      layout: 'vertical'
    },
    
    "header": {
      width: $ui.FILL,
      height: $ui.SIZE,
      top: 10,
      left: 2,
      color: $color.blueDark,
      font: {
        fontSize: 20,
        fontWeight: "bold"
      },
      
      shadowOffset: {
        x: 0,
        y: 1
      },
      
      shadowColor: '#63a5cf'
    },
    
    "fields": {
      width: $ui.FILL,
      height: $ui.SIZE,
      top: 10,
      layout: 'vertical',
      borderRadius: 5,
      borderWidth: '1dp',
      borderColor: '#2e6284',
      backgroundColor: '#fff'
    },
    
    "field": {
      "wrapper": {
        width: $ui.FILL,
        height: $ui.SIZE,
        layout: 'horizontal',
      },
      
      "input": {
        width: 260,
        height: 40,
        left: 10,
        color: $color.gray,
        backgroundImage: 'screens/login/transparent.png',
        borderStyle: Ti.UI.INPUT_BORDERSTYLE_NONE,
        autocorrect: false,
        autocapitalization: Ti.UI.TEXT_AUTOCAPITALIZATION_NONE
      },
      
      "indicator": {
        "base": {
          width: $ui.FILL,
          height: 20,
          right: 10,
          backgroundImage: 'screens/register/indicator-gray.png'
        },
        
        "green": {
          backgroundImage: 'screens/register/indicator-green.png'
        },
        
        "red": {
          backgroundImage: 'screens/register/indicator-red.png'
        }
      },
      
      "password": {
        passwordMask: true,
      },
      
      "separator": {
        width: $ui.FILL,
        height: 1,
        backgroundColor: $color.grayLighter
      }
    },
    
    "nav": {
      "base": {
        width: $ui.FILL,
        height: $ui.SIZE,
        top: 14
      },
      
      "left": {
        left: 0,
        width: $ui.SIZE,
        height: $ui.SIZE
      },
      
      "right": {
        right: 0,
        width: $ui.SIZE,
        height: $ui.SIZE
      }
    }
  };
  
  if (Ti.Android) {
    $android.register = {
      self: { windowSoftInputMode: Ti.UI.Android.SOFT_INPUT_ADJUST_PAN },
      
      field: {
        wrapper: { layout: 'composite' },
        
        input: {
          font: {
            fontSize: 12
          },
        },
        
        indicator: {
          base: { width: 20 }
        },
        
        separator: { top: 40 }
      }
    };
    
    $hdpi.register = $xhdpi.register = {
      self: { width: gb.utils.px2dp($dp.platformWidth) },
      seperator: { top: 60 }
    };
  }
})(
  Ti.Platform.displayCaps, Ti.UI, gb.ui.color, gb.ui.font,
  gb.style.base, gb.style.iphone, gb.style.android,
  gb.style.retina, gb.style.xhdpi, gb.style.hdpi, gb.style.mdpi, gb.style.ldpi
);