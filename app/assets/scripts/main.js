const path = require('path');
const ipc = require('electron').ipcRenderer;
const App = require(path.join(__dirname, 'assets', 'scripts', 'App.js'));
const Game = require(path.join(__dirname, 'assets', 'scripts', 'Game.js'));

function initGame(app) {
  const background = document.getElementById('background');
  const entities = document.getElementById('entities');
  const foreground = document.getElementById('foreground');

  const game = new Game(app);
  game.setup(entities, background, foreground);
  game.loadMap().then(() => {
    app.setGame(game);
  });
}

function initApp() {
  const app = new App();

  initGame(app);

  const formConnect = document.getElementById('server-info');

  formConnect.addEventListener('submit', event => {
    event.preventDefault();
    const host = document.getElementById('server-ip').value;
    const port = document.getElementById('server-port').value;
    app.tryStartingGame(host, port);
  });

  ipc.on('connect', (event, response) => {
    app.socketConnection(response);
  });

  ipc.on('close', () => {
    app.socketClose();
  });

  ipc.on('error', (event, e) => {
    app.socketError(e);
  });

  ipc.on('data', (event, response) => {
    app.handleData(response);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initApp();
});
