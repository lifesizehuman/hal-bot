window.fbAsyncInit = function() {
  FB.init({
    appId            : '129221391068505',
    autoLogAppEvents : true,
    xfbml            : true,
    version          : 'v2.10'
  });
  FB.AppEvents.logPageView();
};

(function(d, s, id) {
   var js, fjs = d.getElementsByTagName(s)[0];
   if (d.getElementById(id)) {
    return;
  }
  js = d.createElement(s);
  js.id = id;
  js.src = "//connect.facebook.net/en_US/sdk.js#xfbml=1&version=v2.10&appId=129221391068505";
  fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

function logInfo() {
  FB.getLoginStatus(function(response) {
    statusChangeCallback(response);
    var userID = response.authResponse.userID;
    console.log(userID);
  });
}

logInfo();