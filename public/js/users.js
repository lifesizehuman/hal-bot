$(document).ready(function() {
  $.ajax({
    type: "GET",
    url: "/api/reg"
  }).then((userCount) => {
    console.log(userCount);
  });
});