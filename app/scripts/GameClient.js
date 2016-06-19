const path = require('path');
const Socket = require(path.join(__dirname, 'Socket.js'));

class GameClient {
  constructor(host, port) {
    this.host = host;
    this.port = port;
    this.socket = new Socket();

    this.buffer = '';
    this.socket.on('data', data => {
      this.receiveData(data);
    });
  }

  connect() {
    return this.socket.connect(this.host, this.port);
  }

  sendHello() {
    this.socket.send('GRAPHIC');
  }

  on(event, cb) {
    if (event === 'data') {
      this.dataCallback = cb;
    } else {
      this.socket.on(event, cb);
    }
  }

  dispatchData(data) {
    if (this.dataCallback) {
      this.dataCallback(data);
    }
  }

  receiveData(data) {
    this.buffer += data.toString();
    let i = this.buffer.indexOf('\n');
    while (i >= 0) {
      const command = this.buffer.substring(0, i);
      this.dispatchData(command);
      this.buffer = this.buffer.substring(i + 1);
      i = this.buffer.indexOf('\n');
    }
  }
}

module.exports = GameClient;
