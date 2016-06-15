const path = require('path');
const Promise = require('bluebird');
const GameClient = require(path.join(__dirname, 'GameClient.js'));

class Game {
  constructor(app) {
    this.app = app;
    this.isReady = false;

    this.renderer = null;
    this.client = null;

    this.dataBuffer = '';
  }

  setup(entities, background, foreground) {
    //this.setRenderer(new Renderer(this, entities, background, foreground));
  }

  setRenderer(renderer) {
    this.renderer = renderer;
  }

  loadMap() {
    return new Promise((resolve, reject) => {
      resolve();
    });
  }

  setupServer(host, port) {
    this.host = host;
    this.port = port;
  }

  loadSprites() {
    return new Promise((resolve, reject) => {
      resolve();
    });
  }

  run() {
    this.loadSprites().then(() => {
      this.connect();
    });
  }

  handleCommand(command) {
    console.log(command);
  }

  receiveData(data) {
    this.dataBuffer += data.toString();
    let i = this.dataBuffer.indexOf('\n');
    while (i >= 0) {
      const command = this.dataBuffer.substring(0, i);
      this.handleCommand(command);
      this.dataBuffer = this.dataBuffer.substring(i + 1);
      i = this.dataBuffer.indexOf('\n');
    }
  }

  connect() {
    this.client = new GameClient(this.host, this.port);
    this.client.connect().then(() => {
      this.client.sendHello();
    });

    this.client.on('error', e => {
      console.log(e.code);
    });

    this.client.on('close', () => {
      console.log('closed');
    });

    this.client.on('data', data => {
      this.receiveData(data);
    });

    this.start();
  }

  start() {
    this.tick();
    console.log('Game loop started');
  }

  tick() {
    this.currentTime = new Date().getTime();

    if (this.started) {
      //this.updater.update();
      //this.renderer.renderFrame();
    }

    if (!this.isStopped) {
      //raf(this.tick.bind(this));
    }
  }
}

module.exports = Game;
