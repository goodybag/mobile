var $ui = Titanium.UI;

if (!gb.ui)
  gb.ui = {};
  
  
gb.ui.color = {
  white: '#fff'
, black: '#111'
, grayDarker: '#444'
, grayDark: '#666'
, gray: '#888'
, grayLight: '#9c9c9c'
, grayLighter: '#bbb'
, grayLightest: '#ddd'

, pink: '#d357ba'
, blue: '#57a0d3'
, blueBright: '#35c8f6'
, blueDark: '#062f49'
, green: '#8dd58d'
, greenDark: '#44af44'
, salmon: '#f87476'
, salmonDark: '#af4444'
};

gb.ui.color.base = gb.ui.color.gray;

gb.ui.font = {
  base: {
    fontSize: 14
  , fontWeight: "normal"
  }
};
