
GB.Views.add('qrcode', {
  self: gb.style.get('qrcode.self'),
  
  elements: {
    label: gb.style.get('qrcode.label')
  },
  
  Constructor: function () {
    
  },
  
  onShow: function (context) {
    var $self = this.self, $user = gb.consumer;
    this.elements.label.setText($user.getCode());
    
    $self.add(
      gb.qrcode.createQRCodeView(
        gb.style.get('qrcode.code', { 
          text: $user.getCode() 
        })
      )
    );
    
    $self.add(this.elements.label);
  }
});
