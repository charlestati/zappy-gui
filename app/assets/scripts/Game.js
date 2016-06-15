const ipc = require('electron').ipcRenderer;
const Promise = require('bluebird');

class Game {
  constructor(app) {
    this.app = app;
    this.isReady = false;
    this.started = false;
    this.hasNeverStarted = true;

    this.renderer = null;
    this.updater = null;
    this.audioManager = null;
  }

  setup(entities, background, foreground) {
    //this.setRenderer(new Renderer(this, entities, background, foreground));
  }

  setRenderer(renderer) {
    this.renderer = renderer;
  }

  setUpdater(updater) {
    this.updater = updater;
  }

  loadMap() {
    return new Promise((resolve, reject) => {
      resolve();
    });
  }

  setupServer(host, port) {
    ipc.send('connect', { host, port });
  }

  run() {
    console.log('Running!');
  }
}

module.exports = Game;
