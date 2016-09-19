const {ipcRenderer} = require("electron");
const $ = require("./libs/jquery-3.1.0.min.js");

var loggingIn = false;

$(function () {
  $("[name=curse-login]").click(function () {
    if (!loggingIn) {
      loggingIn = true;
      console.log("Logging in...");
      var username = $("[name=curse-username]").text();
      var password = $("[name=curse-password]").text();
      console.log("Username: " + username + ", password: " + password);
      ipcRenderer.send("login", {username: username, password: password});
      loggingIn = false;
    }
  });
});
