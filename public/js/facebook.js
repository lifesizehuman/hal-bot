let userID;
window.fbAsyncInit = function() {
  FB.init({
    appId: '129221391068505',
    autoLogAppEvents: true,
    xfbml: true,
    version: 'v2.10'
  });
  FB.AppEvents.logPageView();
  FB.getLoginStatus(function(response) {
    let userID = response.authResponse.userID;
    console.log(userID);
    id = userID;
    $.ajax({
      type: "POST",
      url: "/api/newUser/" + userID
    });
  });
};

(function(d, s, id) {
  let js, fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) {
    return;
  }
  js = d.createElement(s);
  js.id = id;
  js.src = "//connect.facebook.net/en_US/sdk.js#xfbml=1&version=v2.10&appId=129221391068505";
  fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));