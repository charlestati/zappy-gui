const path = require('path');
const _ = require('lodash');
const GameClient = require(path.join(__dirname, '..', 'GameClient.js'));
const Player = require(path.join(__dirname, '..', 'entities', 'Player.js'));
const Chest = require(path.join(__dirname, '..', 'entities', 'Chest.js'));
const Burger = require(path.join(__dirname, '..', 'entities', 'Burger.js'));
const Egg = require(path.join(__dirname, '..', 'entities', 'Egg.js'));

class GameState extends Phaser.State {
  preload() {
    this.connect(this.game.global.host, this.game.global.port);
  }

  create() {
    this.worldScale = 1;
    this.minScale = 1;
    this.maxScale = 3;
    this.gridSize = 16;
    this.offsetX = 10 * this.gridSize;
    this.offsetY = 10 * this.gridSize;

    this.tilemap = this.add.tilemap('trantor');
    this.tilemap.addTilesetImage('trantor', 'tiles');

    this.layerGrass = this.tilemap.createLayer('grass');
    this.layerGrass.wrap = true;
    this.layerGrass.smoothed = false;

    this.layerVegetals = this.tilemap.createLayer('flowers');
    this.layerVegetals.wrap = true;
    this.layerVegetals.smoothed = false;

    this.gemSprites = this.add.group();
    this.foodSprites = this.add.group();
    this.playerSprites = this.add.group();
    this.eggSprites = this.add.group();

    this.setupKeys();
    this.setupGamepad();

    this.gems = [];
    this.food = [];
    this.players = [];
    this.eggs = [];

    this.followingId = 0;

    this.soundtrack = this.add.audio('route_101', 1, true);
    this.soundtrack.play();
  }

  updateScale() {
    this.world.scale.set(this.worldScale);

    // todo Camera bug when scaling
    /*
     this.camera.scale.set(this.worldScale);

     this.layerGrass.scale.set(this.worldScale);
     this.layerVegetals.scale.set(this.worldScale);

     this.gemSprites.scale.set(this.worldScale);
     this.foodSprites.scale.set(this.worldScale);
     this.playerSprites.scale.set(this.worldScale);
     */
  }

  worldZoomIn() {
    this.worldScale += 0.05;
    this.worldScale = Phaser.Math.clamp(this.worldScale, this.minScale, this.maxScale);
    this.updateScale();
  }

  worldZoomOut() {
    this.worldScale -= 0.05;
    this.worldScale = Phaser.Math.clamp(this.worldScale, this.minScale, this.maxScale);
    this.updateScale();
  }

  followNext() {
    if (this.players.length > 0) {
      ++this.followingId;
      if (this.followingId >= this.players.length) {
        this.followingId = 0;
      }
      this.players[this.followingId].follow();
    }
  }

  followPrev() {
    if (this.players.length > 0) {
      --this.followingId;
      if (this.followingId <= 0) {
        this.followingId = this.players.length - 1;
      }
      this.players[this.followingId].follow();
    }
  }

  setupKeys() {
    this.cursors = this.input.keyboard.createCursorKeys();

    const keyExit = this.input.keyboard.addKey(Phaser.Keyboard.ESC);
    keyExit.onDown.add(() => {
      this.game.global.app.showIntro();
      this.game.destroy();
    });

    const keyI = this.input.keyboard.addKey(Phaser.Keyboard.I);
    keyI.onHoldCallback = () => {
      if (this.worldScale < this.maxScale) {
        this.worldZoomIn();
      }
    };

    const keyO = this.input.keyboard.addKey(Phaser.Keyboard.O);
    keyO.onHoldCallback = () => {
      if (this.worldScale > this.minScale) {
        this.worldZoomOut();
      }
    };

    const keySpacebar = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    keySpacebar.onDown.add(() => {
      this.followNext();
    });
  }

