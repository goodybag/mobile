
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
    this.elements.qrcode = gb.qrcode.createQRCodeView(
      gb.style.get('qrcode.code', { 
        text: $user.getCode() 
      })
    );
    
    $self.add(this.elements.qrcode);
    $self.add(this.elements.label);
  },
  
  onHide: function () {
    var $self = this.self;
    $self.remove(this.elements.qrcode);
    $self.remove(this.elements.label);
  }
});
