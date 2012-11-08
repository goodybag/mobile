/**
 * Activity View
 */
GB.getActivityView = function (model) {
  var base, image, inner, filler, text,
    $this   = this,
    post    = 0,
    imgSrc  = model.who.screenName
            ? "-secure/" + escape(model.who.screenName)
            : "/000000000000000000000000";
  
  base = $ui.createView({
    width: $ui.FILL,
    height: $ui.SIZE,
    top: 3
  });
  
  image = gb.style.get('stream.avatar');
  try {
    image.image = "https://s3.amazonaws.com/goodybag-uploads/consumers" + imgSrc + "-128.png";
  } catch (e) {}
  image.defaultImage = gb.utils.getImage('avatar.png');
  image.title = model.who.screenName;
  image = $ui.createImageView(image);

  inner = $ui.createView({
    width: $ui.FILL,
    height: $ui.SIZE,
    backgroundColor: '#ffffff',
    borderColor: '#cccccc',
    borderWidth: 1,
    borderRadius: 5,
    left: 5,
    right: 5
  });

  sentence = gb.style.get('stream.text');
  sentence.text = model.sentence;
  sentence = $ui.createLabel(sentence);
  
  base.add(image);
  inner.add(sentence);
  inner.add($ui.createView({
    width: 42,
    height: 52,
    left: 0
  }));
  
  base.add(inner);
  
  if (inner.height < 70) inner.setHeight(70);

  return base;
};