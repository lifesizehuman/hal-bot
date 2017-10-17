$(document).ready(function() {
  var $todoContainer = $("#todos");
  var $newToDoInput = $("#todo-input");
  var id;
  let userID;
  window.fbAsyncInit = function() {
    FB.init({appId: '129221391068505', autoLogAppEvents: true, xfbml: true, version: 'v2.10'});
    FB.AppEvents.logPageView();
    FB.getLoginStatus(function(response) {
      let userID = response.authResponse.userID;
      console.log("FB User ID: " + userID);
      let id = userID;
      $.ajax({
        type: "POST",
        url: "/api/newUser/" + id
      }).then(() => getTodos());
    });
  };

  (function(d, s, id) {
    let js,
      fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {
      return;
    }
    js = d.createElement(s);
    js.id = id;
    js.src = "//connect.facebook.net/en_US/sdk.js#xfbml=1&version=v2.10&appId=129221391068505";
    fjs.parentNode.insertBefore(js, fjs);
  }(document, 'script', 'facebook-jssdk'));

  var myToDos = [];

  function initializeRows() {
    $todoContainer.empty();
    var rowsToAdd = [];
    for (var i = 0; i < myToDos.length; i++) {
      rowsToAdd.push(createNewRow(myToDos[i]));
    }
    $todoContainer.prepend(rowsToAdd);
  }

  function clearTodos() {
    $("#todos").empty();
  }

  function createNewRow(todo) {
    var $newInputRow = $([
      "<li class='list-group-item todo-item'>",
      "<span class='todo-item'>",
      todo.task + todo.id,
      "</span>",
      "<button class='delete pull-right'>x</button>",
      "<button class='complete pull-right'>✓</button>",
      "</li>"
    ].join(""));


    $newInputRow.find("button.delete").data("id", todo.id);
    $newInputRow.data("todo", todo);
    if (todo.complete === 1) {
      $newInputRow.find(".todo-item").css("text-decoration", "line-through");
    } else {
      $newInputRow.find(".todo-item").css("text-decoration", "none");
    }
    // $("#todos").append($newInputRow);
    return $newInputRow;
  }

  // function insertTodo(obj) {
  //   let p = $("<p>");
  //   p.attr("class", "todo-item");
  //   p.attr("contenteditable", false);
  //   p.attr("data-id", obj.id);
  //   let b = $("<button>");
  //   b.attr("type", "button");
  //   b.attr("data-id", obj.id);
  //   b.attr("class", "close delete-todo");
  //   b.attr("aria-label", "Close");
  //   let s = $("<span>");
  //   s.attr("aria-hidden", "true");
  //   s.text(obj.task);
  //   b.html(s);
  //   p.html(b);
  //   $("#todos").append(p);
  // }

  function getTodos(id) {
    $.ajax({
      type: "GET",
      url: "/api/todo/"
    }).then((data) => {
      myToDos = data;
      initializeRows();
      // // clearTodos();
      // data.map((entry) => insertTodo(entry));
    });
  }

  function createTodo(task, id) {
    $.ajax({
      method: "POST",
      url: "/api/addTodo",
      data: {
        task: task,
        complete: false,
        id: id
      }
    }).then(() => getTodos());
  }

  function completeTodo(todo) {
    for (var i = 0; i < myToDos.length; i++) {
      var id = myToDos[i].id;
    }
    $.ajax({
      type: "PUT",
      url: "/api/todo/" + id,
      data: {
        complete: true,
        where: {
          id: id
        }
        // UserId: userID, // <<------ corect info??
        // id: id
      }
    }).then(() => getTodos());
  }

  function deleteToDo() {
    // for (var i = 0; i < myToDos.length; i++) {
    //   var id = myToDos[i].id;
    // }
    $.ajax({
      type: "DELETE",
      url: "/api/todo/" + id
    }).done(() => getTodos());
  }

  // function updateTask(id, task) {
  //   $.ajax({
  //     type: "PUT",
  //     url: "/api/todo/",
  //     data: {
  //       task: task,
  //       // UserId: userID, // <<------ corect info??
  //       id: id // <<------ corect info??
  //     }
  //   }).then(() => getTodos());
  // }

  $("#todo-button").on("click", function(event) {
    event.preventDefault();
    let task = $("#todo-input").val();
    if (!task)
      return;
    createTodo(task);
    $newToDoInput.val("");
  });

  // $(document).on("input", ".todo-item", function(event) {
  //   event.preventDefault();
  //   let task = $(this).val();
  //   let id = $(this).attr("data-id");
  //   updateTask(id, task);
  // });

  $(document).on("click", "button.complete", function(event) {
    event.preventDefault();
    let id = $(this).attr("data-id");
    completeTodo(id);
  });

  $(document).on("click", "button.delete", function(event) {
    event.preventDefault();
    let id = $(this).attr("data-id");
    deleteToDo(id);
  });
});
