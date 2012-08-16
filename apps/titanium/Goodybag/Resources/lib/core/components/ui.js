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

, pink: '#d357ba'
, blue: '#57a0d3'
, blueBright: '#35c8f6'
};

gb.ui.color.base = gb.ui.color.gray;

gb.ui.font = {
  base: {
    fontSize: 12
  , fontWeight: "normal"
  }
};
  
gb.ui.header1 = function(text){
  return $ui.createLabel({
    text: text
  , font: {
      fontSize: 20
    , fontWeight: "normal"
    }
  });
};

gb.ui.header2 = function(text){
  return $ui.createLabel({
    text: text
  , font: {
      fontSize: 18
    , fontWeight: "normal"
    }
  });
};

gb.ui.header3 = function(text){
  return $ui.createLabel({
    text: text
  , font: {
      fontSize: 16
    , fontWeight: "normal"
    }
  });
};

gb.ui.header4 = function(text){
  return $ui.createLabel({
    text: text
  , font: {
      fontSize: 14
    , fontWeight: "normal"
    }
  });
};

/* Well this isnt really necessary now that I use
 * Ti.UI.SIZE and Ti.UI.FILL
 
gb.columns2 = function(width1, width2, gutter){
  gutter || (gutter = 0);
  var
    deviceWidth = gb.utils.deviceWidth
  , remaining   = deviceWidth - gutter
  , dpWidth1    = parseFloat(width1)
  , dpWidth2    = parseFloat(width2)
  , w1Percent   = width1.indexOf('%') > -1
  , w2Percent   = width2.indexOf('%') > -1
  , columns     = createView({
      width: deviceWidth + 'dp'
    , height: 'auto'
    })
  ;
  
  // Figure out if we have any percentages to deal with
  if (w1Percent && w2percent){
    dpWidth1 = remaining * width1 / 100;
    dpWidth2 = remaining * width2 / 100;
  }else if (w1Percent){
    dpWidth2 = dpWidth2;
    remaining -= dpWidth2;
    dpWidth1 = remaining * width1 / 100;
  }else if (w2Percent){
    dpWidth1 = dpWidth1;
    remaining -= dpWidth1;
    dpWidth2 = remaining * width2 / 100;
  }
  
  columns.add($ui.createView({
    width: dpWidth1 + 'dp'
  , height: 'auto'
  , left: 0
  }));
  
  columns.add($ui.createView({
    width: dpWidth2 + 'dp'
  , height: 'auto'
  , left: dpWidth + gutter + 'dp'
  }));
  
  return columns;
}*/
