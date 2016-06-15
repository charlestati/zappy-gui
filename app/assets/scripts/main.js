const path = require('path');
const App = require(path.join(__dirname, 'assets', 'scripts', 'App.js'));
const Game = require(path.join(__dirname, 'assets', 'scripts', 'Game.js'));

function initGame(app) {
  const background = document.getElementById('background');
  const entities = document.getElementById('entities');
  const foreground = document.getElementById('foreground');

  const game = new Game(app);
  game.setup(entities, background, foreground);
  app.setGame(game);
}

function initApp() {
  const app = new App();

  initGame(app);

  document.querySelector('.server-info').addEventListener('submit', event => {
    event.preventDefault();
    const host = document.querySelector('.server-ip').value;
    const port = document.querySelector('.server-port').value;
    app.tryStartingGame(host, port);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initApp();
});
