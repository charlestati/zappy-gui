const ipc = require('electron').ipcMain;
const net = require('net');
const client = new net.Socket();
const recvDelimiter = '\n';
const sendDelimiter = '\r\n';

function sendMessage(msg) {
  client.write(`${msg}${sendDelimiter}`);
}

function handleData(data) {
  console.log(`Received: ${data}`);
}

function setupSocket(serverIp, serverPort) {
  client.connect(serverPort, serverIp, () => {
    console.log('Connected');
    sendMessage('GRAPHIC');
  });

  let chunk = '';
  client.on('data', data => {
    chunk += data.toString();
    let i = chunk.indexOf(recvDelimiter);

    while (i >= 0) {
      const command = chunk.substring(0, i);
      handleData(command);
      chunk = chunk.substring(i + 1);
      i = chunk.indexOf(recvDelimiter);
    }
  });

  client.on('error', e => {
    console.log(e.code);
  });

  client.on('close', () => {
    console.log('Connection closed');
  });
}

ipc.on('connect', (event, args) => {
  const serverIp = args.ip;
  const serverPort = args.port;

  if (net.isIP(serverIp) && serverPort >= 0 && serverPort <= 65535) {
    setupSocket(serverIp, serverPort);
  }
});

