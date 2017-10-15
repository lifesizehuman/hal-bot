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

  function initializeRows() {
    $todoContainer.empty();
    var rowsToAdd = [];
    for (var i = 0; i < myToDos.length; i++) {
      rowsToAdd.push(createNewRow(myToDos[i]));
    }
    $todoContainer.prepend(rowsToAdd);
  }

  function getTodos() {
    $.get("/api/todo", function(data) {
      myToDos = data;
      initializeRows();
    });
  }

  function deleteTodo(event) {
    event.stopPropagation();
    var id = $(this).data("id");
    $.ajax({
      method: "DELETE",
      url: "/api/todo/" + id
    }).done(getTodos);
  }

  function editTodo() {
    var currentTodo = $(this).data("todo");
    $(this).children().hide();
    $(this).children("input.edit").val(currentTodo.text);
    $(this).children("input.edit").show();
    $(this).children("input.edit").focus();
  }

  function toggleComplete(event) {
    event.stopPropagation();
    var todo = $(this).parent().data("todo");
    console.log(todo);
    todo.complete = !todo.complete;
    updateTodo(todo);
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
    var id = $(this).data("id");
    $.ajax({
      method: "PUT",
      url: "/api/todo/" + id,
      data: todo
    }).done(getTodos);
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

  function createNewRow(todo) {
    var $newInputRow = $([
      "<li class='list-group-item todo-item'>",
      "<span class='todo-item'>",
      todo.task,
      "</span>",
      "<button class='delete pull-right'>x</button>",
      "<button class='complete pull-right'>✓</button>",
      "</li>"
    ].join(""));

    $newInputRow.find("button.delete").data("id", todo.id);
    $newInputRow.data("todo", todo);
    if (todo.complete === true) {
      $newInputRow.find(".todo-item").css("text-decoration", "line-through");
    } else {
      $newInputRow.find(".todo-item").css("text-decoration", "none");
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

      $.post("/api/addTodo", todo, getTodos).fail(function(err) {
        if (err) {
          console.log(err);
        }
      });
    });
    $newToDoInput.val("");
  }
});
