class App {
  constructor() {
    this.isReady = false;
    this.intro = document.querySelector('.server-info');
    this.startButton = document.querySelector('.start');
  }

  setGame(game) {
    this.game = game;
    game.loadMap().then(() => {
      this.isReady = true;
    });
  }

  tryStartingGame(host, port) {
    if (!this.isReady) {
      this.startButton.classList.add('loading');
      const watchCanStart = setInterval(() => {
        console.log('Waiting...');
        if (this.isReady) {
          clearInterval(watchCanStart);
          this.startButton.classList.remove('loading');
          this.startGame(host, port);
        }
      }, 100);
    } else {
      this.startGame(host, port);
    }
  }

  startGame(host, port) {
    this.hideIntro();
    this.start(host, port);
  }

  start(host, port) {
    this.game.setupServer(host, port);
    this.game.run();
  }

  hideIntro() {
    this.intro.style.display = 'none';
  }

  showIntro() {
    this.intro.style.display = 'block';
  }
}

module.exports = App;
