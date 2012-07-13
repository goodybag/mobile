
gb.Views.addView('login', View.extend({
  debug: true,
  
  elements: {
    inputs: {
      background: Titanium.UI.createImageView({
        top: '220dp'
      , image: gb.utils.getImage('screens/login/inputs.png')
      }),
      
      email: Titanium.UI.createTextField({
        top: '228dp'
      , left: '80dp'
      , hintText: 'Email'
      , color: '#888'
      , width: '195dp'
      , height: '40dp'
      , backgroundImage: gb.utils.getImage('screens/login/transparent.png')
      , keyboardType: Titanium.UI.KEYBOARD_EMAIL
      , borderStyle: Ti.UI.INPUT_BORDERSTYLE_NONE
      , autocorrect: false
      , autocapitalization: Ti.UI.TEXT_AUTOCAPITALIZATION_NONE
      })
    }
  },
  
  window: Titanium.UI.createWindow({
    title: 'Login',
    top: 0.1,
    backgroundImage: gb.utils.getImage('screens/login/background.png')
  }),
  
  Constructor: function () {
    // Login Form
    this.add(this.elements.inputs.background);
    this.add(this.elements.inputs.email);
    
    return this;
  }
}));
