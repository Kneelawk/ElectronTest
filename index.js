const {ipcRenderer} = require("electron");
const $ = require("./libs/jquery-3.1.0.min.js");

var loggingIn = false;

$(() => {
  $("[name=curse-login]").click(() => {
    if (!loggingIn) {
      loggingIn = true;
      console.log("Logging in...");
      let username = $("[name=curse-username]").val();
      let password = $("[name=curse-password]").val();
      console.log("Username: " + username);
      ipcRenderer.send("login", {username: username, password: password});
    }
  });
});

ipcRenderer.on("login-success", (event, arg) => {
  let result = $("#login-result-field");
  result.removeClass();
  result.addClass("login-success-field");
  result.text(arg.message);
  loggingIn = false;
  result.show();
  let doneButton = $("[name=done-login]");
  doneButton.show();
  doneButton.click(() => {
    $(".login-pane").hide();
  });
});

ipcRenderer.on("login-failure", (event, arg) => {
  let result = $("#login-result-field");
  result.removeClass();
  result.addClass("login-error-field");
  console.log("Login failure: " + arg.message);
  result.text(arg.message);
  loggingIn = false;
  result.show();
});
