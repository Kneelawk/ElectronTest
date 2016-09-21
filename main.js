const {app, BrowserWindow, ipcMain} = require("electron");
const http = require("http");

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

  var options = {
    "host": "curse-rest-proxy.azurewebsites.net",
    "path": "/authenticate",
    "method": "POST"
  };
  var data = {
    "username": arg.username,
    "password": arg.password
  };
  var req = http.request(options, (response) => {
    if (response.statusCode != 200) {
      var message = "";
      if (response.statusCode == 401) {
        message = "401: Bad login";
      } else {
        message = response.statusCode;
      }
      console.log("Login failure: " + message);
      event.sender.send("login-failure", { message: "Login failure: " + message})
    }

    var responseData = "";
    response.on("data", (data) => {
      responseData += data;
    });
    response.on("finish", (something) => {
      if (response.statusCode == 200) {
        var responseObj = JSON.parse(responseData);
        var message = "Auth token: Token " + responseObj.user_id + ":" + responseObj.token;
        console.log("Login success: " + message);
        event.sender.send("login-success", { message: "Login success: " + message });
      }
    });
  });
  req.write(JSON.stringify(data));
  req.end();
});
