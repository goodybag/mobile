(function(){
  var regs = {
    alpha: /[^a-z]/i
  , screenName: /[^a-z\.0-9_]/i
  , email: /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  };
  
  gb.validate = function (key, value, callback) {
    var errors = [];
    switch (key) {
      case 'firstName':
        if (value.length < 2)
          errors.push({ field: key, message: "First Name must be at least 2 characters" });
        if (regs.alpha.test(value))
          errors.push({ field: key, message: "First Name can only contain characters A-Z" });
      break;
      case 'lastName':
        if (value.length < 2)
          errors.push({ field: key, message: "Last Name must be at least 2 characters" });
        if (regs.alpha.test(value))
          errors.push({ field: key, message: "Last Name can only contain characters A-Z" });
      break;
      case 'screenName':
        if (value.length < 5)
          errors.push({ field: key, message: "Screen Name must be at least 5 characters" });
        if (regs.screenName.test(value))
          errors.push({ field: key, message: "Screen Name can only contain characters A-Z, periods, and underscores" });
      break;
      case 'email':
        // Only report one error of the same message
        if (value.length < 4){
          errors.push({ field: key, message: "Invalid email address" });
          break;
        }
        if (!regs.email.test(value))
          errors.push({ field: key, message: "Invalid email address" });
      break;
      case 'barcodeId':
        var verdict = gb.utils.checkQRCode(value, true);
        if (value.error){
          errors.push({ field: key, message: value.error });
          break;
        }
      break;
      case 'password': case 'passwordConfirm': 
        if (value.length < 5)
          errors.push({ field: key, message: "Password must be at least 5 characters" });
      break;
      default: break;
    }
    return callback ? callback(errors) : errors;
  }
})();
