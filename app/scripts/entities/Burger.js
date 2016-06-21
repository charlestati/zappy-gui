const path = require('path');
const Entity = require(path.join(__dirname, 'Entity.js'));

class Burger extends Entity {
  constructor(x, y, state) {
    super(x, y, state);

    this.sprite = this.state.foodSprites.create(x * this.state.gridSize,
      y * this.state.gridSize, 'burger');
    this.sprite.animations.add('idle');
    this.sprite.animations.play('idle', 5, true);

    this.sprite.scale.setTo(1.5, 1.5);
    this.sprite.smoothed = false;
  }
}

module.exports = Burger;
