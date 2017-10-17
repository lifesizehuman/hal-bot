$(document).ready(function() {
  $.ajax({
    type: "GET",
    url: "/api/reg"
  }).then((userCount) => {
    $("#userCount").text(userCount);
  });
});