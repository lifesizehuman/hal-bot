function logInfo() {
  FB.getLoginStatus(function(response) {
    statusChangeCallback(response);
    var userID = response.authResponse.userID;
    console.log(userID);
  });
}