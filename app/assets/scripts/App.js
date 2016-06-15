const ipc = require('electron').ipcRenderer;

class App {
  constructor() {
    this.isReady = false;
    this.intro = document.getElementById('server-info');
    this.startButton = document.getElementById('start');
  }

  setGame(game) {
    this.game = game;
    this.isReady = true;
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

  handleData(data) {
    if (data === 'BIENVENUE') {
      ipc.send('send', 'GRAPHIC');
    }
  }

  socketError(e) {
    console.log(e.code);
  }

  socketClose() {
    console.log('close');
  }

  socketConnection(response) {
    console.log(response.status);
    if (response.status === 'success') {
      document.querySelector('h1').style.color = 'green';
    } else {
      document.querySelector('h1').style.color = 'red';
    }
  }

  hideIntro() {
    this.intro.style.display = 'none';
  }
}

module.exports = App;
