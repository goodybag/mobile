gb.handleError = function(error){
  if (!error || error.name) return gb.utils.debug(error);
  // Either they messed up logging in or their sessino went bad
  if (error.name === "authenticationError"){
    // If their session went bad
    if (error.message === "you are not authenticated, please login again") {
      alert('You are not authenticated. Please login.');
      gb.consumer.logout();
      if (gb.consumer.data.facebook) Ti.Facebook.logout();
      GB.Windows.show('login');
    }
  } else if (error.message === "E11001 duplicate key on update") {
    alert("Already taken");
  } else {
    if (error && (error.friendlyMessage || error.message)) alert(error.friendlyMessage);
  }
};
