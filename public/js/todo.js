$(document).ready(function() {
  function clearTodos() {
    $("#todos").empty();
  }

  function insertTodo(obj) {
    let p = $("<p>");
    p.attr("class","todo-item");
    p.attr("contenteditable", true);
    p.attr("data-id",obj.id);
    let b = $("<button>");
    b.attr("type","button");
    b.attr("data-id",obj.id);
    b.attr("class", "close delete-todo");
    b.attr("aria-label", "Close");
    let s = $("<span>");
    s.attr("aria-hidden","true");
    s.text("&times;");
    b.html(s);
    p.html(b);
    $("#todos").append(p);
  }

  function getTodos() {
    $.ajax({
        type: "GET",
        url: "/api/todo/" + userID
      }
    }).then((data) => {
        clearTodos();
        data.map((entry) => insertTodo(entry));
      }
    });
  }

  function createTodo(task) {
    $.ajax({
      method: "POST",
      url: "/api/todo",
      data: {
        task: task,
        userID: userID  // <<------ corect info??
      }
    }).then(() => getTodos());
  }

  function completeTodo(id) {
    $.ajax({
      type: "PUT",
      url:  "/api/todo/",
      data: {
        complete: true,
        userID: userID   // <<------ corect info??
        id: id
      }
    }).then(() => getTodos());
  }

  function updateTask(id, task) {
    $.ajax({
      type: "PUT",
      url:  "/api/todo/",
      data: {
        task: task,
        userID: userID,  // <<------ corect info??
        id: id           // <<------ corect info??
      }
    }).then(() => getTodos());
  }

  $("#todo-button").on("click", function(event) {
    event.preventDefault();
    let task = $("#todo-input").val();
    if(!task) return;
    createTodo(task);
  });

  $(document).on("input",".todo-item", function(event) {
    event.preventDefault();
    let task = $(this).val();
    let id = $(this).attr("data-id");
    updateTask(id, task);
  });

  $(document).on("click", 'delete-todo', function(event) {
    event.preventDefault();
    let id = $(this).attr("data-id");
    completeTodo(id);
  });
});
