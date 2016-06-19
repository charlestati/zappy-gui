class LoadState extends Phaser.State {
  preload() {
    this.game.add.text(80, 150, 'Loading…', {
      font: '30px Courier',
      fill: '#ffffff',
    });

    this.load.tilemap('trantor', 'tilemaps/trantor.json', null, Phaser.Tilemap.TILED_JSON);
    this.load.image('tiles', 'images/trantor.png');
    this.load.spritesheet('priest', 'images/priest.png', 24, 24, 2);
  }

  create() {
    this.game.state.start('game');
  }
}

module.exports = LoadState;
