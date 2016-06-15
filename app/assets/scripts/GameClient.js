const path = require('path');
const Socket = require(path.join(__dirname, 'Socket.js'));

class GameClient {
  constructor(host, port) {
    this.host = host;
    this.port = port;
    this.socket = new Socket();
  }

  connect() {
    return this.socket.connect(this.host, this.port);
  }

  sendHello() {
    this.socket.send('GRAPHIC');
  }

  on(event, cb) {
    return this.socket.on(event, cb);
  }
}

module.exports = GameClient;
