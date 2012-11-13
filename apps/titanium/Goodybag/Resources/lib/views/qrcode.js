
GB.Views.add('qrcode', {
  self: gb.style.get('qrcode.self'),
  
  elements: {
    label: gb.style.get('qrcode.label')
  },
  
  Constructor: function () {
    
  },
  
  onShow: function (context) {
    var $self = this.self, $user = gb.consumer;
    
    if (Ti.Android) Ti.UI.Android.hideSoftKeyboard();
    
    if (!this.code || this.code != $user.getCode()) {
      if (this.code) $self.remove(this.elements.qrcode), $self.remove(this.elements.label);
      this.code = $user.getCode();
      this.elements.label.setText($user.getCode());
      this.elements.qrcode = gb.qrcode.createQRCodeView(
        gb.style.get('qrcode.code', { 
          text: $user.getCode() 
        })
      );
      
      $self.add(this.elements.qrcode);
      $self.add(this.elements.label);
    }
  },
  
  onHide: function () {
    var $self = this.self;
  }
});