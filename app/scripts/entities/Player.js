const path = require('path');
const Entity = require(path.join(__dirname, 'Entity.js'));

class Player extends Entity {
  constructor(x, y, state) {
    super(x, y, state);

    this.sprite = this.state.playerSprites.create((this.x * this.state.gridSize) - 8,
      (this.y * this.state.gridSize) - 16, 'priest');
    this.sprite.animations.add('idle');
    this.sprite.animations.play('idle', 1, true);

    this.sprite.inputEnabled = true;
    this.sprite.events.onInputDown.add((sprite) => {
      const tween = this.state.add.tween(this.state.camera).to({
        x: this.x * this.state.gridSize - 8 - this.state.camera.width / 2,
        y: this.y * this.state.gridSize - 16 - this.state.camera.height / 2,
      }, 500, Phaser.Easing.Quadratic.InOut, true);
      tween.onComplete.add(() => {
        this.state.camera.follow(sprite, 100);
      }, this);
    }, this.state);

    this.isMoving = false;

    this.sprite.scale.setTo(2, 2);
    this.sprite.smoothed = false;
  }

  moveTo(x, y) {
    if (this.isMoving) {
      return;
    }

    this.isMoving = true;

    this.state.add.tween(this.sprite).to({
      x: x * this.state.gridSize - 8,
      y: y * this.state.gridSize - 16,
    }, 250, Phaser.Easing.Quadratic.InOut, true).onComplete.add(() => {
      this.isMoving = false;
    }, this);
  }
}

module.exports = Player;
