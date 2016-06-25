const path = require('path');
const Entity = require(path.join(__dirname, 'Entity.js'));

class Egg extends Entity {
  constructor(x, y, eggId, playerId, state) {
    super(x, y, state);

    this.sprite = this.state.add.sprite(x * this.state.gridSize, y * this.state.gridSize, 'shadow');
    this.sprite.scale.set(1, 1);

    const eye = this.state.add.sprite(-12, -16, 'eye');
    eye.animations.add('idle', [39]);
    eye.animations.play('idle', 4, true);
    eye.smoothed = false;

    this.sprite.addChild(eye);

    this.state.eggSprites.add(this.sprite);
  }

  destroy() {
    this.sprite.destroy();
  }
}

module.exports = Egg;
