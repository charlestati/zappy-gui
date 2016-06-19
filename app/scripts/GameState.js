class GameState extends Phaser.State {
  create() {
    this.cursors = this.input.keyboard.createCursorKeys();
    this.swipe = this.game.input.activePointer;

    this.world.setBounds(-1000, -1000, 2000, 2000);

    this.map = this.add.tilemap('trantor');
    this.map.addTilesetImage('trantor', 'tiles');
    this.layer = this.map.createLayer('grass');
    this.layer.wrap = true;

    this.player = this.add.sprite(0, 0, 'priest');

    this.player.animations.add('idle');
    this.player.animations.play('idle', 1, true);

    this.player.inputEnabled = true;
    this.player.events.onInputDown.add(this.onDown, this);

    this.physics.enable(this.player, Phaser.Physics.ARCADE);

    this.player.isMoving = false;

    this.player.scale.setTo(2, 2);
    this.player.smoothed = false;

    this.worldScale = 1;
    this.gridSize = 16;
  }

  onDown(sprite) {
    this.camera.follow(sprite);
  }

  update() {
    if (this.cursors.up.isDown) {
      this.camera.y -= this.gridSize;
    } else if (this.cursors.down.isDown) {
      this.camera.y += this.gridSize;
    }

    if (this.cursors.left.isDown) {
      this.camera.x -= this.gridSize;
    } else if (this.cursors.right.isDown) {
      this.camera.x += this.gridSize;
    }

    if (!this.player.isMoving) {
      this.movePlayer(this.player);
    }

    if (this.swipe.isDown && (this.swipe.positionDown.y > this.swipe.position.y)) {
      this.worldScale += 0.05;
    } else if (this.swipe.isDown && (this.swipe.positionDown.y < this.swipe.position.y)) {
      this.worldScale -= 0.05;
    }

    this.worldScale = Phaser.Math.clamp(this.worldScale, 1, 3);
    this.world.scale.set(this.worldScale);

    // todo Make the player cross the world bounds
    /*
    if (snakeHead.x < 0) {
      snakeHead.x = this.game.global.mapSize;
    } else if (snakeHead.x >= this.game.global.mapSize) {
      snakeHead.x = 0;
    } else if (snakeHead.y < 0) {
      snakeHead.y = this.game.global.mapSize;
    } else if (snakeHead.y >= this.game.global.mapSize) {
      snakeHead.y = 0;
    }
    */
  }

  movePlayer(player) {
    player.isMoving = true;
    this.add.tween(player).to({
      x: player.x + this.gridSize,
      y: player.y,
    }, 250, Phaser.Easing.Quadratic.InOut, true).onComplete.add(() => {
      player.isMoving = false;
    }, this);
  }
}

module.exports = GameState;
