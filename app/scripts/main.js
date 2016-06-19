const path = require('path');
const App = require(path.join(__dirname, 'scripts', 'App.js'));
const Game = require(path.join(__dirname, 'scripts', 'Game.js'));

function initGame(app) {
  const game = new Game(app);
  app.setGame(game);
}

function initApp() {
  const app = new App();

  initGame(app);

  // todo Temporaire
  app.start('10.0.0.9', 4242);

  document.querySelector('.server-info').addEventListener('submit', event => {
    event.preventDefault();
    const host = document.querySelector('.server-ip').value;
    const port = document.querySelector('.server-port').value;
    app.start(host, port);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initApp();
});
