const {ipcRenderer} = require("electron");
const $ = require("./libs/jquery-3.1.0.min.js");

var loggingIn = false;

$(() => {
  $("[name=curse-login]").click(() => {
    if (!loggingIn) {
      loggingIn = true;
      console.log("Logging in...");
      var username = $("[name=curse-username]").val();
      var password = $("[name=curse-password]").val();
      console.log("Username: " + username);
      ipcRenderer.send("login", {username: username, password: password});
      loggingIn = false;
    }
  });
});

ipcRenderer.on("login-success", (event, arg) => {
  var result = $("#login-result-field");
  result.removeClass();
  result.addClass("login-success-field");
  console.log("Login success: " + arg.message);
  result.text(arg.message);
  result.show();
});

ipcRenderer.on("login-failure", (event, arg) => {
  var result = $("#login-result-field");
  result.removeClass();
  result.addClass("login-error-field");
  console.log("Login failure: " + arg.message);
  result.text(arg.message);
  result.show();
});
