const path = require('path');
const App = require(path.join(__dirname, 'scripts', 'App.js'));
const Game = require(path.join(__dirname, 'scripts', 'Game.js'));

function initApp() {
  const app = new App();

  document.querySelector('.server-info').addEventListener('submit', event => {
    event.preventDefault();
    const host = document.querySelector('.server-ip').value;
    const port = document.querySelector('.server-port').value;

    const game = new Game(app);
    app.setGame(game);

    app.start(host, port);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initApp();
});
