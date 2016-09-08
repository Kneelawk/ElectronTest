const {ipcRenderer} = require("electron");
const $ = require("./libs/jquery-3.1.0.min.js");

var loggingIn = false;

$(function () {
  $("[name=curse-login]").click(function () {
    if (!loggingIn) {
      console.log("Logging in");

    }
  });
});
