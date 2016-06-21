const net = require('net');
const Promise = require('bluebird');

class Socket {
  constructor() {
    this.socket = new net.Socket();
    this.sendDelimiter = '\n';
  }

  connect(host, port) {
    this.socket.connect(port, host);
  }

  send(msg) {
    this.socket.write(msg + this.sendDelimiter);
  }

  on(event, cb) {
    return this.socket.on(event, cb);
  }
}

module.exports = Socket;
