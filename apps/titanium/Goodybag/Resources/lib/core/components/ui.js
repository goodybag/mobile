var $ui = Titanium.UI;

if (!gb.ui)
  gb.ui = {};
  
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