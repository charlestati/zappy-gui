class LoadState extends Phaser.State {
  preload() {
    const loadingText = this.game.add.text(0, 0, 'Loading…', {
      font: '30px Courier',
      fill: '#ffffff',
      boundsAlignH: 'center',
      boundsAlignV: 'middle',
    });

    loadingText.setShadow(3, 3, 'rgba(0, 0, 0, 0.5)', 2);
    loadingText.setTextBounds(0, 0, this.stage.width, this.stage.height);

    this.load.tilemap('trantor', 'tilemaps/trantor.json', null, Phaser.Tilemap.TILED_JSON);
    this.load.image('tiles', 'images/trantor.png');
    this.load.image('chest', 'images/chest.png');
    this.load.spritesheet('priest', 'images/priest.png', 24, 24, 2);
    this.load.spritesheet('burger', 'images/burger.png', 16, 16, 6);
  }

  create() {
    this.game.state.start('game');
  }
}

module.exports = LoadState;
