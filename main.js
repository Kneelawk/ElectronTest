const {app, BrowserWindow, ipcMain} = require("electron");

let win

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

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", function () {
  if (win == null) {
    createWindow();
  }
});

ipcMain.on("login", function (event, arg) {
  console.log("Logging in...");
  console.log("Username: " + arg.username + ", password: " + arg.password);
});
