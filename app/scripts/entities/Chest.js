const path = require('path');
const Entity = require(path.join(__dirname, 'Entity.js'));

class Chest extends Entity {
  constructor(x, y, state) {
    super(x, y, state);

    this.sprite = this.state.chestSprites.create(x * this.state.gridSize,
      y * this.state.gridSize, 'chest');

    this.sprite.scale.set(1, 1);
    this.sprite.smoothed = false;
  }

  destroy() {
    this.sprite.destroy();
  }
}

module.exports = Chest;
