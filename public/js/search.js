$(document).ready(function() {
  function search() {
    let query = $("#search").val().trim();
    $.ajax({
      type: "GET",
      url: "/api/query/" + query,
      success: function(response) {
        let sen = "http://" + window.location.hostname + `${response.address}`;
        window.location = sen;
      }
    });
  }

  $(window).keyup(function(event) {
    if (event.keyCode === 13) {
      event.preventDefault();
      search();
    }
  });

  $("#search-button").on("click", function(event) {
    search();
  });

  $("#search").keypress(function(event) {
    if (event.keyCode === 13) {
      event.preventDefault();
    }
  });

  $.ajax({
    type: "GET",
    url: "/api/recent/",
    success: function(response) {
      let tag = $("#left-sidebar");
      let i = 0;
      for (const entry of response) {
        if (i++ === 10) {
          break;
        }
        let tmpP = $("<p>");
        tmpP.text(entry.search_phrase);
        tag.append(tmpP);
      }
    }
  });
});
