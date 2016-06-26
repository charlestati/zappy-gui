const path = require('path');
const Entity = require(path.join(__dirname, 'Entity.js'));

class Meat extends Entity {
  constructor(x, y, state) {
    super(x, y, state);

    this.sprite = this.state.gemSprites.create(x * this.state.gridSize + 2,
      y * this.state.gridSize, 'meat');

    this.sprite.scale.set(0.25, 0.25);
    this.sprite.smoothed = false;
  }

  destroy() {
    const tween = this.state.add.tween(this.sprite).to({
      alpha: 0,
    }, 500, Phaser.Easing.Linear.None, true);
    tween.onComplete.add(() => {
      this.sprite.destroy();
    }, this);
  }
}

module.exports = Meat;
