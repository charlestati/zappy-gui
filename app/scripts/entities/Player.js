const path = require('path');
const _ = require('lodash');
const Entity = require(path.join(__dirname, 'Entity.js'));

class Player extends Entity {
  constructor(x, y, id, team, spriteName, state) {
    super(x, y, state);

    this.id = id;
    this.team = team;

    this.level = 1;

    this.spriteWidth = 14;
    this.spriteHeight = 21;
    this.offsetX = this.spriteWidth - this.state.gridSize;
    this.offsetY = this.spriteHeight - this.state.gridSize;

    const initialX = this.x * this.state.gridSize - this.offsetX;
    const initialY = this.y * this.state.gridSize - this.offsetY;

    this.spriteShadow = this.state.add.sprite(initialX, initialY, 'shadow');

    this.spritePlayer = this.state.add.sprite(0, 0, spriteName);
    this.spritePlayer.scale.set(1, 1);
    this.spritePlayer.smoothed = false;

    this.spritePlayer.animations.add('idle_down', [0]);
    this.spritePlayer.animations.add('walk_down', [1, 2]);
    this.spritePlayer.animations.add('idle_up', [3]);
    this.spritePlayer.animations.add('walk_up', [4, 5]);
    this.spritePlayer.animations.add('idle_right', [6]);
    this.spritePlayer.animations.add('walk_right', [7, 8]);
    this.spritePlayer.animations.add('idle_left', [9]);
    this.spritePlayer.animations.add('walk_left', [10, 11]);

    this.spritePlayer.animations.play('idle_down', 1, true);

    this.spriteShadow.addChild(this.spritePlayer);

    this.inventory = {
      food: 0,
      linemate: 0,
      deraumere: 0,
      sibur: 0,
      mendiane: 0,
      phiras: 0,
      thystame: 0,
    };

    this.infoText = this.state.add.text(20, 20, this.formatInfoText(), {
      font: '16px Courier',
      fill: '#ffffff',
    });
    this.infoText.setShadow(3, 3, 'rgba(0, 0, 0, 0.5)', 2);
    this.infoText.fixedToCamera = true;
    this.infoText.visible = false;

    this.spritePlayer.inputEnabled = true;
    this.spritePlayer.events.onInputDown.add(() => {
      this.follow();
    }, this.state);

    this.state.playerSprites.add(this.spriteShadow);

    this.spriteSparks = this.state.add.sprite(0, 0, 'sparks');
    this.spriteSparks.smoothed = false;
    this.spriteSparks.animations.add('idle');
    this.spriteSparks.animations.play('idle', 6, true);
    this.spriteSparks.visible = false;
    this.spriteShadow.addChild(this.spriteSparks);

    this.isMoving = false;
    this.isCasting = false;
  }

  formatInfoText() {
    return `ID: ${this.id}
Team: ${this.team}
Level: ${this.level}
Nourriture: ${this.inventory.food}
Linemate: ${this.inventory.linemate}
Deraumère: ${this.inventory.deraumere}
Sibur: ${this.inventory.sibur}
Mendiane: ${this.inventory.mendiane}
Phiras: ${this.inventory.phiras}
Thystame: ${this.inventory.thystame}`;
  }

  moveTo(x, y, orientation) {
    if (this.isMoving) {
      return;
    }

    this.isMoving = true;

    let direction;
    switch (orientation) {
      case '1':
        direction = 'up';
        break;
      case '2':
        direction = 'right';
        break;
      case '3':
        direction = 'down';
        break;
      case '4':
        direction = 'left';
        break;
      default:
        direction = 'down';
    }

    this.spritePlayer.animations.play(`walk_${direction}`, 3, true);

    this.state.add.tween(this.spriteShadow).to({
      x: x * this.state.gridSize - this.offsetX,
      y: y * this.state.gridSize - this.offsetY,
    }, 250, Phaser.Easing.Quadratic.InOut, true).onComplete.add(() => {
      this.isMoving = false;
      this.spritePlayer.animations.play(`idle_${direction}`, 1, true);
    }, this);
  }

  destroy() {
    this.spriteShadow.destroy();
  }

  setInventory(q0, q1, q2, q3, q4, q5, q6) {
    this.inventory = {
      food: q0,
      linemate: q1,
      deraumere: q2,
      sibur: q3,
      mendiane: q4,
      phiras: q5,
      thystame: q6,
    };

    this.updatePlayerInfo();
  }

  pickedResource(resource) {
    this.updatePlayerInfo();
  }

  threwResource(resource) {
    this.updatePlayerInfo();
  }

  updatePlayerInfo() {
    this.infoText.setText(this.formatInfoText());
  }

  updateLevel(level) {
    this.level = level;
  }

  follow() {
    if (this.state.client) {
      this.state.client.send(`plv ${this.id}`);
      this.state.client.send(`pin ${this.id}`);
    }

    this.state.clearInfoText();

    this.infoText.visible = true;

    const tween = this.state.add.tween(this.state.camera).to({
      x: this.x * this.state.gridSize - this.state.camera.width / 2,
      y: this.y * this.state.gridSize - this.state.camera.height / 2,
    }, 250, Phaser.Easing.Quadratic.InOut, true);
    tween.onComplete.add(() => {
      this.state.camera.follow(this.spriteShadow, Phaser.Camera.FOLLOW_TOPDOWN);
    }, this);
  }

  startCasting() {
    if (this.isCasting) {
      return;
    }

    this.isCasting = true;
    this.spriteSparks.visible = true;
  }

  stopCasting() {
    this.spriteSparks.visible = false;
    this.isCasting = false;
  }
}

module.exports = Player;
