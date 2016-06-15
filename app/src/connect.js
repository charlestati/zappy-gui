const path = require('path');
const ipc = require('electron').ipcMain;
const Socket = require(path.join(__dirname, 'Socket.js'));

const renderProcesses = [];
const delimiter = '\n';

ipc.on('connect', (event, args) => {
  const host = args.host;
  const port = args.port;
  const process = {
    socket: new Socket,
    sender: event.sender,
    buffer: '',
  };

  renderProcesses.push(process);

  process.socket.connect(host, port).then(() => {
    process.sender.send('connect', { status: 'success' });
  }, e => {
    process.sender.send('connect', { status: 'error', code: e.code });
  });

  process.socket.on('data', data => {
    process.buffer += data.toString();
    let i = process.buffer.indexOf(delimiter);
    while (i >= 0) {
      const command = process.buffer.substring(0, i);
      process.sender.send('data', command);
      process.buffer = process.buffer.substring(i + 1);
      i = process.buffer.indexOf(delimiter);
    }
  });

  process.socket.on('close', () => {
    process.sender.send('close');
  });

  process.socket.on('error', e => {
    process.sender.send('error', e);
  });
});

ipc.on('send', (event, msg) => {
  for (let i = 0; i < renderProcesses.length; ++i) {
    if (event.sender === renderProcesses[i].sender) {
      console.log(i);
      renderProcesses[i].socket.send(msg);
    }
  }
});
