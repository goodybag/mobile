
GB.Views.add('qrcode', {
  self: Titanium.UI.createScrollView({
    top: '55dp',
    backgroundImage: gb.utils.getImage('screens/main/background_qr.png')
  }),
  
  Constructor: function () {
    
  },
  
  onShow: function (context) {
    var $self = this.self, $user = gb.consumer;
    
    $self.add(gb.qrcode.createQRCodeView({
      top: 55,
      width: 250,
      height: 250,
      margin: 4,
      text: $user.getCode()
    }));
  }
});