  setupGamepad() {
    this.game.input.gamepad.start();
    this.pad = this.game.input.gamepad.pad1;

    this.pad.addCallbacks(this, {
      onConnect: () => {
        const rightBumper = this.pad.getButton(Phaser.Gamepad.XBOX360_RIGHT_BUMPER);
        const leftBumper = this.pad.getButton(Phaser.Gamepad.XBOX360_LEFT_BUMPER);
        const aButton = this.pad.getButton(Phaser.Gamepad.XBOX360_A);
        const bButton = this.pad.getButton(Phaser.Gamepad.XBOX360_B);

        const rightBumperCb = () => {
          if (this.worldScale < this.maxScale) {
            this.worldZoomIn();
            this.worldZoomIn();
          }
        };

        const leftBumperCb = () => {
          if (this.worldScale > this.minScale) {
            this.worldZoomOut();
            this.worldZoomOut();
          }
        };

        rightBumper.onDown.add(rightBumperCb);

        leftBumper.onDown.add(leftBumperCb);

        aButton.onDown.add(() => {
          this.followNext();
        });

        bButton.onDown.add(() => {
          this.followPrev();
        });
      },
    });
  }

  setupWorld() {
    if (this.mapWidth < 30 && this.mapHeight < 30) {
      if (this.mapWidth < 10 && this.mapHeight < 10) {
        this.worldScale = this.maxScale;
      } else {
        this.worldScale = 2;
      }
      this.world.scale.set(this.worldScale);
    }

    const width = this.mapWidth * this.gridSize;
    const height = this.mapHeight * this.gridSize;

    this.world.setBounds(-this.offsetX, -this.offsetY,
      width + this.offsetX * 2, height + this.offsetY * 2);

    this.updateScale();
  }

  addPlayer(x, y, id, team, spriteName) {
    this.players.push(new Player(x, y, id, team, spriteName, this));
  }

  update() {
    this.updateCamera();
  }

