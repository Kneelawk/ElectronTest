const Client = require("node-rest-client").Client;
const EventEmitter = require("events");

var curseBase = "https://curse-rest-proxy.azurewebsites.net/api/";
var loginUrl = curseBase + "authenticate";

class LoginResult extends EventEmitter {}

module.exports.Curse = class Curse {
  constructor() {
    this.client = new Client();
  }

  login(username, password, callback = (token) => {}) {
    let data = {
      "username": username,
      "password": password
    };
    let headers = {
      "Content-Type": "application/json"
    };
    let args = {
      data,
      headers
    };

    let result = new LoginResult();

    this.client.post(loginUrl, args, (data, response) => {
      if (response.statusCode / 100 != 2) {
        result.emit("error", { errorType: "statusCode", message: "Response code: " + response.statusCode, status: response.statusCode });
        return;
      }
      let token = "Token " + data.session.user_id + ":" + data.session.token;
      callback(token);
      this.token = token;
    }).on("error", (error) => {
      result.emit("error", { errorType: "error", error: error });
    });

    return result;
  }
};
