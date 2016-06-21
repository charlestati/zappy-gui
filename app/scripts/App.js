class App {
  constructor() {
    this.intro = document.querySelector('.server-info');
    this.canvas = document.querySelector('#canvas');
  }

  setGame(game) {
    this.game = game;
  }

  start(host, port) {
    this.hideIntro();
    this.game.run(host, port);
  }

  hideIntro() {
    this.intro.style.display = 'none';
    this.canvas.style.display = 'block';
  }

  showIntro() {
    this.intro.style.display = 'block';
    this.canvas.style.display = 'none';
  }
}

module.exports = App;
