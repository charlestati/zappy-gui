const net = require('net');
const Promise = require('bluebird');

class Socket {
  constructor() {
    this.socket = new net.Socket();
    this.sendDelimiter = '\n';
  }

  connect(host, port) {
    return new Promise((resolve, reject) => {
      this.socket.on('error', e => {
        reject(e);
      });
      this.socket.connect(port, host, resolve);
    });
  }

  send(msg) {
    this.socket.write(msg + this.sendDelimiter);
  }
}

module.exports = Socket;
