$(document).ready(function() {
  var $newToDoInput = $("#todo-input");
  var $todoContainer = $("#todos");
  $(document).on("click", "button.delete", deleteTodo);
  $(document).on("click", "button.complete", toggleComplete);
  $(document).on("click", ".todo-item", editTodo);
  $(document).on("keyup", ".todo-item", finishEdit);
  $(document).on("blur", ".todo-item", cancelEdit);
  $(document).on("submit", "#todo-form", insertToDo);

  var myToDos = [];

  getTodos();

  function getTodos() {
    $.get("/api/todo", function(data) {
      myToDos = data;
      initializeRows();
    });
  }

  function initializeRows() {
    $todoContainer.empty();
    var rowsToAdd = [];
    for (var i = 0; i < myToDos.length; i++) {
      rowsToAdd.push(createNewRow(myToDos[i]));
    }
    $todoContainer.prepend(rowsToAdd);
  }

  function editTodo() {
    var currentTodo = $(this).data("todo");
    $(this).children().hide();
    $(this).children("input.edit").val(currentTodo.text);
    $(this).children("input.edit").show();
    $(this).children("input.edit").focus();
  }

  function deleteTodo(event) {
    event.stopPropagation();
    var id = $(this).data("id");
    $.ajax({
      method: "DELETE",
      url: "/api/todo/" + id
    }).done(getTodos);
  }

  function finishEdit() {
    var updatedTodo = $(this).data("todo");
    if (event.keyCode === 13) {
      updatedTodo.text = $(this).children("input").val().trim();
      $(this).blur();
      updateTodo(updatedTodo);
    }
  }

  function updateTodo(todo) {
    $.ajax({method: "PUT", url: "/api/todo", data: todo}).done(getTodos);
  }

  function cancelEdit() {
    var currentTodo = $(this).data("todo");
    if (currentTodo) {
      $(this).children().hide();
      $(this).children("input.edit").val(currentTodo.text);
      $(this).children("span").show();
      $(this).children("button").show();
    }
  }

  function toggleComplete(event) {
    event.stopPropagation();
    var todo = $(this).parent().data("todo");
    todo.complete = !todo.complete;
    updateTodo(todo);
  }

  function createNewRow(todo) {
    var $newInputRow = $([
      "<li class='list-group-item todo-item'>",
      "<span>",
      todo.text,
      "</span>",
      "<input type='text' class='edit' style='display: none;'>",
      "<button class='delete btn btn-default'>x</button>",
      "<button class='complete btn btn-default'>✓</button>",
      "</li>"
    ].join(""));

    $newInputRow.find("button.delete").data("id", todo.id);
    $newInputRow.find("input.edit").css("display", "none");
    $newInputRow.data("todo", todo);
    if (todo.complete) {
      $newInputRow.find("span").css("text-decoration", "line-through");
    }
    return $newInputRow;
  }



  function insertToDo(event) {
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
  }
});
