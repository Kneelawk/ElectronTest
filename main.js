const {app, BrowserWindow, ipcMain} = require("electron");
const https = require("https");
const url = require("url");
const Curse = require("./curse.js").Curse;

let curse = new Curse();

let win;

function createWindow() {
  win = new BrowserWindow({width: 1280, height: 720});
  win.on("close", function () {
    win = null;
  });
  win.loadURL("file://" + __dirname + "/index.html");
  win.setMenu(null);
  win.webContents.openDevTools();
  console.log("Created window");
}

app.on("ready", createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (win == null) {
    createWindow();
  }
});

ipcMain.on("login", (event, arg) => {
  console.log("Logging in...");
  console.log("Username: " + arg.username);

  curse.login(arg.username, arg.password, (token) => {
    console.log("Login success");
    event.sender.send("login-success", { message: "Login success" });
  }).on("error", (error) => {
    let message;
    if (error.status == 401) {
      message = "Invalid username or password";
    } else if (error.errorType == "statusCode") {
      message = "Error logging in";
    } else if (error.errorType == "error") {
      message = "Error logging in";
    }
    console.log("Login failure: " + message);
    event.sender.send("login-failure", { message: message });
  });
});