  updateCamera() {
    let speed = 10;

    if (this.game.input.keyboard.isDown(Phaser.Keyboard.SHIFT)
      || this.pad.isDown(Phaser.Gamepad.XBOX360_RIGHT_TRIGGER)) {
      speed = 30;
    }

    if (this.cursors.up.isDown) {
      this.camera.follow(null);
      this.camera.y -= speed;
    } else if (this.cursors.down.isDown) {
      this.camera.follow(null);
      this.camera.y += speed;
    }

    if (this.cursors.left.isDown) {
      this.camera.follow(null);
      this.camera.x -= speed;
    } else if (this.cursors.right.isDown) {
      this.camera.follow(null);
      this.camera.x += speed;
    }

    if (this.pad.isDown(Phaser.Gamepad.XBOX360_DPAD_LEFT)
      || this.pad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) < -0.1) {
      this.camera.follow(null);
      this.camera.x -= speed;
    } else if (this.pad.isDown(Phaser.Gamepad.XBOX360_DPAD_RIGHT)
      || this.pad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) > 0.1) {
      this.camera.follow(null);
      this.camera.x += speed;
    }

    if (this.pad.isDown(Phaser.Gamepad.XBOX360_DPAD_UP)
      || this.pad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y) < -0.1) {
      this.camera.follow(null);
      this.camera.y -= speed;
    } else if (this.pad.isDown(Phaser.Gamepad.XBOX360_DPAD_DOWN)
      || this.pad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y) > 0.1) {
      this.camera.follow(null);
      this.camera.y += speed;
    }
  }

  tileHasFood(x, y) {
    return _.find(this.food, f =>
      f.x === x && f.y === y
    );
  }

  tileHasGem(x, y) {
    return _.find(this.gems, g =>
      g.x === x && g.y === y
    );
  }

  getPlayerFromId(id) {
    return _.find(this.players, player =>
      player.id === id
    );
  }

  getEggFromId(id) {
    return _.find(this.eggs, egg =>
      egg.id === id
    );
  }

  getPlayersOnTile(x, y) {
    return _.filter(this.players, (player) =>
      player.x === x && player.y === y
    );
  }

  removeFood(x, y) {
    const food = _.find(this.food, f =>
      f.x === x && f.y === y
    );

    if (food) {
      this.food = _.without(this.food, food);
      food.destroy();
    }
  }

  removeGems(x, y) {
    const chest = _.find(this.gems, g =>
      g.x === x && g.y === y
    );

    if (chest) {
      this.chest = _.without(this.chest, chest);
      chest.destroy();
    }
  }

  removePlayer(id) {
    const player = this.getPlayerFromId(id);

    if (player) {
      this.players = _.without(this.players, player);
      player.destroy();
    }
  }

  spawnEgg(x, y, eggId, playerId) {
    this.eggs.push(new Egg(x, y, eggId, playerId, this));
  }

  removeEgg(id) {
    const egg = this.getEggFromId(id);

    if (egg) {
      this.eggs = _.without(this.eggs, egg);
      egg.destroy();
    }
  }

  receiveMsz(x, y) {
    this.mapWidth = x;
    this.mapHeight = y;
    this.setupWorld();
    // todo Debug grid
    if (false) {
      this.game.add.sprite(0, 0, this.game.create.grid('grid',
        16 * this.mapWidth,
        16 * this.mapHeight,
        16, 16, 'rgba(250, 0, 0, 0.5)'));
    }
  }

  receiveBct(x, y, q1, q2, q3, q4, q5, q6, q7) {
    if (q1 > 0) {
      if (!this.tileHasFood(x, y)) {
        this.food.push(new Burger(x, y, this));
      }
    } else {
      this.removeFood(x, y);
    }

    if (q2 > 0 || q3 > 0 || q4 > 0 || q5 > 0 || q6 > 0 || q7 > 0) {
      if (!this.tileHasGem(x, y)) {
        this.gems.push(new Chest(x, y, this));
      }
    } else {
      this.removeGems(x, y);
    }
  }

  receivePnw(id, x, y, orientation, level, team) {
    this.addPlayer(x, y, id, team, 'brendan');
  }

  receivePpo(id, x, y, orientation) {
    const player = this.getPlayerFromId(id);

    if (player) {
      player.moveTo(x, y, orientation);
    }
  }

  receivePdi(id) {
    this.removePlayer(id);
  }

  receiveEnw(eggId, playerId, x, y) {
    this.spawnEgg(x, y, eggId, playerId);
  }

  receiveEdi(id) {
    this.removeEgg(id);
  }

  receiveEbo(id) {
    this.removeEgg(id);
  }

  receiveEht(id) {
    this.removeEgg(id);
  }

  receiveSeg(team) {
    alert(`Team ${team} won!`);
    this.game.global.app.showIntro();
    this.game.destroy();
  }

  receivePic(x, y, level, ...playerIds) {
    for (let i = 0; i < playerIds.length; ++i) {
      const player = this.getPlayerFromId(playerIds[i]);

      if (player) {
        player.startCasting();
      }
    }
  }

  receivePie(x, y, result) {
    const players = this.getPlayersOnTile(x, y);

    for (let i = 0; i < players.length; ++i) {
      players[i].stopCasting();
    }
  }

  handleData(data) {
    const args = data.split(' ');
    const command = _.head(args);
    const handler = `receive${command.charAt(0).toUpperCase()}${command.slice(1)}`;
    const parameters = _.tail(args);


    if (typeof this[handler] === 'function') {
      this[handler].apply(this, parameters);
    }
  }

  connect(host, port) {
    this.client = new GameClient(host, port);

    this.client.on('error', e => {
      console.log(e.code);
    });

    this.client.on('close', () => {
      this.game.global.app.showIntro();
      this.game.destroy();
    });

    this.client.on('data', (data) => {
      this.handleData(data);
    });

    this.client.on('connect', () => {
      this.client.sendHello();
    });

    this.client.connect();
  }
}

module.exports = GameState;
