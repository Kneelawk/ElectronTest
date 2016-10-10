const Client = require("node-rest-client").Client;
const EventEmitter = require("event");

var curseBase = "https://curse-rest-proxy.azurewebsites.net/api/";
var loginUrl = curseBase + "authenticate";

class LoginResult extends EventEmitter {}

exports.Curse = class Curse {
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
        result.emit("error", "Response code: " + response.statusCode);
        return;
      }
      let token = "Token " + data.session.user_id + ":" + data.session.token;
      callback(token);
    }).on("error", (error) => {
      result.emit("error", error);
    });

    return result;
  }
};
