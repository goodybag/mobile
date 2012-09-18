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
  }else{
    alert(error);
    alert("Something went wrong :( I'm not sure what happened. Maybe your phone is sub-merged in water for all I know. But just trying logging out and logging back in and see if that helps :)")
  }
};
