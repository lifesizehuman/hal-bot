function logInfo() {
  FB.getLoginStatus(function(response) {
    var userID = response.authResponse.userID;
    console.log(userID);
  });
}