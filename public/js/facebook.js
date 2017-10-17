$(document).ready(function() {
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

  function clearTodos() {
    $("#todos").empty();
  }

  function insertTodo(obj) {
    let p = $("<p>");
    p.attr("class", "todo-item");
    p.attr("contenteditable", true);
    p.attr("data-id", obj.id);
    let b = $("<button>");
    b.attr("type", "button");
    b.attr("data-id", obj.id);
    b.attr("class", "close delete-todo");
    b.attr("aria-label", "Close");
    let s = $("<span>");
    s.attr("aria-hidden", "true");
    s.text("&times;");
    b.html(s);
    p.html(b);
    $("#todos").append(p);
  }

  function getTodos(id) {
    $.ajax({
      type: "GET",
      url: "/api/todo/" + id
    }).then((data) => {
      clearTodos();
      data.map((entry) => insertTodo(entry));
    });
  }

  function createTodo(task, id) {
    $.ajax({
      method: "POST",
      url: "/api/addTodo",
      data: {
        task: task,
        complete: false,
        UserId: id
      }
    }).then(() => getTodos());
  }

  function completeTodo(id) {
    $.ajax({
      type: "PUT",
      url: "/api/todo/",
      data: {
        complete: true,
        // UserId: userID, // <<------ corect info??
        id: id
      }
    }).then(() => getTodos());
  }

  function updateTask(id, task) {
    $.ajax({
      type: "PUT",
      url: "/api/todo/",
      data: {
        task: task,
        // UserId: userID, // <<------ corect info??
        id: id // <<------ corect info??
      }
    }).then(() => getTodos());
  }

  $("#todo-button").on("click", function(event) {
    event.preventDefault();
    let task = $("#todo-input").val();
    if (!task)
      return;
    createTodo(task);
  });

  $(document).on("input", ".todo-item", function(event) {
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

// var id;
// window.fbAsyncInit = function() {
//   FB.init({appId: '129221391068505', autoLogAppEvents: true, xfbml: true, version: 'v2.10'});
//   FB.AppEvents.logPageView();
//   FB.getLoginStatus(function(response) {
//     var userID = response.authResponse.userID;
//     console.log(userID);
//     id = userID;
//     $.ajax({
//       type: "POST",
//       url: "/api/newUser/" + id
//     });
//   });
// };
// (function(d, s, id) {
//   var js,
//     fjs = d.getElementsByTagName(s)[0];
//   if (d.getElementById(id)) {
//     return;
//   }
//   js = d.createElement(s);
//   js.id = id;
//   js.src = "//connect.facebook.net/en_US/sdk.js#xfbml=1&version=v2.10&appId=129221391068505";
//   fjs.parentNode.insertBefore(js, fjs);
// }(document, 'script', 'facebook-jssdk'));
//
// function getTodos(id) {
//   $.ajax({
//     type: "GET",
//     url: "/api/todo/" + id
//   });
// }
//
// $("#todo-button").on("click", function(event) {
//   event.preventDefault();
//   var task = $("#todo-input").val();
//   $.ajax({
//     method: "POST",
//     url: "/api/addTodo",
//     data: {
//       task: task,
//       id: id
//     }
//   });
// });
