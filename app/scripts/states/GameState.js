const path = require('path');
const _ = require('lodash');
const GameClient = require(path.join(__dirname, '..', 'GameClient.js'));
const Player = require(path.join(__dirname, '..', 'entities', 'Player.js'));
const Chest = require(path.join(__dirname, '..', 'entities', 'Chest.js'));
const Burger = require(path.join(__dirname, '..', 'entities', 'Burger.js'));

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

    this.setupKeys();
    this.setupGamepad();

    this.players = [];
    this.gems = [];
    this.food = [];
  }

  worldZoomIn() {
    this.worldScale += 0.05;
    this.worldScale = Phaser.Math.clamp(this.worldScale, this.minScale, this.maxScale);
    this.world.scale.set(this.worldScale);
  }

  worldZoomOut() {
    this.worldScale -= 0.05;
    this.worldScale = Phaser.Math.clamp(this.worldScale, this.minScale, this.maxScale);
    this.world.scale.set(this.worldScale);
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
  }

  setupGamepad() {
    this.game.input.gamepad.start();
    this.pad = this.game.input.gamepad.pad1;

    this.pad.addCallbacks(this, {
      onConnect: () => {
        const rightTrigger = this.pad.getButton(Phaser.Gamepad.XBOX360_RIGHT_TRIGGER);
        const leftTrigger = this.pad.getButton(Phaser.Gamepad.XBOX360_LEFT_TRIGGER);

        rightTrigger.onDown(() => {
          if (this.worldScale < this.maxScale) {
            this.worldZoomIn();
          }
        });

        leftTrigger.onDown(() => {
          if (this.worldScale > this.minScale) {
            this.worldZoomOut();
          }
        });
      },
    });
  }

  setupWorld() {
    const width = this.mapWidth * this.gridSize;
    const height = this.mapHeight * this.gridSize;
    this.world.setBounds(-this.offsetX, -this.offsetY,
      width + this.offsetX * 2, height + this.offsetY * 2);
    // todo Camera bug when scale > 1
    if (this.mapWidth < 30 && this.mapHeight < 30) {
      if (this.mapWidth < 10 && this.mapHeight < 10) {
        this.worldScale = this.maxScale;
      } else {
        this.worldScale = 2;
      }
      this.world.scale.set(this.worldScale);
    }

    // todo Until fixed
    this.world.scale.set(1);
  }

  addPlayer(x, y, id, team, spriteName) {
    this.players.push(new Player(x, y, id, team, spriteName, this));
  }

  update() {
    this.updateCamera();
  }

  updateCamera() {
    let speed = 10;

    if (this.game.input.keyboard.isDown(Phaser.Keyboard.SHIFT)) {
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
  }

  tileIsEmpty(x, y) {
    const food = _.find(this.food, f =>
      f.x === x && f.y === y
    );

    const gem = _.find(this.gems, g =>
      g.x === x && g.y === y
    );

    return !food && !gem;
  }

  getPlayerFromId(id) {
    return _.find(this.players, player =>
      player.id === id
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
      if (this.tileIsEmpty(x, y)) {
        this.food.push(new Burger(x, y, this));
      }
    } else {
      this.removeFood(x, y);
    }

    if (q2 > 0 || q3 > 0 || q4 > 0 || q5 > 0 || q6 > 0 || q7 > 0) {
      if (this.tileIsEmpty(x, y)) {
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
