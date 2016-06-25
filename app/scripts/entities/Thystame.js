const path = require('path');
const Entity = require(path.join(__dirname, 'Entity.js'));

class Thystame extends Entity {
  constructor(x, y, state) {
    super(x, y, state);

    const realX = x * this.state.gridSize + 2 + this.state.gridSize / 2;
    const realY = y * this.state.gridSize + this.state.gridSize * 1.75;

    this.sprite = this.state.gemSprites.create(realX, realY, 'thystame');

    this.sprite.scale.set(0.25, 0.25);
    this.sprite.smoothed = false;
  }

  destroy() {
    this.sprite.destroy();
  }
}

module.exports = Thystame;
