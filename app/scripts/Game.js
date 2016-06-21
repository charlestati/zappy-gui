window.PIXI = require('phaser/build/custom/pixi');
window.p2 = require('phaser/build/custom/p2');
window.Phaser = require('phaser/build/custom/phaser-split');
const path = require('path');
const BootState = require(path.join(__dirname, 'states', 'BootState.js'));
const LoadState = require(path.join(__dirname, 'states', 'LoadState.js'));
const GameState = require(path.join(__dirname, 'states', 'GameState.js'));

class Game extends Phaser.Game {
  constructor(app) {
    // todo Test with non retina screen
    // window.devicePixelRatio = 1;
    const config = {
      width: window.innerWidth,
      height: window.innerHeight,
      renderer: Phaser.AUTO,
      parent: 'canvas',
      resolution: window.devicePixelRatio,
    };
    super(config);
    this.global = {};
    this.global.app = app;
    this.setupStates();
  }

  setupStates() {
    this.state.add('boot', BootState, false);
    this.state.add('load', LoadState, false);
    this.state.add('game', GameState, false);
  }

  run(host, port) {
    this.global.host = host;
    this.global.port = port;
    this.state.start('boot');
  }
}

module.exports = Game;
