const ipc = require('electron').ipcRenderer;

document.getElementById('server-info').addEventListener('submit', e => {
  e.preventDefault();
  const host = document.getElementById('server-ip').value;
  const port = document.getElementById('server-port').value;
  ipc.send('connect', { host, port });
});

ipc.on('connect', (event, response) => {
  console.log(response.status);
});

ipc.on('error', () => {
  // alert('error');
});

ipc.on('close', () => {
  alert('close');
});
