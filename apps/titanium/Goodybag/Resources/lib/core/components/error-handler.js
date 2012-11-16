gb.handleError = function (error) {
  if (typeof error === 'string' && error.length > 0 && error[0] === '{') 
    error = JSON.parse(error);
    
  if (!error || !error.name) 
    return gb.utils.debug(error);
  
  // Either they messed up logging in or their session went bad
  if (error.name === "authenticationError") {
    alert('Session timed out, please login again.');
    gb.consumer.logout();
    if (gb.consumer.data.facebook) Ti.Facebook.logout();
    GB.Windows.show('login');
  } else if (error.message === "E11001 duplicate key on update") {
    alert("Already taken");
  } else {
    if (error && (error.friendlyMessage || error.message)) 
      alert(error.friendlyMessage || error.message);
  }
};
