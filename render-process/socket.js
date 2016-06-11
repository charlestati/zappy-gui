const ipc = require('electron').ipcRenderer;

document.getElementById('server-info').addEventListener('submit', e => {
  e.preventDefault();
  const serverIp = document.getElementById('server-ip').value;
  const serverPort = document.getElementById('server-port').value;
  ipc.send('connect', { ip: serverIp, port: serverPort });
});
