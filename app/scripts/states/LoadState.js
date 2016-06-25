class LoadState extends Phaser.State {
  preload() {
    const loadingText = this.game.add.text(0, 0, 'Loading assets…', {
      font: '30px Courier',
      fill: '#adc429',
      boundsAlignH: 'center',
      boundsAlignV: 'middle',
    });

    loadingText.setShadow(3, 3, 'rgba(0, 0, 0, 0.5)', 2);
    loadingText.setTextBounds(0, 0, this.stage.width / 2, this.stage.height);

    this.load.tilemap('trantor', 'tilemaps/trantor.json', null, Phaser.Tilemap.TILED_JSON);
    this.load.image('tiles', 'images/trantor.png');
    this.load.image('chest', 'images/chest.png');
    this.load.image('shadow', 'images/shadow.png');
    this.load.image('linemate', 'images/linemate.png');
    this.load.image('deraumere', 'images/deraumere.png');
    this.load.image('sibur', 'images/sibur.png');
    this.load.image('mendiane', 'images/mendiane.png');
    this.load.image('phiras', 'images/phiras.png');
    this.load.image('thystame', 'images/thystame.png');
    this.load.image('meat', 'images/meat.png');
    this.load.spritesheet('brendan', 'images/brendan.png', 14, 21, 12);
    this.load.spritesheet('burger', 'images/burger.png', 16, 16, 6);
    this.load.spritesheet('eye', 'images/eye.png', 42, 48, 126);
    this.load.spritesheet('sparks', 'images/sparks.png', 16, 16, 6);
    this.load.audio('route_101', 'audio/route_101.mp3');
  }

  create() {
    this.game.state.start('game');
  }
}

module.exports = LoadState;
