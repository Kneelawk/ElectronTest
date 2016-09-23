const {app, BrowserWindow, ipcMain} = require("electron");
const https = require("https");
const url = require("url");

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

  var data = {
    "username": arg.username,
    "password": arg.password
  };
  var dataString = JSON.stringify(data);

  var options = {
    "host": "curse-rest-proxy.azurewebsites.net",
    "path": "/api/authenticate",
    "port": 433,
    "method": "POST",
    "headers": {
      "Content-Type": "application/json",
      "Content-Length": dataString
    }
  };

  var handler = (response) => {
    console.log("Response: " + response.statusCode);
    if (response.statusCode != 200) {
      if (Math.floor(response.statusCode / 100) == 3) {
        let opts = url.parse(response.headers.location);
        opts.method = "POST";
        let req = https.request(opts, handler);
        req.write(dataString);
        req.end();
        return;
      } else {
        var message = "";
        if (response.statusCode == 401) {
          message = "401: Bad login";
        } else {
          message = response.statusCode;
        }
        console.log("Login failure: " + message);
        event.sender.send("login-failure", { message: "Login failure: " + message});
        return;
      }
    }

    var responseData = "";
    response.on("data", (data) => {
      responseData += data;
    });
    response.on("end", (something) => {
      if (response.statusCode == 200) {
        var responseObj = JSON.parse(responseData);
        var message = "Auth token: Token " + responseObj.user_id + ":" + responseObj.token;
        console.log("Login success: " + message);
        event.sender.send("login-success", { message: "Login success: " + message });
      }
    });
  };

  var req = https.request(options, handler);
  req.write(dataString);
  req.end();
});
