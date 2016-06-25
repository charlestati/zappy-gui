const path = require('path');
const Entity = require(path.join(__dirname, 'Entity.js'));

class Burger extends Entity {
  constructor(x, y, state) {
    super(x, y, state);

    this.sprite = this.state.add.sprite(x * this.state.gridSize, y * this.state.gridSize, 'shadow');
    this.sprite.scale.set(1, 1);

    const burger = this.state.add.sprite(0, -2, 'burger');
    burger.animations.add('idle');
    burger.animations.play('idle', 5, true);
    burger.smoothed = false;

    this.sprite.addChild(burger);

    this.state.burgerSprites.add(this.sprite);
  }

  destroy() {
    this.sprite.destroy();
  }
}

module.exports = Burger;
