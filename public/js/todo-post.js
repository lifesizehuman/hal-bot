$(document).ready(function() {

  var $newToDoInput = $("#todo-input");

  $("#todo-button").on("click", function(event) {
    event.preventDefault();

    var todo = {
      task: $newToDoInput.val().trim(),
      complete: false
    };

    var task = $("#todo-input").val();
    $.post("/api/addTodo", todo).fail(function(err) {
      if (err) {
        console.log(err);
      }
    });
    $("#todo-input").val("");
  });
});
