(function(){
  this.app = window.app || {};
  this.app.config = this.app.config || {};

  var config = {
    backbone: {
      pushState: false
    },
    postLoginUrl: '#!/streams/global',
    changePage: {
      defaultTransition: "fade",
      transitions: [
        'slideLeft',
        'slideRight'
      ],
      changeHash: false
    }
  , iscroll: {
      hScrollbar: false
    , vScrollbar: false
    , hscroll: false
    , bounce: false
    , snap: true
    }
  , consumerPicture: "https://s3.amazonaws.com/goodybag-uploads/consumers-secure/{{id}}-85.png"
  , iosLt5: (function(){
      return (/(iPhone|iPod|iPad)/i.test(navigator.userAgent)) && (/OS [1-4]_._. like Mac OS X/i.test(navigator.userAgent));
    })()
  , isIos: (function(){
      return (/(iPhone|iPod|iPad)/i.test(navigator.userAgent));
    })()
  };

  // Export
  for (var key in config){
    this.app.config[key] = config[key];
  }
}).call(this);