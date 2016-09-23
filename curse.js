const Client = require("node-rest-client").Client;
const EventEmitter = require("event");

var curseBase = "https://curse-rest-proxy.azurewebsites.net/api/";
var loginUrl = curseBase + "authenticate";

class LoginResult extends EventEmitter {}

exports.Curse = class Curse {
  constructor() {
    this.client = new Client();
  }

  login(username, password, callback = () => {}) {
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
      // TODO more stuff
    }).on("error", (error) => {
      result.emit("error", error);
    });

    return result;
  }
};
