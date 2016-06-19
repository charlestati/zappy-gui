window.PIXI = require('phaser/build/custom/pixi');
window.p2 = require('phaser/build/custom/p2');
window.Phaser = require('phaser/build/custom/phaser-split');
const path = require('path');
const _ = require('lodash');
const BootState = require(path.join(__dirname, 'BootState.js'));
const LoadState = require(path.join(__dirname, 'LoadState.js'));
const GameState = require(path.join(__dirname, 'GameState.js'));
const GameClient = require(path.join(__dirname, 'GameClient.js'));

class Game extends Phaser.Game {
  constructor(app) {
    super(window.innerWidth, window.innerHeight, Phaser.AUTO, 'canvas');
    this.state.add('boot', BootState, false);
    this.state.add('load', LoadState, false);
    this.state.add('game', GameState, false);
    this.app = app;
  }

  run(host, port) {
    this.host = host;
    this.port = port;
    this.connect(host, port);
  }

  handleData(data) {
    const args = data.split(' ');
    const command = _.head(args);
    if (command === 'msz') {
      this.worldWidth = args[1];
      this.worldHeight = args[2];
    }
  }

  connect(host, port) {
    this.client = new GameClient(host, port);

    this.client.connect().then(() => {
      this.app.hideIntro();

      this.client.on('error', e => {
        console.log(e.code);
      });

      this.client.on('close', () => {
        this.app.showIntro();
        this.destroy();
      });

      this.client.on('data', this.handleData);

      this.client.sendHello();
    }, e => {
      console.log(e.code);
    });

    this.start();
  }

  start() {
    this.state.start('boot');
  }
}

module.exports = Game;
