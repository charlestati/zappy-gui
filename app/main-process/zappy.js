const path = require('path');
const ipc = require('electron').ipcMain;
const net = require('net');
const Socket = require(path.join(__dirname, 'Socket.js'));
const protocol = require(path.join(__dirname, 'protocol.js'));

const server = new Socket;

ipc.on('connect', (event, args) => {
  const host = args.host;
  const port = args.port;

  server.connect(host, port).then(() => {
    event.sender.send('connect', { status: 'success' });
  }, e => {
    event.sender.send('connect', { status: 'error', code: e.code });
  });
});

/*
 let chunk = '';
 client.on('data', data => {
 chunk += data.toString();
 let i = chunk.indexOf(this.recvDelimiter);

 while (i >= 0) {
 const command = chunk.substring(0, i);
 this.handleData(command);
 chunk = chunk.substring(i + 1);
 i = chunk.indexOf(this.recvDelimiter);
 }
 });


 this.client.on('error', e => {
 console.log(e.code);
 });

 this.client.on('close', () => {
 console.log('close');
 });

 function handleData(data) {
 const args = data.split(' ');
 for (let i = 0; i < protocol.length; ++i) {
 if (protocol[i] === args[0]) {
 const response = protocol.handlers[i](_.tail(args));
 if (response) {
 console.log(response);
 }
 }
 }
 }
 */
