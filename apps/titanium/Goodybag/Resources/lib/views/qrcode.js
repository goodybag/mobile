
GB.Views.add('qrcode', {
  self: gb.style.get('qrcode.self'),
  
  Constructor: function () {
    
  },
  
  onShow: function (context) {
    var $self = this.self, $user = gb.consumer;
    
    $self.add(
      gb.qrcode.createQRCodeView(
        gb.style.get('qrcode.code', { 
          text: $user.getCode() 
        })
      )
    );
  }
});
