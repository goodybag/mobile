gb.handleError = function(error){
  // Either they messed up logging in or their sessino went bad
  if (error.name === "authenticationError"){
    // If their session went bad
    if (error.message === "you are not authenticated, please login again"){
      alert('You are not authenticated. Please login.');
      gb.consumer.logout();
      if (gb.consumer.data.facebook) Ti.Facebook.logout();
      GB.Windows.show('login');
    }
  }else if (error.message === "E11001 duplicate key on update"){
    alert("Already taken");
  }else{
    alert(
      (error && (error.friendlyMessage || error.message))
      || "Something went wrong :( I'm not sure what happened, but if things aren't working properly, just trying logging out and logging back in and see if that helps :)"
    );
  }
};
